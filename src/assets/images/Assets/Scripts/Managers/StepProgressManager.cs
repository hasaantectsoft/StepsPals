using System;
using System.Linq;
using Balances;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using UniRx;
using Zenject;

namespace Managers
{
    public class StepProgressManager : IInitializable, IDisposable
    {
        private readonly HealthStepsDataProxy _healthStepsDataProxy;
        private readonly GameBalances _gameBalances;
        private readonly PlayersPetsDataProxy _playersPetsDataProxy;
        private readonly TutorialsDataProxy _tutorialsDataProxy;
        private readonly CompositeDisposable _compositeDisposable = new();
        private readonly ReactiveDictionary<CareActionType, bool> _turnedOnCareActions = new();
        private float _stepsPercentage;

        public IObservable<CareActionType> LastAvailableCareAction =>
            _turnedOnCareActions.ObserveAdd().Select(it => it.Key)
                .StartWith(_turnedOnCareActions.FirstOrDefault(x => x.Value).Key);

        public float StepsPercentage => _stepsPercentage;

        public StepProgressManager(HealthStepsDataProxy healthStepsDataProxy, PlayersPetsDataProxy playersPetsDataProxy,
            GameBalances balances, TutorialsDataProxy tutorialsDataProxy)
        {
            _healthStepsDataProxy = healthStepsDataProxy;
            _playersPetsDataProxy = playersPetsDataProxy;
            _tutorialsDataProxy = tutorialsDataProxy;
            _gameBalances = balances;
        }

        public void Initialize()
        {
            _healthStepsDataProxy.StepsCount
                .CombineLatest(_playersPetsDataProxy.StepGoalCount,
                    (currentStepsCount, stepsGoalCount) => (currentStepsCount, stepsGoalCount)).Subscribe(tuple =>
                    CalculateLastAvailableCareAction(tuple.currentStepsCount, tuple.stepsGoalCount))
                .AddTo(_compositeDisposable);

            _healthStepsDataProxy.DayChanged += OnDayChanged;
            _playersPetsDataProxy.ActivePet.Where(pet => pet == null).Subscribe(_ => ClearProgress())
                .AddTo(_compositeDisposable);

            _tutorialsDataProxy.CurrentStep.Subscribe(step =>
            {
                if (step == null)
                    return;
                _turnedOnCareActions.Clear();
                _turnedOnCareActions[step.LastCareAction] = true;
            }).AddTo(_compositeDisposable);

            _tutorialsDataProxy.TutorialFinished.Subscribe(_ =>
            {
                CalculateLastAvailableCareAction(_healthStepsDataProxy.StepsCount.Value,
                    _playersPetsDataProxy.StepGoalCount.Value);
            }).AddTo(_compositeDisposable);
        }

        private void CalculateLastAvailableCareAction(int currentStepsCount, int stepsGoalCount)
        {
            _turnedOnCareActions.Clear();
            _stepsPercentage = currentStepsCount / (float)stepsGoalCount * 100f;
            CareActionType lastAvailableCareAction = CareActionType.None;
            foreach ((CareActionType careActionType, float goalPercentage) in _gameBalances.ActionOnGoalPercentage
                         .Dictionary)
            {
                if (_stepsPercentage >= goalPercentage)
                {
                    lastAvailableCareAction = careActionType;
                }
            }

            _turnedOnCareActions[lastAvailableCareAction] = true;
        }

        private void OnDayChanged(int countOfDays, bool changeWeeks)
        {
            ClearProgress();
        }

        private void ClearProgress()
        {
            _stepsPercentage = 0f;
            _turnedOnCareActions.Clear();
        }

        public void Dispose()
        {
            ClearProgress();
            _healthStepsDataProxy.DayChanged -= OnDayChanged;
        }
    }
}