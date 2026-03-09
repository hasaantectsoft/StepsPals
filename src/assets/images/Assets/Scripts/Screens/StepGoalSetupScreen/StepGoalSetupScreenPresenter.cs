using Analytics;
using Assets;
using Balances;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using ScreenNavigationSystem;
using Screens.PermissionsScreen;
using Screens.PetNamingScreen;
using UnityEngine;
using Zenject;

namespace Screens.StepGoalSetupScreen
{
    [RequireComponent(typeof(StepGoalSetupScreenView))]
    public class StepGoalSetupScreenPresenter : OnboardingScreenPresenter
    {
        private StepGoalSetupScreenView _view;
        private AssetsProvider _assetsProvider;
        private GameBalances _gameBalances;
        private ScreenOrderDataProxy _screensOrderDataProxy;
        private ScreensController _screensController;
        private PlayersPetsDataProxy _playersPetsDataProxy;
        private TutorialsDataProxy _tutorialsDataProxy;
        private StepGoalSetUpScreenInfo _info;
        private int _stepsGoal;

        [Inject]
        private void Construct(AssetsProvider assetsProvider, GameBalances gameBalances,
            ScreenOrderDataProxy screensOrderDataProxy, ScreensController screensController,
            PlayersPetsDataProxy playersPetsDataProxy, TutorialsDataProxy tutorialsDataProxy)
        {
            _assetsProvider = assetsProvider;
            _gameBalances = gameBalances;
            _screensOrderDataProxy = screensOrderDataProxy;
            _screensController = screensController;
            _playersPetsDataProxy = playersPetsDataProxy;
            _tutorialsDataProxy = tutorialsDataProxy;
        }

        private new void Awake()
        {
            base.Awake();
            _view = (StepGoalSetupScreenView)view;
            _view.Initialize();

            OnShowCallback += OnShow;
            _view.ClickedBackButton += () =>
            {
                _screensOrderDataProxy.SetClosingScreenDirectingForward(false);
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<PetNamingScreenPresenter>()
                    .CloseCurrentScreen());
            };
            _view.ClickedNextButton += () =>
            {
                _screensOrderDataProxy.SetClosingScreenDirectingForward(true);
                if (_tutorialsDataProxy.IsAnyActiveTutorial)
                {
                    DevToDevManager.LogEvent(DevToDevKey.start_onboarding_steps,
                        (DevToDevKey.onboarding_step, DevToDevKey.first_step_goal_set_4.ToString()));
                    _screensController.ExecuteCommand(new NavigationCommand()
                        .ShowNextScreen<PermissionsScreenPresenter>()
                        .WithExtraData(new PermissionsScreenInfo(_info.PetType, _info.PetName, _stepsGoal))
                        .CloseCurrentScreen());
                }
                else
                {
                    _playersPetsDataProxy.CreateNewPet(_info.PetType, _info.PetName, _stepsGoal);
                    CloseScreen();
                }
            };
            _view.ChangedStepsSlider += newValue =>
            {
                _stepsGoal = newValue;
                _view.SetStepsCountText(newValue);
            };
        }

        private void OnShow(object data)
        {
            _view.SetBackButtonInteractable(true);

            if (data is not StepGoalSetUpScreenInfo info)
                return;

            _info = info;
            _stepsGoal = _gameBalances.DefaultStepsGoal;
            _view.Configure(_stepsGoal, info.PetName, _assetsProvider.GetPetEggSprite(info.PetType));
        }
    }
}