using System.Linq;
using Analytics;
using Assets;
using Data.DataProxy;
using Data.Types;
using ScreenNavigationSystem;
using Screens.PetSelectionScreen;
using Screens.StepGoalSetupScreen;
using Utils;
using Zenject;

namespace Screens.PetNamingScreen
{
    public class PetNamingScreenPresenter : OnboardingScreenPresenter
    {
        private const int MinNameLength = 2;

        private PetNamingScreenView _view;
        private AssetsProvider _assetsProvider;
        private ScreensController _screensController;
        private ScreenOrderDataProxy _screenOrderDataProxy;
        private TutorialsDataProxy _tutorialsDataProxy;
        private PetType _petType;
        private string _name;
        private bool _isResettingOnboarding;

        [Inject]
        private void Construct(AssetsProvider assetsProvider, ScreensController screensController,
            ScreenOrderDataProxy screenOrderDataProxy, TutorialsDataProxy tutorialsDataProxy)
        {
            _assetsProvider = assetsProvider;
            _screensController = screensController;
            _screenOrderDataProxy = screenOrderDataProxy;
            _tutorialsDataProxy = tutorialsDataProxy;
        }

        private new void Awake()
        {
            base.Awake();
            _view = (PetNamingScreenView)view;
            OnShowCallback += OnShow;
            _view.ClickedNextButton += () =>
            {
                _screenOrderDataProxy.SetClosingScreenDirectingForward(true);
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<StepGoalSetupScreenPresenter>()
                    .WithExtraData(new StepGoalSetUpScreenInfo(_petType, _name)).CloseCurrentScreen());
                if (_tutorialsDataProxy.IsAnyActiveTutorial)
                {
                    DevToDevManager.LogEvent(DevToDevKey.start_onboarding_steps,
                        (DevToDevKey.onboarding_step, DevToDevKey.first_pet_named_3.ToString()));
                }
            };
            _view.ClickedBackButton += () =>
            {
                _screenOrderDataProxy.SetClosingScreenDirectingForward(false);
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<PetSelectionScreenPresenter>()
                    .CloseCurrentScreen());
            };
            _view.NameChanged += newName =>
            {
                bool isValid = ValidateName(newName, out string error);
                _view.SetNextButtonInteractable(isValid);
                if (isValid)
                {
                    _view.HideErrorMessage();
                    _name = newName;
                }
                else
                {
                    _view.ShowErrorMessage(error);
                }
            };
        }

        private bool ValidateName(string newName, out string error)
        {
            error = string.Empty;
            if (newName.Length is > 0 and < MinNameLength)
            {
                error = StringKeys.TooShortNameError;
            }

            if (newName.Any(character => !character.IsCharacterAllowed()))
            {
                error = StringKeys.NotAllowedCharacterError;
            }
            else if (newName.Any(character => character.IsLetter() && !character.IsBasicLatinLetter()))
            {
                error = StringKeys.NotLatinCharacterError;
            }

            if (string.IsNullOrWhiteSpace(newName))
            {
                error = StringKeys.EmptyFieldError;
            }

            return string.IsNullOrEmpty(error);
        }

        private void OnShow(object data)
        {
            _view.SetBackButtonInteractable(true);
            if (data is not PetNamingViewInfo info)
                return;

            _isResettingOnboarding = info.ResetView;
            if (_isResettingOnboarding)
            {
                _view.Reset();
            }

            _petType = info.SelectedPetType;
            _view.Configure(_assetsProvider.GetPetEggSprite(_petType));
        }
    }
}