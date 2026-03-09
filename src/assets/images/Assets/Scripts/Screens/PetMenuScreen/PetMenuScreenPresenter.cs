using Analytics;
using Assets;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Helpers;
using Data.Types;
using ScreenNavigationSystem;
using Tutorials;
using UniRx;
using UnityEngine;
using Zenject;

namespace Screens.PetMenuScreen
{
    [RequireComponent(typeof(PetMenuScreenView))]
    public class PetMenuScreenPresenter : ScreenPresenter
    {
        [SerializeField] private PetMenuScreenView view;

        private readonly CompositeDisposable _compositeDisposable = new();
        private int _stepsGoalValue;
        private int _savedStepGoal;
        private PlayersPetsDataProxy _playersPetsDataProxy;
        private TutorialsDataProxy _tutorialsDataProxy;
        private AssetsProvider _assetsProvider;

        [Inject]
        private void Construct(PlayersPetsDataProxy playersPetsDataProxy, AssetsProvider assetsProvider,
            TutorialsDataProxy tutorialsDataProxy)
        {
            _playersPetsDataProxy = playersPetsDataProxy;
            _assetsProvider = assetsProvider;
            _tutorialsDataProxy = tutorialsDataProxy;
        }

        private void Awake()
        {
            view.Initialize();

            OnShowCallback += OnShow;
            OnHideCallback += () => { _compositeDisposable.Clear(); };
            view.ChangedStepsSlider += newValue =>
            {
                _stepsGoalValue = newValue;
                view.SetStepsGoalText(_stepsGoalValue);
                view.SetSaveButtonInteractable(_stepsGoalValue != _savedStepGoal);
            };
            view.ClickedBackButton += OnBackButtonClicked;
            view.ClickedSaveButton += () =>
            {
                _playersPetsDataProxy.SetNewStepGoalForNextDay(_stepsGoalValue);
                DevToDevManager.LogEvent(DevToDevKey.step_goal_changed, (DevToDevKey.goal_prev, _savedStepGoal),
                    (DevToDevKey.goal_new, _stepsGoalValue));
                _savedStepGoal = GetActualSavedStepGoal();
                view.SetSaveButtonInteractable(_stepsGoalValue != _savedStepGoal);
                OnBackButtonClicked();
            };
        }

        private void OnShow(object data)
        {
            DevToDevManager.LogEvent(DevToDevKey.pet_menu_opened);
            _savedStepGoal = GetActualSavedStepGoal();
            _stepsGoalValue = _savedStepGoal;

            ActivePetDataProxy activePetDataProxy = _playersPetsDataProxy.ActivePet.Value;

            view.Configure(_stepsGoalValue);
            view.SetPetNameText(activePetDataProxy.Name);
            activePetDataProxy.MaturationStage
                .CombineLatest(activePetDataProxy.GrowthDay, (maturity, growth) => (maturity, growth))
                .Subscribe(tuple =>
                {
                    view.SetGrowthProgressText(tuple.growth, activePetDataProxy.GetDaysToMature(),
                        tuple.maturity == PetMaturity.Adult);
                }).AddTo(_compositeDisposable);

            view.ChangePetMenuInfoValue(PetMenuInfoType.Species,
                ContentHelper.PetTypeNames[activePetDataProxy.Species]);
            activePetDataProxy.Age
                .Subscribe(age => view.ChangePetMenuInfoValue(PetMenuInfoType.Age, age.ToString(), age != 1))
                .AddTo(_compositeDisposable);
            activePetDataProxy.Condition.Subscribe(condition =>
                    view.ChangePetMenuInfoValue(PetMenuInfoType.Condition, ContentHelper.ConditionsStrings[condition]))
                .AddTo(_compositeDisposable);
            activePetDataProxy.MaturationStage.Subscribe(stage =>
                view.ChangePetMenuInfoValue(PetMenuInfoType.MatureStage, stage.ToString())).AddTo(_compositeDisposable);
            activePetDataProxy.MissedDays.Subscribe(missedDays =>
                    view.ChangePetMenuInfoValue(PetMenuInfoType.MissedDays, missedDays.ToString()))
                .AddTo(_compositeDisposable);
            activePetDataProxy.MaturationStage
                .CombineLatest(activePetDataProxy.Condition, (maturity, condition) => (maturity, condition)).Subscribe(
                    tuple =>
                    {
                        view.SetPetImage(_assetsProvider.GetPetSprite(activePetDataProxy.Species, tuple.maturity,
                            tuple.condition));
                    }).AddTo(this);


            view.SetSaveButtonInteractable(false);
        }

        private int GetActualSavedStepGoal() =>
            _playersPetsDataProxy.IsNewStepGoalPending ? _playersPetsDataProxy.NewStepGoalForNextDay
                : _playersPetsDataProxy.StepGoalCount.Value;

        private void OnBackButtonClicked()
        {
            if (_tutorialsDataProxy.IsAnyActiveTutorial)
            {
                _tutorialsDataProxy.TrackInteraction(TutorialStepActionType.TargetClick);
            }

            CloseScreen();
        }
    }
}