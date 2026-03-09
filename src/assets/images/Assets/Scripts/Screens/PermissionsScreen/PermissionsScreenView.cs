using System;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using TMPro;
using UnityEngine;

namespace Screens.PermissionsScreen
{
    public class PermissionsScreenView : ScreenView
    {
        [SerializeField] private CustomButton enableNotificationsButton;
        [SerializeField] private CustomButton authorizeHealthKitButton;
        [SerializeField] private CustomButton nextButton;
        [SerializeField] private CustomButton privacyPolicyButton;
        [SerializeField] private CustomButton termsOfUseButton;
        [SerializeField] private CloseButton backButton;

        [SerializeField] private TextMeshProUGUI authorizeHealthButtonTitleText;
        [SerializeField] private TextMeshProUGUI authorizeHealthDescText;
        public event Action ClickedEnableNotifications;
        public event Action ClickedAuthorizeHealthKit;
        public event Action ClickedNextButton;
        public event Action ClickedBackButton;
        public event Action ClickedPrivacyPolicyButton;
        public event Action ClickedTermsOfUseButton;

        public void Initialize()
        {
            enableNotificationsButton.FinishedClicking += () => FinishedClickingEvent(ClickedEnableNotifications);
            authorizeHealthKitButton.FinishedClicking += () => FinishedClickingEvent(ClickedAuthorizeHealthKit);
            nextButton.FinishedClicking += () => FinishedClickingEvent(ClickedNextButton);
            privacyPolicyButton.FinishedClicking += () => FinishedClickingEvent(ClickedPrivacyPolicyButton);
            termsOfUseButton.FinishedClicking += () => FinishedClickingEvent(ClickedTermsOfUseButton);
            RegisterDisableInteractionsOnClick(nextButton, enableNotificationsButton, authorizeHealthKitButton);
            backButton.Clicked += () => ClickedBackButton?.Invoke();
            SetNextButtonInteractable(false);

            authorizeHealthButtonTitleText.text = Application.platform == RuntimePlatform.Android
                ? StringKeys.AndroidAuthorizeHealthButtonTitle : StringKeys.IOSAuthorizeHealthButtonTitle;
            authorizeHealthDescText.text = Application.platform == RuntimePlatform.Android 
                ? StringKeys.AndroidAuthorizeHealthDesc : StringKeys.IOSAuthorizeHealthDesc;
        }

        public void SetEnableNotificationButtonInteractable(bool interactable) =>
            enableNotificationsButton.SetInteractable(interactable);

        public void SetAuthorizeHealthKitButtonInteractable(bool interactable) =>
            authorizeHealthKitButton.SetInteractable(interactable);

        public void SetNextButtonInteractable(bool interactable) => nextButton.SetInteractable(interactable);

        private void FinishedClickingEvent(Action eventWrapper)
        {
            AllowInteractions(true);
            eventWrapper?.Invoke();
        }

        private void RegisterDisableInteractionsOnClick(params CustomButton[] buttons)
        {
            foreach (CustomButton button in buttons)
            {
                button.StartedClicking += () => AllowInteractions(false);
            }
        }

        public void AllowInteractions(bool allow)
        {
            CanvasGroup.blocksRaycasts = allow;
        }
    }
}