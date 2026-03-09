using System;
using ScreenNavigationSystem;
using Screens.Shared;
using Screens.Shared.Buttons;
using TMPro;
using UnityEngine;
using Utils;

namespace Screens.SettingsScreen
{
    public class SettingsScreenView : ScreenView
    {
        [SerializeField] private CustomToggle musicToggle;
        [SerializeField] private CustomToggle soundToggle;
        [SerializeField] private CustomButton supportButton;
        [SerializeField] private CustomButton privacyPolicyButton;
        [SerializeField] private CustomButton restorePurchasesButton;
        [SerializeField] private TextMeshProUGUI versionText;
        [SerializeField] private CustomButton signInButton;
        [SerializeField] private CustomButton deleteAccountButton;
        [SerializeField] private TextMeshProUGUI signInButtonText;
        [SerializeField] private GameObject loadingOverlayGo;
        [SerializeField] private SerializedDictionary<RuntimePlatform, GameObject> signInButtonIcons;

        public event Action ClickedSupportButton;
        public event Action ClickedPrivacyPolicyButton;
        public event Action ClickedRestorePurchasesButton;
        public event Action<bool> MusicToggleChanged;
        public event Action<bool> SoundToggleChanged;
        public event Action ClickedSignInButton;
        public event Action ClickedDeleteAccountButton;

        private void Awake()
        {
            supportButton.FinishedClicking += () => ClickedSupportButton?.Invoke();
            privacyPolicyButton.FinishedClicking += () => ClickedPrivacyPolicyButton?.Invoke();
            restorePurchasesButton.FinishedClicking += () => ClickedRestorePurchasesButton?.Invoke();
            musicToggle.ChangedToggleState += isOn => MusicToggleChanged?.Invoke(isOn);
            soundToggle.ChangedToggleState += isOn => SoundToggleChanged?.Invoke(isOn);
            restorePurchasesButton.gameObject.SetActive(Application.platform == RuntimePlatform.IPhonePlayer);
            signInButton.FinishedClicking += () => ClickedSignInButton?.Invoke();
            deleteAccountButton.FinishedClicking += () => ClickedDeleteAccountButton?.Invoke();
        }

        public void Configure(string version, bool isSignedIn)
        {
            versionText.text = string.Format(StringKeys.VersionText, version);
            SetSignInState(isSignedIn);
        }

        public void UpdateMusicToggle(bool isOn)
        {
            musicToggle.Configure(isOn);
        }

        public void UpdateSoundsToggle(bool isOn)
        {
            soundToggle.Configure(isOn);
        }

        public void SetOverlayActive(bool active)
        {
            loadingOverlayGo.SetActive(active);
        }

        public void SetSignInState(bool isSignedIn)
        {
            signInButtonText.text = string.Format(isSignedIn ? StringKeys.SignOutWithText : StringKeys.SignInWithText,
                Application.platform == RuntimePlatform.IPhonePlayer ? StringKeys.AppleAccount
                    : StringKeys.GoogleAccount);
            foreach ((RuntimePlatform platform, GameObject icon) in signInButtonIcons.Dictionary)
            {
                icon.SetActive(platform == Application.platform);
            }
        }
    }
}