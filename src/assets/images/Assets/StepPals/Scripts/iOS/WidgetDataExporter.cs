//
// WidgetDataExporter.cs
// StepPals Unity Integration
//


using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Models;
using Data.Models.PlayerPetsModels;
using Data.Types;
using Managers;
using Newtonsoft.Json;
using UniRx;
using UnityEngine;
using Zenject;

namespace iOS
{
    /// <summary>
    /// Primary Unity API for exporting StepPals game data to iOS widgets and Apple Watch
    /// 
    /// Automatically exports pet and step data when the app loses focus. Can also be
    /// manually triggered via ExportAppData().
    /// 
    /// Data is exported to App Group UserDefaults which widgets and watch app can read.
    /// </summary>
    public class WidgetDataExporter : IInitializable, IDisposable
    {
#if UNITY_IOS && !UNITY_EDITOR
            [DllImport("__Internal")]
            public static extern void SaveToSharedUserDefaults(string value);
            
            [DllImport("__Internal")]
            public static extern void RemoveFromSharedUserDefaults();
            
            [DllImport("__Internal")]
            public static extern bool IsWatchAvailable();
            
            [DllImport("__Internal")]
            public static extern bool IsAppGroupConfigured();
            
            [DllImport("__Internal")]
            private static extern void EnableHealthKitBackgroundDelivery();
            
            [DllImport("__Internal")]
            private static extern void OnAppDidBecomeActive();
            
            [DllImport("__Internal")]
            private static extern void OnAppDidEnterBackground();
#endif
        
        // Properties
        public bool IsInitialized { get; private set; }

        private readonly PlayersPetsDataProxy _playersPetsDataProxy;
        private readonly HealthStepsDataProxy _healthStepsDataProxy;
        private readonly Data.DataController _dataController;
        private readonly StepProgressManager _stepProgressManager;

        private float _timeSinceLastUpdate;
        private readonly CompositeDisposable _disposables = new CompositeDisposable();
        private bool _healthKitBackgroundDeliveryEnabled = false;
        private string lastSavedHash = null;

        public WidgetDataExporter(
            PlayersPetsDataProxy playersPetsDataProxy,
            HealthStepsDataProxy healthStepsDataProxy,
            Data.DataController dataController,
            StepProgressManager stepProgressManager)
        {
            _playersPetsDataProxy = playersPetsDataProxy;
            _healthStepsDataProxy = healthStepsDataProxy;
            _dataController = dataController;
            _stepProgressManager = stepProgressManager;
        }

        public void Initialize()
        {
#if UNITY_IOS && !UNITY_EDITOR
            Debug.Log("🚀 WidgetDataExporter: Initializing...");

            // Check App Group configuration
            if (!IsAppGroupConfigured())
            {
                Debug.LogError("❌ WidgetDataExporter: App Group not configured! Check Xcode capabilities.");
                return;
            }
            
            IsInitialized = true;
            Debug.Log("✅ WidgetDataExporter: Initialized successfully");
#else
            Debug.LogWarning("⚠️ WidgetDataExporter: Only available on iOS devices");
#endif
            
            // Export data when app goes to background
            Application.focusChanged += OnApplicationFocusChanged;

            // Subscribe to pet changes to enable HealthKit background delivery when conditions are met
            SetupHealthKitBackgroundDeliverySubscription();
        }

        public void Dispose()
        {
            Application.focusChanged -= OnApplicationFocusChanged;
            _disposables?.Dispose();
        }

        private void OnApplicationFocusChanged(bool hasFocus)
        {
            // Export when losing focus (going to background)
            if (!hasFocus)
            {
                ExportAppData();
                
#if UNITY_IOS && !UNITY_EDITOR
                // Notify native code that app entered background
                OnAppDidEnterBackground();
#endif
            }
            else
            {
#if UNITY_IOS && !UNITY_EDITOR
                // Notify native code that app became active
                OnAppDidBecomeActive();
#endif
            }
        }

        /// <summary>
        /// Exports the current app data to the widget.
        /// This is called automatically when the app goes to background,
        /// but can also be called manually for testing or immediate updates.
        /// </summary>
        public void ExportAppData()
        {
            try
            {
                var activePet = _playersPetsDataProxy.ActivePet.Value;

                if (activePet == null)
                {
                    // No active pet, remove data from widget
#if UNITY_IOS && !UNITY_EDITOR
                    RemoveFromSharedUserDefaults();
#endif
                    Debug.Log("[WidgetDataExporter] No active pet, removed widget data");
                    return;
                }

                var appData = new AppData
                {
                    petData = new PetData
                    {
                        name = activePet.Name,
                        species = activePet.Species.ToString(),
                        maturity = activePet.MaturationStage.Value.ToString(),
                        condition = activePet.Condition.Value.ToString(),
                    },
                    stepData = new StepData
                    {
                        currentSteps = _healthStepsDataProxy.StepsCount.Value,
                        stepsGoal = _playersPetsDataProxy.StepGoalCount.Value,
                    },
                    careData = CalculateCareStatus(activePet),
                    lastUpdated = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                };

                // Configure JSON serialization to match Swift's Codable expectations
                // Keep property names as-is (lowercase) to match Swift struct properties
                var jsonSettings = new JsonSerializerSettings
                {
                    Formatting = Formatting.None,
                    NullValueHandling = NullValueHandling.Ignore
                };
                
                string jsonData = JsonConvert.SerializeObject(appData, jsonSettings);

                var hash = ComputeSha256Hash(jsonData);
                if (hash == lastSavedHash) {
                    Debug.Log("WidgetDataExporter: no change — skip native call (JSON: " + jsonData + ", hash: " + hash + ")");
                    return;
                }
                lastSavedHash = hash;
                
                // Log the JSON for debugging
                Debug.Log($"[WidgetDataExporter] Serialized JSON: {jsonData}");

#if UNITY_IOS && !UNITY_EDITOR
                SaveToSharedUserDefaults(jsonData);
                
                Debug.Log($"[WidgetDataExporter] Exported app data to widget: {jsonData}");
#else
                Debug.Log($"[WidgetDataExporter] Would export app data (Editor mode): {jsonData}");
#endif
            }
            catch (Exception ex)
            {
                Debug.LogError($"[WidgetDataExporter] Failed to export app data: {ex.Message}");
            }
        }

        private CareData CalculateCareStatus(ActivePetDataProxy activePet)
        {
            var careData = new CareData();

            if (activePet.Condition.Value == ConditionState.Dead)
            {
                // Pet is dead, remove data from widget
                careData.feed = CareStatus.disabled.ToString();
                careData.giveWater = CareStatus.disabled.ToString();
                careData.cleanPoop = CareStatus.disabled.ToString();
                careData.giveTreat = CareStatus.disabled.ToString();
                return careData;
            }

            var lastDoneCareAction = activePet.LastDoneCareAction.Value;

            // Get all care actions (excluding None)
            var allCareActions = Utils.Utils.GetEnumValues<CareActionType>()
                .Where(action => action != CareActionType.None)
                .ToList();

            // Try to get the last available care action from StepProgressManager
            // Since LastAvailableCareAction is an IObservable, we need to determine it based on step percentage
            float stepsPercentage = _stepProgressManager.StepsPercentage;

            foreach (CareActionType careAction in allCareActions)
            {
                string careStatus = CareStatus.disabled.ToString();

                if (careAction <= lastDoneCareAction)
                {
                    // Actions up to and including the last done action are completed
                    careStatus = CareStatus.completed.ToString();
                }
                else if (careAction == (CareActionType)((int)lastDoneCareAction + 1))
                {
                    // The next action after last done is pending (if steps allow it)
                    // Check if we have enough step progress for this action
                    if (HasEnoughStepsForAction(careAction, stepsPercentage))
                    {
                        careStatus = CareStatus.pending.ToString();
                    }   
                }

                switch(careAction) {
                    case CareActionType.Feed:
                        careData.feed = careStatus;
                        break;
                    case CareActionType.GiveWater:
                        careData.giveWater = careStatus;
                        break;
                    case CareActionType.CleanPoop:
                        careData.cleanPoop = careStatus;
                        break;
                    case CareActionType.GiveTreat:
                        careData.giveTreat = careStatus;
                        break;
                    default:
                        break;
                }
            }

            return careData;
        }

        private bool HasEnoughStepsForAction(CareActionType careAction, float stepsPercentage)
        {
            // Get the required percentage for this care action from game balances
            // This requires access to GameBalances which StepProgressManager has
            // For now, we'll use the step percentage to determine if the action is available
            // The logic matches what's in StepProgressManager.CalculateLastAvailableCareAction

            // Standard percentages (these should ideally come from GameBalances)
            // Feed: 25%, GiveWater: 50%, CleanPoop: 75%, GiveTreat: 100%
            var requiredPercentages = new Dictionary<CareActionType, float>
            {
                { CareActionType.Feed, 25f },
                { CareActionType.GiveWater, 50f },
                { CareActionType.CleanPoop, 75f },
                { CareActionType.GiveTreat, 100f },
            };

            return requiredPercentages.TryGetValue(careAction, out float required) && stepsPercentage >= required;
        }

        /// <summary>
        /// Sets up a subscription to enable HealthKit background delivery when:
        /// 1. A pet is selected (ActivePet is not null)
        /// 2. Pet's maturity is not Egg
        /// </summary>
        private void SetupHealthKitBackgroundDeliverySubscription()
        {
            // Subscribe to ActivePet changes and automatically switch to the pet's MaturationStage observable
            // Switch() automatically unsubscribes from previous pet's observable when pet changes
            _playersPetsDataProxy.ActivePet
                .Select(pet => pet != null ? pet.MaturationStage : Observable.Return(PetMaturity.Egg))
                .Switch()
                .CombineLatest(_playersPetsDataProxy.ActivePet, (maturity, pet) => new { Pet = pet, Maturity = maturity })
                .Subscribe(data =>
                {
                    CheckAndEnableHealthKitBackgroundDelivery(data.Pet, data.Maturity);
                })
                .AddTo(_disposables);

            // Also check initial state
            CheckAndEnableHealthKitBackgroundDelivery();
        }

        /// <summary>
        /// Checks current pet state and enables HealthKit background delivery if conditions are met
        /// </summary>
        private void CheckAndEnableHealthKitBackgroundDelivery()
        {
            var activePet = _playersPetsDataProxy.ActivePet.Value;
            
            if (activePet != null)
            {
                CheckAndEnableHealthKitBackgroundDelivery(activePet, activePet.MaturationStage.Value);
            }
        }

        /// <summary>
        /// Checks pet state and enables HealthKit background delivery if conditions are met
        /// </summary>
        private void CheckAndEnableHealthKitBackgroundDelivery(ActivePetDataProxy pet, PetMaturity maturity)
        {
            bool shouldEnable = pet != null && maturity != PetMaturity.Egg;
            
            if (shouldEnable && !_healthKitBackgroundDeliveryEnabled)
            {
#if UNITY_IOS && !UNITY_EDITOR
                Debug.Log($"✅ WidgetDataExporter: Enabling HealthKit background delivery (Pet: {pet.Name}, Maturity: {maturity})");
                EnableHealthKitBackgroundDelivery();
                _healthKitBackgroundDeliveryEnabled = true;
#else
                Debug.Log($"✅ WidgetDataExporter: Would enable HealthKit background delivery (Pet: {pet.Name}, Maturity: {maturity})");
#endif
            }
            else if (!shouldEnable && _healthKitBackgroundDeliveryEnabled)
            {
                Debug.Log($"ℹ️ WidgetDataExporter: HealthKit background delivery conditions no longer met (Pet: {pet?.Name}, Maturity: {maturity})");
                _healthKitBackgroundDeliveryEnabled = false;
            } else {
                Debug.Log($"ℹ️ WidgetDataExporter: HealthKit background delivery conditions not met (shouldEnable: {shouldEnable}, _healthKitBackgroundDeliveryEnabled: {_healthKitBackgroundDeliveryEnabled} Pet: {pet?.Name}, Maturity: {maturity})");
            }
        }

        [Serializable]
        private class PetData
        {
            public string name;
            public string species;
            public string maturity;
            public string condition;
        }

        [Serializable]
        private class StepData
        {
            public int currentSteps;
            public int stepsGoal;
        }

        enum CareStatus {
            disabled,
            pending,
            completed,
        }

        [Serializable]
        private class CareData {
            public string feed = CareStatus.disabled.ToString();
            public string giveWater = CareStatus.disabled.ToString();
            public string cleanPoop = CareStatus.disabled.ToString();
            public string giveTreat = CareStatus.disabled.ToString();
        }

        [Serializable]
        private class AppData
        {
            public PetData petData;
            public StepData stepData;
            public CareData careData;
            public string lastUpdated;
        }

        private string ComputeSha256Hash(string rawData)
        {
            using (System.Security.Cryptography.SHA256 sha256Hash = System.Security.Cryptography.SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(System.Text.Encoding.UTF8.GetBytes(rawData));
                System.Text.StringBuilder builder = new System.Text.StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
