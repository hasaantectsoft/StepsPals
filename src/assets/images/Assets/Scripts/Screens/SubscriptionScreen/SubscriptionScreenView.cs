using System;
using System.Collections.Generic;
using System.Linq;
using Builder_TestMode;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using Subscription;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.SubscriptionScreen
{
    public class SubscriptionScreenView : ScreenView
    {
        [SerializeField] private SerializedDictionary<PackageIdentifier, SubscriptionToggleView> subscriptionToggleView;
        [SerializeField] private CustomButton subscriptionButton;
        [SerializeField] private TextMeshProUGUI bottomInfoText;
        [SerializeField] private Button restorePurchaseButton;
        [SerializeField] private Button privacyPolicyButton;
        [SerializeField] private Button termsAndConditionsButton;
        [SerializeField] private Button closeSubscriptionScreenButton;
        [SerializeField] private GameObject loadingOverlay;
        [SerializeField] private ToggleGroup subscriptionsToggleGroup;

        public event Action ClickedSubscribeNowButton;
        public event Action ClickedRestorePurchaseButton;
        public event Action ClickedPrivacyPolicyButton;
        public event Action ClickedTermsAndConditionsButton;
        public event Action ClickedCloseSubscriptionScreenButton;
        public event Action<PackageIdentifier, bool> ChangedToggleValue;

        public void Initialize()
        {
            restorePurchaseButton.ActionWithThrottle(() => ClickedRestorePurchaseButton?.Invoke());
            termsAndConditionsButton.ActionWithThrottle(() => ClickedTermsAndConditionsButton?.Invoke());
            privacyPolicyButton.ActionWithThrottle(() => ClickedPrivacyPolicyButton?.Invoke());
            
            subscriptionButton.FinishedClicking += () => ClickedSubscribeNowButton?.Invoke();

            foreach ((PackageIdentifier identifier, SubscriptionToggleView view) in subscriptionToggleView.Dictionary)
            {
                view.ChangedToggleValue += isOn => { ChangedToggleValue?.Invoke(identifier, isOn); };
            }
            restorePurchaseButton.gameObject.SetActive(Application.platform == RuntimePlatform.IPhonePlayer);
            
            if (BuildSettingsSO.IsTestMode)
            {
                closeSubscriptionScreenButton.ActionWithThrottle(() => ClickedCloseSubscriptionScreenButton?.Invoke());
            }
        }

        public void Configure(List<SubscriptionScreenViewInfo> viewInfo, bool hasFreeTrial,
            PackageIdentifier defaultSubscription)
        {
            foreach ((PackageIdentifier packageIdentifier, SubscriptionToggleView view) in subscriptionToggleView
                         .Dictionary)
            {
                view.Configure(viewInfo.FirstOrDefault(x => x.PackageIdentifier == packageIdentifier), hasFreeTrial,
                    defaultSubscription == packageIdentifier);
            }

            bottomInfoText.text = hasFreeTrial ? StringKeys.HasFreeTrialText : StringKeys.NoFreeTrialText;
            SetSubscribeButtonInteractable(defaultSubscription != PackageIdentifier.None);
        }

        public void SetSubscribeButtonInteractable(bool interactable) =>
            subscriptionButton.SetInteractable(interactable && subscriptionsToggleGroup.AnyTogglesOn());

        public void SetOverlayActive(bool active)
        {
            loadingOverlay.SetActive(active);
        }
    }
}