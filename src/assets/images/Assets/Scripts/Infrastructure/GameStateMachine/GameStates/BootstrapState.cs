using System;
using System.Reflection;
using Analytics;
using Authentication;
using Cysharp.Threading.Tasks;
using Data;
using Data.DataProxy;
using Managers;
using Modules.InAppPurchasesProvider;
using Playfab;
using PlayFab;
using SceneManagement;
using ScreenNavigationSystem;
using Screens.LoadingScreen;
using Screens.TryLoginLaterPopup;
using Services;
using Sounds;
using Subscription;
using UnityEditor;
using UnityEngine;
using Utils;
using Utils.StateMachine.States;

namespace Infrastructure.GameStateMachine.GameStates
{
    public class BootstrapState : IState
    {
        private readonly SceneLoader _sceneLoader;
        private readonly GameStateMachine _gameStateMachine;
        private readonly DataController _dataController;
        private readonly IAPProvider _iapProvider;
        private readonly IAuthenticationManager _authenticationManager;
        private readonly IApiInterface _apiInterface;
        private readonly DeviceIdManager _deviceIdManager;
        private readonly SubscriptionManager _subscriptionManager;
        private readonly ScreensController _screensController;
        private readonly TimeDataProxy _timeDataProxy;
        private readonly InternetConnectionService _internetConnectionService;

        public BootstrapState(SceneLoader sceneLoader, GameStateMachine gameStateMachine, DataController dataController,
            IAPProvider iapProvider, IAuthenticationManager authenticationManager, IApiInterface apiInterface,
            DeviceIdManager deviceIdManager, SubscriptionManager subscriptionManager,
            ScreensController screensController, TimeDataProxy timeDataProxy,
            InternetConnectionService internetConnectionService)
        {
            _sceneLoader = sceneLoader;
            _gameStateMachine = gameStateMachine;
            _dataController = dataController;
            _iapProvider = iapProvider;
            _authenticationManager = authenticationManager;
            _apiInterface = apiInterface;
            _deviceIdManager = deviceIdManager;
            _subscriptionManager = subscriptionManager;
            _screensController = screensController;
            _timeDataProxy = timeDataProxy;
            _internetConnectionService = internetConnectionService;
        }

        public void Dispose()
        {
        }

        public async UniTask Enter()
        {
            await _sceneLoader.Load(SceneName.BootScene, default);
            OnBootSceneLoaded();
        }

        public void Exit()
        {
        }

        private void OnBootSceneLoaded()
        {
        #if UNITY_EDITOR
            ClearEditorLogs();
        #endif
            Debug.Log("Loaded BootScene");
            Initialize().Forget();
        }

    #if UNITY_EDITOR
        private static void ClearEditorLogs()
        {
            Assembly assembly = Assembly.GetAssembly(typeof(Editor));
            Type type = assembly.GetType("UnityEditor.LogEntries");
            MethodInfo method = type.GetMethod("Clear");
            method?.Invoke(new object(), null);
        }
    #endif

        private async UniTask Initialize()
        {
            Application.targetFrameRate = 60;
            Screen.sleepTimeout = SleepTimeout.NeverSleep;
            DevToDevManager.LogEvent(DevToDevKey.app_opened, (DevToDevKey.app_version, Application.version));
            _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<LoadingScreenPresenter>()
                .Global());

            bool isConnected = await _internetConnectionService.TryShowNoInternetConnection();
            if (!isConnected)
            {
                _internetConnectionService.RestoredConnection += TryLogin;
            }
            else
            {
                TryLogin();
            }
        }

        private void TryLogin()
        {
            _internetConnectionService.RestoredConnection -= TryLogin;
            if (PlayerPrefsHelper.IsLinkedSocial || PlayerPrefsHelper.IsLoginByButton)
            {
                _authenticationManager.SignInAccount(OnLoggedIn, LoginWithCustomId);
            }
            else
            {
                LoginWithCustomId();
            }

            return;

            void LoginWithCustomId()
            {
                PlayerPrefsHelper.IsLinkedSocial = false;
                _deviceIdManager.GetOrCreateDeviceId(deviceUniqueIdentifier =>
                {
                    Debug.Log("Device unique identifier: " + deviceUniqueIdentifier);
                    _apiInterface.LoginWithCustomID(deviceUniqueIdentifier, OnLoggedIn, error =>
                    {
                        if (error == PlayFabErrorCode.AccountDeleted)
                        {
                            _screensController.ExecuteCommand(new NavigationCommand()
                                .ShowNextScreen<TryLoginLaterPopupPresenter>().Global());
                        }

                        Debug.LogError("Couldn't log in with device id");
                    });
                });
            }
        }

        private void OnLoggedIn()
        {
            PlayerPrefsHelper.IsLoginByButton = false;
            _timeDataProxy.UpdateTimeFromServer(delegate
            {
                _dataController.Initialize(delegate
                {
                    _iapProvider.InitializePurchasing(GlobalConstants.NonConsumableSku, GlobalConstants.ConsumableSku);
                    _subscriptionManager.Initialize();
                    SoundsManager.PlayMusic(AudioKey.GameSceneMusic, 0.5f);
                    _gameStateMachine.Enter<LoadLevelState, SceneName>(SceneName.MainScene);
                }, delegate { Debug.Log("Failed to initialize data controller"); });
            });
        }
    }
}