using System;
using System.Threading;
using Assets;
using Balances.Tutorials;
using Cysharp.Threading.Tasks;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Helpers;
using Data.Types;
using Game.Pets.Animation;
using ScreenNavigationSystem;
using Screens.PetMenuScreen;
using Sounds;
using Tutorials;
using UniRx;
using UnityEngine;

namespace Game.HomeRoom
{
    [RequireComponent(typeof(HomeRoomView))]
    public class HomeRoomPresenter : MonoBehaviour
    {
        private const float HatchingDelay = 1f;

        [SerializeField] private HomeRoomView view;
        [SerializeField] private PuffAnimationEventHandler puffBigCloudHandler;

        private PlayersPetsDataProxy _playersPetsDataProxy;
        private EggCrackingStage _eggCrackingStage;
        private int _countOfTapping;
        private CancellationTokenSource _cancellationTokenSource;
        private ActivePetDataProxy _activePetDataProxy;
        private TutorialsDataProxy _tutorialsDataProxy;
        private ScreensController _screensController;

        public void Initialize(PlayersPetsDataProxy playersPetsDataProxy, AssetsProvider assetsProvider,
            ScreensController screensController, TutorialsDataProxy tutorialsDataProxy)
        {
            _playersPetsDataProxy = playersPetsDataProxy;
            _screensController = screensController;
            _tutorialsDataProxy = tutorialsDataProxy;
            view.Initialize();

            view.PetNameClicked += OnClickedPetName;
            puffBigCloudHandler.AppearedBigCloud += () =>
            {
                if (_activePetDataProxy.MaturationStage.Value != PetMaturity.Egg)
                {
                    view.SetEggActive(false);
                }
            };
            _playersPetsDataProxy.ActivePet.Subscribe(pet =>
            {
                bool petExists = pet != null;
                view.SetPetNameInteractable(petExists);
            }).AddTo(this);

            _playersPetsDataProxy.ActivePet.Where(pet => pet != null).Subscribe(pet =>
            {
                _activePetDataProxy = pet;
                RegisterNewPet(assetsProvider);
            }).AddTo(this);

            view.EggClicked += OnPetClicked;
            ConfigureTutorialData();
            TryPlayEnvironmentAnimations();
        }

        private void TryPlayEnvironmentAnimations()
        {
            if (_tutorialsDataProxy.IsAnyActiveTutorial)
            {
                _tutorialsDataProxy.TutorialFinished.Subscribe(_ =>
                {
                    view.PlayEnvironmentAnimations();
                }).AddTo(this);
            }
            else
            {
                view.PlayEnvironmentAnimations();
            }
        }

        private void ConfigureTutorialData()
        {
            _tutorialsDataProxy.CurrentStep.Where(step => step && step.HighlightSceneObject != SceneObjectId.None)
                .Subscribe(ShowTutorialHighlightRectangle).AddTo(this);
        }

        private void ShowTutorialHighlightRectangle(TutorialStepSo step)
        {
            if (!Camera.main)
                return;
            
            Vector3 screenPosition =
                Camera.main.WorldToScreenPoint(view.GetSceneObjectPosition(step.HighlightSceneObject));
            _tutorialsDataProxy.ShowSceneRectangle(screenPosition);
        }

        private void RegisterNewPet(AssetsProvider assetsProvider)
        {
            AllowHatchingWithDelay().Forget();
            _eggCrackingStage = EggCrackingStage.NoTap;
            view.Configure(_activePetDataProxy.Name, assetsProvider.GetPetEggSprite(_activePetDataProxy.Species));
            _activePetDataProxy.MaturationStage.Subscribe(maturity =>
            {
                bool isEgg = maturity == PetMaturity.Egg;
                view.SetEggActive(isEgg);
                view.ShowPetData(!isEgg);
                view.SetConcealableObjectsActive(!isEgg);
            }).AddTo(this);
            _activePetDataProxy.Condition.Subscribe(condition =>
            {
                view.SetPetStatusText(ContentHelper.ConditionsForMonitor[condition],
                    ContentHelper.ConditionsColorsForMonitor[condition]);
            }).AddTo(this);
            _activePetDataProxy.AnimationState.Where(tuple => tuple.isOn)
                .Subscribe(tuple => PlaySoundOnCareAction(tuple.careActionType)).AddTo(this);
        }

        private void PlaySoundOnCareAction(CareActionType careActionType)
        {
            if (ContentHelper.CareActionsSounds.TryGetValue(careActionType, out AudioKey audioKey))
            {
                SoundsManager.PlaySound(audioKey);
            }
        }

        private void OnPetClicked()
        {
            TryHatchEgg();
        }

        private async UniTask AllowHatchingWithDelay()
        {
            view.SetEggClickInteractable(false);
            _cancellationTokenSource = new CancellationTokenSource();
            await UniTask.Delay(TimeSpan.FromSeconds(HatchingDelay), cancellationToken: _cancellationTokenSource.Token);
            view.SetEggClickInteractable(true);
        }

        private void TryHatchEgg()
        {
            if (_eggCrackingStage == EggCrackingStage.TappingFinished)
                return;

            if (_activePetDataProxy == null)
                return;

            view.SetEggClickInteractable(false);
            view.PlayEggShakeAnimation();
            _countOfTapping++;
            int indexOfStage = (int)_eggCrackingStage;
            if (_countOfTapping >= GlobalConstants.NumberOfTapsProgression[indexOfStage])
            {
                _countOfTapping = 0;
                if (indexOfStage < view.EggView.EggCracks.Length)
                {
                    SoundsManager.PlaySound(AudioKey.EggCrackSound);
                    view.ShowPetCracks(indexOfStage);
                }
                else
                {
                    _tutorialsDataProxy.TrackInteraction(TutorialStepActionType.TargetClick);
                    SoundsManager.PlaySound(AudioKey.PetBirth);
                    view.HideAllPetCracks();
                    _activePetDataProxy.MaturatePet();
                }

                _eggCrackingStage = Utils.Utils.GetNextValue(_eggCrackingStage);
            }

            if (_eggCrackingStage == EggCrackingStage.FirstTap && _countOfTapping == 0)
            {
                _tutorialsDataProxy.TrackInteraction(TutorialStepActionType.TargetClick);
                _activePetDataProxy.FirstTapOnEgg();
            }

            view.SetEggClickInteractable(true);
        }

        private void OnClickedPetName()
        {
            SoundsManager.PlaySound(AudioKey.CustomButtonClickSound);
            if (_tutorialsDataProxy.IsAnyActiveTutorial)
            {
                _tutorialsDataProxy.TrackInteraction(TutorialStepActionType.TargetClick);
            }

            _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<PetMenuScreenPresenter>());
        }

        private void OnDestroy()
        {
            _cancellationTokenSource?.Cancel();
            _cancellationTokenSource?.Dispose();
        }
    }
}