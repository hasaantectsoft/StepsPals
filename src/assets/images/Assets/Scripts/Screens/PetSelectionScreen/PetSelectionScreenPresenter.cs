using System.Linq;
using Analytics;
using Assets;
using Data.DataProxy;
using Data.Helpers;
using Data.Types;
using ScreenNavigationSystem;
using Screens.PetNamingScreen;
using Screens.Shared;
using UniRx;
using UnityEngine;
using Zenject;

namespace Screens.PetSelectionScreen
{
    public class PetSelectionScreenPresenter : OnboardingScreenPresenter
    {
        private PetSelectionScreenView _view;
        private ScreensController _screensController;
        private AssetsProvider _assetsProvider;
        private ScreenOrderDataProxy _screenOrderDataProxy;
        private TutorialsDataProxy _tutorialsDataProxy;

        private PetType? _selectedPetType;
        private readonly ReactiveDictionary<PetType, bool> _selectedPets = new();
        private bool _isResettingOnboarding;

        [Inject]
        private void Construct(ScreensController screensController, AssetsProvider assetsProvider,
            ScreenOrderDataProxy screenOrderDataProxy, TutorialsDataProxy tutorialsDataProxy)
        {
            _screensController = screensController;
            _assetsProvider = assetsProvider;
            _screenOrderDataProxy = screenOrderDataProxy;
            _tutorialsDataProxy = tutorialsDataProxy;
        }

        private new void Awake()
        {
            base.Awake();
            _view = (PetSelectionScreenView)view;

            OnShowCallback += OnShow;
            _view.ClickedNextButton += () =>
            {
                if (!_selectedPetType.HasValue)
                    return;

                _screenOrderDataProxy.SetClosingScreenDirectingForward(true);
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<PetNamingScreenPresenter>()
                    .WithExtraData(new PetNamingViewInfo(_isResettingOnboarding, _selectedPetType.Value))
                    .CloseCurrentScreen());
                
                if (_tutorialsDataProxy.IsAnyActiveTutorial)
                {
                    DevToDevManager.LogEvent(DevToDevKey.start_onboarding_steps,
                        (DevToDevKey.onboarding_step, DevToDevKey.first_pet_selected_2.ToString()));
                }
            };

            _view.ToggleChanged += (pet, selected) =>
            {
                _selectedPets[pet] = selected;
                bool allUnselected = _selectedPets.All(isOn => !isOn.Value);
                SetSelectedPet(allUnselected ? null : pet);
            };
        }

        private void OnShow(object data)
        {
            if (_tutorialsDataProxy.IsAnyActiveTutorial)
            {
                DevToDevManager.LogEvent(DevToDevKey.start_onboarding_steps,
                    (DevToDevKey.onboarding_step, DevToDevKey.first_onboarding_started_1.ToString()));
            }

            if (data is PetSelectionViewInfo {ResetView: true})
            {
                _view.Reset();
                _selectedPetType = null;
                _isResettingOnboarding = true;
            }
            else
            {
                _isResettingOnboarding = false;
            }

            ConfigureToggles();
            SetSelectedPet(_selectedPetType);
        }

        private void SetSelectedPet(PetType? type)
        {
            _view.Configure(type.HasValue);
            if (type.HasValue)
            {
                _selectedPetType = type;
            }
        }

        private void ConfigureToggles()
        {
            foreach ((PetType type, PetToggleView petToggle) in _view.petsToggles.Dictionary)
            {
                Sprite sprite = _assetsProvider.GetPetEggSprite(type);
                petToggle.ConfigureToggle(sprite, ContentHelper.PetTypeNames[type], !_selectedPetType.HasValue);
            }
        }
    }
}