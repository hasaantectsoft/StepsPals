using System;
using Analytics;
using Builder_TestMode;
using Cysharp.Threading.Tasks;
using Data.DataProxy;
using ScreenNavigationSystem;
using Screens.SubscriptionScreen;
using Screens.WelcomePopup;
using Services;
using UniRx;
using UnityEngine;

namespace Subscription
{
    public class SubscriptionManager : IDisposable
    {
        private readonly RevenueCatManager _revenueCatManager;
        private readonly TutorialsDataProxy _tutorialsDataProxy;
        private readonly ScreensController _screensController;
        private readonly InternetConnectionService _internetConnectionService;
        private readonly CompositeDisposable _disposables = new();
        private Action _onSubscriptionClosing;

        public SubscriptionManager(RevenueCatManager revenueCatManager, TutorialsDataProxy tutorialsDataProxy,
            ScreensController screensController, InternetConnectionService internetConnectionService)
        {
            _revenueCatManager = revenueCatManager;
            _tutorialsDataProxy = tutorialsDataProxy;
            _screensController = screensController;
            _internetConnectionService = internetConnectionService;
        }

        public void Initialize()
        {
            _disposables.Clear();
            Observable.EveryApplicationFocus().Where(hasFocus => hasFocus)
                .Subscribe(delegate { CheckSubscription().Forget(); }).AddTo(_disposables);

            _tutorialsDataProxy.TutorialFinished.Subscribe(_ => { TryShowSubscriptionPaywall(); }).AddTo(_disposables);
        }

        public async UniTask CheckSubscription()
        {
            if (_tutorialsDataProxy.IsAnyActiveTutorial)
                return;

            bool isConnected = await _internetConnectionService.TryShowNoInternetConnection();
            if (isConnected)
                TryShowSubscriptionPaywall();
        }

        private void TryShowSubscriptionPaywall()
        {
            _revenueCatManager.CheckSubscriptionStatus(isSubscribed =>
            {
                DevToDevManager.LogEvent(DevToDevKey.subscription_info,
                    (DevToDevKey.subscription_status,
                        isSubscribed.hasActiveSubscription ? DevToDevKey.Purchased : DevToDevKey.Inactive),
                    (DevToDevKey.subscription_is_in_trial, isSubscribed.trialUsed),
                    (DevToDevKey.plan, DevToDevHelper.SubscriptionPlans[isSubscribed.packageIdentifier]));

                Debug.Log("IsSubscribed: " + isSubscribed);
                if (!isSubscribed.hasActiveSubscription)
                {
                    _screensController.ExecuteCommand(new NavigationCommand()
                        .ShowNextScreen<SubscriptionScreenPresenter>().WithExtraData(isSubscribed.trialUsed));
                }
            }, error => Debug.LogError("Error while checking subscription status: " + error));
        }

        public void Dispose()
        {
            _disposables.Clear();
        }

        public void OpenScreenOnlyAfterSubscriptionScreen(Action openScreen)
        {
            _onSubscriptionClosing = openScreen;
            if (_screensController.IsScreenActive<SubscriptionScreenPresenter>())
            {
                _screensController.ScreenClosing += OnScreenClosing;
            }
            else
            {
                _onSubscriptionClosing?.Invoke();
            }
        }

        private void OnScreenClosing(Type type)
        {
            if (type != typeof(WelcomePopupPresenter) &&
                (type != typeof(SubscriptionScreenPresenter) || !BuildSettingsSO.IsTestMode))
            {
                return;
            }

            _onSubscriptionClosing?.Invoke();
            _onSubscriptionClosing = null;
            _screensController.ScreenClosing -= OnScreenClosing;
        }
    }
}