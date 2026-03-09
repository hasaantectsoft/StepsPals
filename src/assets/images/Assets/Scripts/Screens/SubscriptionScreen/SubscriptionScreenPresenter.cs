using System.Collections.Generic;
using System.Linq;
using Analytics;
using ScreenNavigationSystem;
using Screens.ErrorPopup;
using Screens.WelcomePopup;
using Subscription;
using UnityEngine;
using Zenject;

namespace Screens.SubscriptionScreen
{
    public class SubscriptionScreenPresenter : ScreenPresenter
    {
        private const int ClicksToCloseScreen = 6;
        private const PackageIdentifier DefaultSelectedSubscription = PackageIdentifier.Weekly;

        [SerializeField] private SubscriptionScreenView view;

        private RevenueCatManager _revenueCatManager;
        private ScreensController _screensController;
        private Dictionary<PackageIdentifier, Purchases.Package> _packages;
        private PackageIdentifier _selectedPackage;
        private bool _isFreeTrial;

        private int _closeClickCount;

        [Inject]
        private void Construct(RevenueCatManager revenueCatManager, ScreensController screensController)
        {
            _revenueCatManager = revenueCatManager;
            _screensController = screensController;
        }

        private void Awake()
        {
            view.Initialize();

            view.ClickedSubscribeNowButton += OnSubscribeNowClicked;
            view.ClickedTermsAndConditionsButton += OnTermsAndConditionClicked;
            view.ClickedRestorePurchaseButton += OnRestorePurchaseClicked;
            view.ClickedPrivacyPolicyButton += OnPrivacyPolicyClicked;
            view.ClickedCloseSubscriptionScreenButton += () =>
            {
                _closeClickCount++;
                if (_closeClickCount >= ClicksToCloseScreen)
                {
                    _closeClickCount = 0;
                    CloseScreen();
                }
            };
            view.ChangedToggleValue += (identifier, isOn) =>
            {
                if (isOn)
                {
                    _selectedPackage = identifier;
                }

                view.SetSubscribeButtonInteractable(_selectedPackage != PackageIdentifier.None);
            };
            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            if (data is not bool trialAlreadyUsed)
                return;

            _isFreeTrial = !trialAlreadyUsed;
            _selectedPackage = DefaultSelectedSubscription;
            view.SetOverlayActive(true);
            _revenueCatManager.GetSubscriptionsInfo(subscriptionInfo =>
            {
                view.Configure(subscriptionInfo, _isFreeTrial, _selectedPackage);
                _packages = subscriptionInfo.ToDictionary(x => x.PackageIdentifier, x => x.Package);
                view.SetOverlayActive(false);
            }, _ =>
            {
                view.SetOverlayActive(false);
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<ErrorPopupPresenter>());
            });
        }

        private void OnRestorePurchaseClicked()
        {
            view.SetOverlayActive(true);
            _revenueCatManager.RestoreSubscription(hasRestoredSubscription =>
            {
                view.SetOverlayActive(false);
                if (hasRestoredSubscription)
                {
                    DevToDevManager.LogEvent(DevToDevKey.subscription_restore_purchases);
                    _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<WelcomePopupPresenter>()
                        .WithExtraData(true).CloseCurrentScreen());
                }
            }, _ =>
            {
                view.SetOverlayActive(false);
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<ErrorPopupPresenter>());
            });
        }

        private void OnTermsAndConditionClicked() => Utils.Utils.OpenUrl(StringKeys.GetTermsOfUseURL());

        private void OnSubscribeNowClicked()
        {
            view.SetOverlayActive(true);
            _revenueCatManager.BeginPurchase(_packages[_selectedPackage], () =>
            {
                view.SetOverlayActive(true);
                DevToDevManager.LogEvent(DevToDevKey.subscription_purchased,
                    (DevToDevKey.plan, DevToDevHelper.SubscriptionPlans[_selectedPackage]));
                if (_isFreeTrial)
                {
                    DevToDevManager.LogEvent(DevToDevKey.subscription_trial_started,
                        (DevToDevKey.plan, DevToDevHelper.SubscriptionPlans[_selectedPackage]));
                }

                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<WelcomePopupPresenter>()
                    .WithExtraData(_isFreeTrial).CloseCurrentScreen());
                _revenueCatManager.CheckSubscriptionStatus(_ => { }, error =>
                {
                    Debug.LogError("Error while checking subscription status: " + error);
                    _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<ErrorPopupPresenter>());
                });
            }, _ =>
            {
                DevToDevManager.LogEvent(DevToDevKey.subscription_payment_failed,
                    (DevToDevKey.plan, DevToDevHelper.SubscriptionPlans[_selectedPackage]));
                view.SetOverlayActive(false);
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<ErrorPopupPresenter>());
            });
        }

        private void OnPrivacyPolicyClicked()
        {
            Utils.Utils.OpenUrl(StringKeys.PrivacyPolicyURL);
            DevToDevManager.LogEvent(DevToDevKey.privacy_policy_clicked,
                (DevToDevKey.source, DevToDevKey.subscription_screen.ToString()));
        }
    }
}