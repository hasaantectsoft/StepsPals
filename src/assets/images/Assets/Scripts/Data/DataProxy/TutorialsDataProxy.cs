using System;
using System.Linq;
using Analytics;
using Balances;
using Balances.Tutorials;
using Data.Models;
using Data.Types;
using Tutorials;
using UniRx;
using UnityEngine;
using Utils;

namespace Data.DataProxy
{
    public class TutorialsDataProxy : IDataProxy
    {
        private readonly TutorialsBalances _tutorialsBalances;
        private TutorialScenarioData _activeTutorialData;

        #region private Observables and Reactive Properties

        private readonly ReactiveProperty<bool> _canSkip = new();
        private readonly ReactiveProperty<TutorialStepSo> _currentStep = new();
        private readonly ReactiveDictionary<TutorialScenarioId, TutorialProgressModel> _models = new();
        private readonly ReactiveProperty<bool> _isAnyActiveTutorial = new();
        private readonly Subject<TutorialScenarioId> _tutorialFinished = new();
        private readonly Subject<Vector3> _stepWithSceneRectangleStarted = new();
        private readonly Subject<(Vector3 position, Vector2 size)> _stepWithUIRectangleStarted = new();
        private readonly Subject<TutorialStepActionType> _interactionPerformed = new();

        #endregion

        #region public Observables

        public IReadOnlyReactiveProperty<TutorialStepSo> CurrentStep => _currentStep;

        public IObservable<Vector3> StepWitSceneRectangleStarted => _stepWithSceneRectangleStarted;
        public IObservable<(Vector3 position, Vector2 size)> StepWitUIRectangleStarted => _stepWithUIRectangleStarted;

        public IObservable<TutorialStepActionType> InteractionPerformed => _interactionPerformed;

        public IObservable<TutorialScenarioId> TutorialFinished => _tutorialFinished;

        #endregion

        public bool IsAnyActiveTutorial => _isAnyActiveTutorial.Value;

        public TutorialsDataProxy(GameBalances gameBalances)
        {
            _tutorialsBalances = gameBalances.TutorialsBalances;
        }

        public void SetGameState(GameStateModel gameStateModel)
        {
            AddMissingModels();
            foreach ((TutorialScenarioId tutorialId, TutorialProgressModel model) in gameStateModel.tutorialsProgress)
            {
                _models[tutorialId] = model;
            }

            _models.ObserveCountChanged().Subscribe(_ => SaveData());
            _models.ObserveReplace().Subscribe(_ => SaveData());

            UpdateActiveTutorialStatus();

            return;

            void SaveData()
            {
                gameStateModel.tutorialsProgress = _models.ToDictionary();
                UpdateActiveTutorialStatus();
            }

            void UpdateActiveTutorialStatus()
            {
                _isAnyActiveTutorial.Value = _models.Any(it => !it.Value.passed);
            }
        }

        public void StartTutorial(TutorialScenarioId tutorialId)
        {
            if (_models.Count == 0)
            {
                return;
            }

            if (_activeTutorialData != null)
            {
                Debug.LogError($"Tutorial {tutorialId} is already active!");
                return;
            }

            DevToDevManager.LogEvent(DevToDevKey.tutorial_steps,
                (DevToDevKey.tutorial_step, DevToDevKey.tutorial_started_1.ToString()));
            _activeTutorialData = _tutorialsBalances.GetTutorialBalances(tutorialId);

            int lastStepIndex = 0;

            if (_models.TryGetValue(tutorialId, out TutorialProgressModel progress))
            {
                lastStepIndex = progress.lastStep;
            }
            else
            {
                _models[tutorialId] = new TutorialProgressModel();
            }

            TutorialStepSo stepSo = _activeTutorialData.StepsSo[lastStepIndex];

            SetStep(stepSo);
        }

        public void TrackInteraction(TutorialStepActionType clickUi)
        {
            _interactionPerformed.OnNext(clickUi);
        }

        public void FinishStep()
        {
            TutorialStepSo currentStep = _currentStep.Value;

            if (!currentStep)
            {
                return;
            }

            DevToDevManager.LogEvent(DevToDevKey.tutorial_steps,
                (DevToDevKey.tutorial_step, currentStep.DevToDevKey.ToString()));
            
            TutorialStepSo[] steps = _activeTutorialData.StepsSo;
            int currentStepIndex = Array.IndexOf(steps, currentStep);
            int nextStepIndex = currentStepIndex + 1;

            if (nextStepIndex < steps.Length)
            {
                currentStep = SetStep(steps[nextStepIndex]);
                _canSkip.Value = currentStep.CanSkipTutorial;
            }
            else
            {
                FinishActiveTutorial();
            }
        }

        public bool IsTutorialFinished(TutorialScenarioId id) =>
            _models.TryGetValue(id, out TutorialProgressModel progressData) && progressData.passed;

        public TutorialStepViewInfo CreateStepViewInfo(TutorialStepSo step) =>
            new(step.Message, step.Action, step.DialogCanvasDrawOrder, step.BubblePointerPosition, step.ShowDoneIcon,
                step.Text, step.IsTextActive, step.StringFormatText, step.MessageBubblePosition, step.OverlayActive);

        public void ShowSceneRectangle(Vector3 position)
        {
            _stepWithSceneRectangleStarted.OnNext(position);
        }

        public void ShowUIRectangle(Vector3 position, Vector2 size)
        {
            _stepWithUIRectangleStarted.OnNext((position, size));
        }

        private void FinishTutorial(TutorialScenarioId tutorialId)
        {
            _models.Remove(tutorialId);
            _models[tutorialId] = new TutorialProgressModel {passed = true};
        }

        private TutorialStepSo SetStep(TutorialStepSo step)
        {
            _currentStep.Value = step;
            return _currentStep.Value;
        }

        private void FinishActiveTutorial()
        {
            if (_activeTutorialData == null)
            {
                return;
            }

            TutorialScenarioId tutorialId = _activeTutorialData.Id;
            FinishTutorial(tutorialId);
            _activeTutorialData = null;
            _currentStep.Value = null;
            _tutorialFinished.OnNext(tutorialId);
        }

        private void AddMissingModels()
        {
            foreach (TutorialScenarioId tutorialScenarioId in Utils.Utils.GetEnumValues<TutorialScenarioId>())
            {
                if (_models.TryGetValue(tutorialScenarioId, out TutorialProgressModel _))
                {
                    continue;
                }

                _models.Add(tutorialScenarioId, new TutorialProgressModel());
            }
        }
    }
}