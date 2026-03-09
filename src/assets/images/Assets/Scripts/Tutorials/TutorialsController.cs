using System;
using Balances.Tutorials;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using ScreenNavigationSystem;
using Tutorials.ViewPresenter;
using UniRx;
using Utils;
using Zenject;

namespace Tutorials
{
    public class TutorialsController : IInitializable, IDisposable
    {
        private const float UIHighlightPadding = 100f;

        private readonly CompositeDisposable _compositeDisposable = new();
        private readonly CompositeDisposable _stepDisposable = new();
        private readonly TutorialOverlayPresenter _presenter;
        private readonly ScreensController _screensController;
        private readonly TutorialsDataProxy _tutorialsDataProxy;
        private readonly PlayersPetsDataProxy _playersPetsDataProxy;

        private IDisposable _pointerSpawner;

        private TutorialStepActionType _currentStepAction;

        public TutorialsController(TutorialOverlayPresenter presenter, ScreensController screensController,
            TutorialsDataProxy tutorialsDataProxy, PlayersPetsDataProxy playersPetsDataProxy)
        {
            _screensController = screensController;
            _tutorialsDataProxy = tutorialsDataProxy;
            _playersPetsDataProxy = playersPetsDataProxy;
            _presenter = presenter;
        }

        public void Initialize()
        {
            _presenter.NextButtonClicked += OnNextButtonClicked;
            _tutorialsDataProxy.TutorialFinished.Subscribe(OnTutorialFinished).AddTo(_compositeDisposable);
            _tutorialsDataProxy.CurrentStep.Where(it => it).Subscribe(ConfigureStep).AddTo(_compositeDisposable);
            _tutorialsDataProxy.InteractionPerformed
                .Where(data => _tutorialsDataProxy.IsAnyActiveTutorial &&
                               _currentStepAction == TutorialStepActionType.TargetClick).Subscribe(_ => FinishStep())
                .AddTo(_compositeDisposable);
        }

        public void Activate()
        {
            if (_tutorialsDataProxy.IsTutorialFinished(TutorialScenarioId.StartTutorial))
                return;
            _tutorialsDataProxy.StartTutorial(TutorialScenarioId.StartTutorial);
        }

        private void ConfigureStep(TutorialStepSo step)
        {
            _presenter.ShowOverlay();
            _presenter.SetHighlightRectangleActive(step.HighlightSceneObject != SceneObjectId.None);
            _tutorialsDataProxy.StepWitSceneRectangleStarted.Take(1).Subscribe(position =>
            {
                _presenter.ConfigureSceneHighlightRectangle(position, step.HighlightMaskSceneSize.x,
                    step.HighlightMaskSceneSize.y);
            }).AddTo(_stepDisposable);
            _tutorialsDataProxy.StepWitUIRectangleStarted.Take(1).Subscribe(tuple =>
            {
                _presenter.ConfigureUIHighlightRectangle(tuple.position, tuple.size.x + UIHighlightPadding,
                    tuple.size.y + UIHighlightPadding);
            }).AddTo(_stepDisposable);

            ConfigureView(_tutorialsDataProxy.CreateStepViewInfo(step));
        }

        private void ConfigureView(TutorialStepViewInfo viewInfo)
        {
            _presenter.PrepareStepToShow(viewInfo, _playersPetsDataProxy.ActivePet.Value.Species);
            _currentStepAction = viewInfo.TutorialStepActionType;
        }

        private void OnNextButtonClicked()
        {
            FinishStep();
        }

        private void FinishStep()
        {
            _presenter.SetHighlightRectangleActive(false);
            _presenter.SetUIHighlightRectangleActive(false);
            _stepDisposable.Clear();
            _tutorialsDataProxy.FinishStep();
        }

        private void OnTutorialFinished(TutorialScenarioId scenarioId)
        {
            _presenter.ClearOverlay();
            _stepDisposable.Clear();
            _screensController.ExecuteCommand(new NavigationCommand().CloseAllScreensExceptSubscription());
        }

        public void Dispose()
        {
            if (_presenter && _presenter.isActiveAndEnabled)
            {
                _presenter.ClearOverlay();
                _presenter.NextButtonClicked -= OnNextButtonClicked;
            }

            _compositeDisposable?.Clear();
            _stepDisposable?.Clear();
        }
    }
}