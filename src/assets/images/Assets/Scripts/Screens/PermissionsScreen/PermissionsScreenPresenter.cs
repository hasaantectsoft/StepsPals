using Analytics;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Managers;
using ScreenNavigationSystem;
using Screens.StepGoalSetupScreen;
using UnityEngine;
using Zenject;

namespace Screens.PermissionsScreen
{
    [RequireComponent(typeof(PermissionsScreenView))]
    public class PermissionsScreenPresenter : OnboardingScreenPresenter
    {
        private PermissionsScreenView _view;
        private ScreensController _screensController;
        private ScreenOrderDataProxy _screenOrderDataProxy;
        private PermissionsManager _permissionsManager;
        private PlayersPetsDataProxy _playersPetsDataProxy;

        private PermissionsScreenInfo _info;
        private bool _clickedAuthHealthKit;
        private bool _clickedEnableNotifications;

        [Inject]
        private void Construct(PermissionsManager permissionsManager, ScreensController screensController,
            ScreenOrderDataProxy screenOrderDataProxy, PlayersPetsDataProxy playersPetsDataProxy)
        {
            _permissionsManager = permissionsManager;
            _screenOrderDataProxy = screenOrderDataProxy;
            _screensController = screensController;
            _playersPetsDataProxy = playersPetsDataProxy;
        }

        private new void Awake()
        {
            base.Awake();
            _view = (PermissionsScreenView)view;
            _view.Initialize();

            OnShowCallback += OnShow;
            _view.ClickedBackButton += () =>
            {
                _screenOrderDataProxy.SetClosingScreenDirectingForward(false);
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<StepGoalSetupScreenPresenter>()
                    .CloseCurrentScreen());
            };
            _view.ClickedNextButton += () =>
            {
                _permissionsManager.GrantPermissions();
                _playersPetsDataProxy.CreateNewPet(_info.PetType, _info.PetName, _info.StepGoal);
                _screenOrderDataProxy.SetClosingScreenDirectingForward(true);
                CloseScreen();
            };
            _view.ClickedAuthorizeHealthKit += OnClickedAuthorizeHealthKit;
            _view.ClickedEnableNotifications += () =>
            {
                _permissionsManager.InitializeNotifications();
                _view.SetEnableNotificationButtonInteractable(false);
                _clickedEnableNotifications = true;
                _view.SetNextButtonInteractable(_clickedEnableNotifications && _clickedAuthHealthKit);
            };
            _view.ClickedTermsOfUseButton += OnTermsOfUseClicked;
            _view.ClickedPrivacyPolicyButton += OnPrivacyPolicyClicked;
        }

        private void OnShow(object data)
        {
            _view.AllowInteractions(true);

            if (data is not PermissionsScreenInfo info)
                return;
            _info = info;
        }

        private void OnClickedAuthorizeHealthKit()
        {
            _permissionsManager.InitializeStepsManager();
            _view.SetAuthorizeHealthKitButtonInteractable(false);
            _clickedAuthHealthKit = true;
            _view.SetNextButtonInteractable(_clickedEnableNotifications && _clickedAuthHealthKit);
        }
        
        private void OnTermsOfUseClicked() => Utils.Utils.OpenUrl(StringKeys.GetTermsOfUseURL());

        private void OnPrivacyPolicyClicked()
        {
            Utils.Utils.OpenUrl(StringKeys.PrivacyPolicyURL);
            DevToDevManager.LogEvent(DevToDevKey.privacy_policy_clicked,
                (DevToDevKey.source, DevToDevKey.permissions_screen.ToString()));
        }
    }
}