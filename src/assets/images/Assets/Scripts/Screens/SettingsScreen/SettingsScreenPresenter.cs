using Analytics;
using Authentication;
using Infrastructure.GameStateMachine;
using Infrastructure.GameStateMachine.GameStates;
using Modules.InAppPurchasesProvider;
using ScreenNavigationSystem;
using Screens.DeleteAccountPopup;
using Screens.Shared.NavigationBar;
using Screens.SignOutPopup;
using Sounds;
using UnityEngine;
using Utils;
using Zenject;

namespace Screens.SettingsScreen
{
    [RequireComponent(typeof(SettingsScreenView))]
    public class SettingsScreenPresenter : ScreenPresenter
    {
        [SerializeField] private SettingsScreenView view;
        [SerializeField] private NavigationBarPresenter navigationBar;

        private IAPProvider _iapProvider;
        private GameStateMachine _gameStateMachine;
        private IAuthenticationManager _authenticationManager;
        private ScreensController _screensController;
        private bool _processing;

        [Inject]
        public void Construct(IAPProvider iapProvider, IAuthenticationManager authenticationManager,
            GameStateMachine gameStateMachine, ScreensController screensController)
        {
            _iapProvider = iapProvider;
            _authenticationManager = authenticationManager;
            _gameStateMachine = gameStateMachine;
            _screensController = screensController;
        }

        private void Awake()
        {
            view.MusicToggleChanged += MusicVolumeChanged;
            view.SoundToggleChanged += SoundsVolumeChanged;
            view.ClickedRestorePurchasesButton += OnRestorePurchasesClicked;
            view.ClickedPrivacyPolicyButton += OnPrivacyPolicyClicked;
            view.ClickedSupportButton += OnSupportClicked;
            view.ClickedSignInButton += OnClickedSignInButton;
            view.ClickedDeleteAccountButton += OnClickedDeleteAccountButton;

            navigationBar.Initialize(NavigationButtonType.Settings);
            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            DevToDevManager.LogEvent(DevToDevKey.settings_screen_opened);
            view.UpdateMusicToggle(SoundsManager.IsMusicOn);
            view.UpdateSoundsToggle(SoundsManager.IsSoundOn);
            view.Configure(Application.version, _authenticationManager.IsLinkedSocial);
        }

        private void MusicVolumeChanged(bool isOn)
        {
            SoundsManager.ToggleMusic(isOn);
            DevToDevManager.LogEvent(DevToDevKey.music,
                (DevToDevKey.value, (isOn ? DevToDevKey.on : DevToDevKey.off).ToString()));
        }

        private void SoundsVolumeChanged(bool isOn)
        {
            SoundsManager.ToggleSound(isOn);
            DevToDevManager.LogEvent(DevToDevKey.sound,
                (DevToDevKey.value, (isOn ? DevToDevKey.on : DevToDevKey.off).ToString()));
        }

        private void OnRestorePurchasesClicked()
        {
            DevToDevManager.LogEvent(DevToDevKey.restore_purchases_clicked);
            _iapProvider.RestorePurchases();
        }

        private void OnSupportClicked()
        {
            Utils.Utils.OpenEmail(GlobalConstants.SupportEmail);
            DevToDevManager.LogEvent(DevToDevKey.email_support);
        }

        private void OnPrivacyPolicyClicked()
        {
            Utils.Utils.OpenUrl(StringKeys.PrivacyPolicyURL);
            DevToDevManager.LogEvent(DevToDevKey.privacy_policy_clicked,
                (DevToDevKey.source, DevToDevKey.settings_screen.ToString()));
        }

        private void OnClickedDeleteAccountButton()
        {
            _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<DeleteAccountPopupPresenter>());
        }

        private void OnClickedSignInButton()
        {
            if (_processing)
                return;
            _processing = true;
            if (_authenticationManager.IsLinkedSocial)
            {
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<SignOutPopupPresenter>());
                _processing = false;
            }
            else
            {
            #if UNITY_ANDROID && !UNITY_EDITOR
                view.SetOverlayActive(true);
                _authenticationManager.SignInAccount(delegate
                {
                    view.SetOverlayActive(false);
                    _gameStateMachine.Enter<BootstrapState>();
                    _processing = false;
                }, delegate
                {
                    _authenticationManager.LinkAccount(delegate
                    {
                        view.SetOverlayActive(false);
                        view.SetSignInState(_authenticationManager.IsLinkedSocial);
                        _processing = false;
                    }, delegate
                    {
                        view.SetOverlayActive(false);
                        _processing = false;
                    });
                });
            #else
                PlayerPrefsHelper.IsLoginByButton = true;
                _gameStateMachine.Enter<BootstrapState>();
                _processing = false;
            #endif
            }
        }
    }
}