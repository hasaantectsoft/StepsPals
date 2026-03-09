using System;
using System.Collections.Generic;
using System.Linq;
using Analytics;
using Balances;
using Cysharp.Threading.Tasks;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using Managers;
using Managers.OpenPopupsQueue;
using ScreenNavigationSystem;
using Screens.CollectionScreen;
using Screens.ConditionsPopup;
using Screens.ConfirmationPopup;
using Screens.DeathPopup;
using Screens.EvolutionStagePopup;
using Screens.GreatJobPopup;
using Screens.NewPetProposalPopup;
using Screens.Shared.Buttons;
using Screens.Shared.NavigationBar;
using Screens.Shared.PetGrave;
using Tutorials;
using UniRx;
using UnityEngine;
using Utils;
using Zenject;

namespace Screens.HomeScreen
{
    [RequireComponent(typeof(HomeScreenView))]
    public class HomeScreenPresenter : MonoBehaviour, IInitializable, IDisposable
    {
        private const float ConditionPopupDelay = 1f;

        [SerializeField] private HomeScreenView view;
        [SerializeField] private NavigationBarPresenter navigationBar;

        private PlayersPetsDataProxy _playersPetsDataProxy;
        private ActivePetDataProxy _activePetDataProxy;
        private HealthStepsDataProxy _healthStepsDataProxy;
        private GameBalances _gameBalances;
        private ScreensController _screensController;
        private TutorialsDataProxy _tutorialsDataProxy;
        private StepProgressManager _stepProgressManager;
        private TutorialsController _tutorialsController;
        private RateUsManager _rateUsManager;
        private OpenPopupOnLaunchManager _openPopupOnLaunchManager;

        [Inject]
        private void Construct(PlayersPetsDataProxy playersPetsDataProxy, HealthStepsDataProxy healthStepsDataProxy,
            ScreensController screensController, GameBalances gameBalances, TutorialsDataProxy tutorialsDataProxy,
            TutorialsController tutorialsController, StepProgressManager stepProgressManager,
            RateUsManager rateUsManager, OpenPopupOnLaunchManager openPopupOnLaunchManager)
        {
            _playersPetsDataProxy = playersPetsDataProxy;
            _healthStepsDataProxy = healthStepsDataProxy;
            _gameBalances = gameBalances;
            _screensController = screensController;
            _tutorialsDataProxy = tutorialsDataProxy;
            _tutorialsController = tutorialsController;
            _stepProgressManager = stepProgressManager;
            _rateUsManager = rateUsManager;
            _openPopupOnLaunchManager = openPopupOnLaunchManager;
        }

        public void Initialize()
        {
            view.Configure();
            navigationBar.Initialize(NavigationButtonType.Home);
            view.ClickedCareAction += OnClickedCareAction;
            view.ClickedInactiveCareButton += OnClickedInactiveCareButton;
            view.ClickedCollectionButton += OnClickedCollectionButton;
            view.ClickedNewPetButton += OnClickedNewPet;

            _playersPetsDataProxy.ActivePet.Where(activePet => activePet != null).Subscribe(RegisterNewPet).AddTo(this);
            _playersPetsDataProxy.BuryPet += BuryPet;
            _playersPetsDataProxy.StepGoalCount
                .CombineLatest(_healthStepsDataProxy.StepsCount, (goal, currentCount) => (goal, currentCount))
                .Subscribe(tuple => { view.UpdateStepsSlider(tuple.currentCount, tuple.goal); }).AddTo(this);

            ConfigureTutorialData();
            DevToDevManager.LogEvent(DevToDevKey.home_screen_opened);
        }

        private void OnClickedNewPet()
        {
            if (_activePetDataProxy.IsInCollection || _playersPetsDataProxy.TryAddActivePetToCollection())
            {
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<NewPetProposalPopupPresenter>()
                    .CloseCurrentScreen());
            }
            else
            {
                string oldestPetName = _playersPetsDataProxy.GetOldestPetNameInCollection();
                if (!string.IsNullOrEmpty(oldestPetName))
                {
                    _screensController.ExecuteCommand(new NavigationCommand()
                        .ShowNextScreen<ConfirmationPopupPresenter>().WithExtraData(oldestPetName)
                        .CloseCurrentScreen());
                }
            }
        }

        private void OnClickedCollectionButton()
        {
            _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<CollectionScreenPresenter>());
        }

        private void OnClickedInactiveCareButton(CareActionType careActionType)
        {
            if (_tutorialsDataProxy.IsAnyActiveTutorial)
            {
                return;
            }

            view.TryHideHintBubblesInCareActionButtons(careActionType);
        }

        private void ConfigureTutorialData()
        {
            navigationBar.SetOverlayAboveNavigationBar(_tutorialsDataProxy.IsAnyActiveTutorial);
            if (_tutorialsDataProxy.IsAnyActiveTutorial)
            {
                _playersPetsDataProxy.ActivePet.Where(activePet => activePet != null).Take(1).Subscribe(pet =>
                {
                    _tutorialsController.Activate();
                    _playersPetsDataProxy.ActivePet.Value.ResetMaturity();
                }).AddTo(this);

                _activePetDataProxy?.ResetCareActions();
            }

            _tutorialsDataProxy.CurrentStep.Where(step => step).Subscribe(step =>
            {
                view.ShowTutorialRectangleOverlay(step.HighlightUIObject,
                    _tutorialsDataProxy.CreateStepViewInfo(step).SortOrder);
            }).AddTo(this);

            _tutorialsDataProxy.TutorialFinished.Subscribe(_ =>
            {
                _activePetDataProxy?.ResetCareActions();
                navigationBar.SetOverlayAboveNavigationBar(false);
            }).AddTo(this);
        }

        private async UniTask OnBuryPet()
        {
            view.SetOverlayActive(true);
            await navigationBar.HighlightButton(NavigationButtonType.Graveyard);
            if (gameObject.GetCancellationTokenOnDestroy().IsCancellationRequested)
                return;
            _playersPetsDataProxy.RemoveActivePet();
        }

        private void OnClickedCareAction(CareActionType careAction)
        {
            if (careAction <= _activePetDataProxy.LastDoneCareAction.Value)
                return;

            if (_tutorialsDataProxy.IsAnyActiveTutorial)
            {
                _tutorialsDataProxy.TrackInteraction(TutorialStepActionType.TargetClick);
            }
            else
            {
                DevToDevManager.LogEvent(DevToDevKey.action_performed,
                    (DevToDevKey.action, DevToDevHelper.CareActionsKeys[careAction]),
                    (DevToDevKey.percent_when, _stepProgressManager.StepsPercentage));
            }

            _activePetDataProxy.TakeCareOfPet(careAction);
        }

        private void RegisterNewPet(ActivePetDataProxy pet)
        {
            _activePetDataProxy = pet;
            _activePetDataProxy.OnFirstTapOnEgg += () => view.SetHatchText(StringKeys.AfterFirstTapText);
            view.SetOverlayActive(false);

            _activePetDataProxy.MaturationStage.Subscribe(maturityStage =>
            {
                bool isEgg = maturityStage == PetMaturity.Egg;
                view.SetHatchTextBlockActive(isEgg && !_tutorialsDataProxy.IsAnyActiveTutorial);
                view.SetTopPanelActive(maturityStage != PetMaturity.Egg);
                if (isEgg)
                {
                    view.SetHatchText(StringKeys.NoTapsText);
                }

                view.SetNewPetButtonActive(maturityStage == PetMaturity.Adult);
                view.SetCollectionButtonActive(maturityStage != PetMaturity.Egg);
            }).AddTo(this);

            if (_activePetDataProxy.MaturationStage.Value == PetMaturity.Adult)
            {
                _playersPetsDataProxy.TryAddActivePetToCollection();
            }

            _activePetDataProxy.AnimationState.Where(tuple => tuple.careActionType == CareActionType.GiveTreat)
                .Pairwise().Where(pair => pair.Previous.isOn && !pair.Current.isOn).Subscribe(_ =>
                {
                    Debug.Log("GiveTreat ended!");
                    OnAllCareActionsDone();
                }).AddTo(this);

            _activePetDataProxy.PetMaturated.Subscribe(petMaturity =>
            {
                if (petMaturity is PetMaturity.Teen or PetMaturity.Adult)
                {
                    _openPopupOnLaunchManager.ShowScreen<EvolutionStagePopupPresenter>(
                        new EvolutionStagePopupViewInfo(_activePetDataProxy.Species, petMaturity,
                            _activePetDataProxy.Name));
                }
            }).AddTo(this);

            if (_activePetDataProxy.LastDoneCareAction.Value == CareActionType.GiveTreat)
            {
                _activePetDataProxy.EndDaySuccessfullyAndTryMaturate();
            }

            _activePetDataProxy.Condition.Where(condition => condition != ConditionState.Healthy).Subscribe(condition =>
            {
                OpenConditionsPopup(condition).Forget();
            }).AddTo(this);

            _activePetDataProxy.AnimationState.CombineLatest(_stepProgressManager.LastAvailableCareAction,
                    _activePetDataProxy.Condition,
                    (animationInProcess, lastCareAction, condition) => (animationInProcess, lastCareAction, condition))
                .Subscribe(data =>
                {
                    int indexOfCompletedAction = (int)data.animationInProcess.careActionType;
                    UpdateCareActionsButtons(indexOfCompletedAction, data.lastCareAction, data.animationInProcess.isOn,
                        data.condition);
                }).AddTo(this);

            _stepProgressManager.LastAvailableCareAction.Where(action => action != CareActionType.None).Subscribe(
                lastAction =>
                {
                    if (_tutorialsDataProxy.IsAnyActiveTutorial) return;
                    SendStepProgressAnalytics(lastAction);
                }).AddTo(this);
        }

        private void SendStepProgressAnalytics(CareActionType lastAction)
        {
            Debug.Log($"Reached care action {lastAction}");
            List<CareActionType> careActions = Utils.Utils.GetEnumValues<CareActionType>().ToList();
            for (int i = 0; i <= careActions.IndexOf(lastAction); i++)
            {
                CareActionType action = careActions[i];
                if (_gameBalances.ActionOnGoalPercentage.Dictionary.TryGetValue(action, out float percentageValue))
                {
                    DevToDevManager.LogEvent(DevToDevKey.steps_progress,
                        (DevToDevKey.percent_reached, percentageValue));
                }
            }
        }

        private void OnAllCareActionsDone()
        {
            bool petMatured = _activePetDataProxy.EndDaySuccessfullyAndTryMaturate();
            if (!petMatured)
            {
                _openPopupOnLaunchManager.ShowScreen<GreatJobPopupPresenter>(
                    new EvolutionStagePopupViewInfo(_activePetDataProxy.Species,
                        _activePetDataProxy.MaturationStage.Value, _activePetDataProxy.Name));
            }

            _rateUsManager.TryShowRateUsPopup(petMatured);
        }

        private async UniTask OpenConditionsPopup(ConditionState condition)
        {
            _screensController.ExecuteCommand(new NavigationCommand().CloseAllScreensExceptSubscription());
            view.SetOverlayActive(true);

            await UniTask.Delay(TimeSpan.FromSeconds(ConditionPopupDelay),
                cancellationToken: gameObject.GetCancellationTokenOnDestroy());
            if (condition == ConditionState.Dead)
            {
                await UniTask.Delay(TimeSpan.FromSeconds(ConditionPopupDelay),
                    cancellationToken: gameObject.GetCancellationTokenOnDestroy());
                _openPopupOnLaunchManager.ShowScreen<DeathPopupPresenter>(new PetGraveViewInfo(_activePetDataProxy.Name,
                    _activePetDataProxy.Species, _activePetDataProxy.Birthday,
                    _activePetDataProxy.DeathDay ?? DateTime.Now.Date));
            }
            else
            {
                _openPopupOnLaunchManager.ShowScreen<ConditionsPopupPresenter>(
                    new ConditionsPopupViewInfo(condition, _activePetDataProxy.Name));
            }

            view.SetOverlayActive(false);
        }

        private void UpdateCareActionsButtons(int indexOfCompletedAction, CareActionType lastActiveProgress,
            bool isInAnimation, ConditionState condition)
        {
            foreach (CareActionType careAction in view.CareActionsButtons.Keys)
            {
                bool passedStepGoal = careAction <= lastActiveProgress;
                int indexOfThisCareAction = (int)careAction;
                bool isDone = indexOfThisCareAction <= indexOfCompletedAction;
                bool isCurrentActive = indexOfThisCareAction == indexOfCompletedAction + 1 && passedStepGoal &&
                                       !isInAnimation && condition != ConditionState.Dead;

                CareActionState state = isDone ? CareActionState.Completed : isCurrentActive ? CareActionState.Available
                    : CareActionState.NotAvailable;
                string hintText = passedStepGoal ? StringKeys.HintCompletePrevAction
                    : string.Format(StringKeys.HintNeedToHitStepGoal, _gameBalances.ActionOnGoalPercentage[careAction]);
                view.SetCareActionState(careAction, state, hintText, !_tutorialsDataProxy.IsAnyActiveTutorial);

                if (careAction == CareActionType.GiveTreat)
                {
                    view.PlayPulsingStarAnimation(state == CareActionState.Available);
                }
            }
        }

        private void BuryPet()
        {
            OnBuryPet().Forget();
        }

        public void Dispose()
        {
            _screensController?.Dispose();
            _stepProgressManager?.Dispose();
            _tutorialsController?.Dispose();
            _openPopupOnLaunchManager?.Dispose();
            _playersPetsDataProxy.BuryPet -= BuryPet;
        }
    }
}