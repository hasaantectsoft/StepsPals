using System;
using BeliefEngine.HealthKit;
using Data.Models;
using UniRx;

namespace Data.DataProxy
{
    public class HealthStepsDataProxy : IDataProxy
    {
        private HealthStore _healthStore;
        private readonly ReactiveProperty<int> _stepsCount = new();
        private readonly ReactiveProperty<DateTimeOffset> _currentDayMidnight = new();

        public IReadOnlyReactiveProperty<int> StepsCount => _stepsCount;
        public DateTimeOffset CurrentDayMidnight => _currentDayMidnight.Value;
        public event Action<int, bool> DayChanged;

        public void SetGameState(GameStateModel gameStateModel)
        {
            gameStateModel.steps ??= new StepsModel();
            if (gameStateModel.steps.dayOfSteps.Date != DateTimeOffset.Now.Date)
            {
                DateTimeOffset firstDate = gameStateModel.steps.dayOfSteps;
                DateTimeOffset secondDate = DateTimeOffset.Now;
                DayChanged?.Invoke(Utils.Utils.CountDayDifference(firstDate, secondDate),
                    Utils.Utils.AreDifferentWeeks(firstDate, secondDate));
                gameStateModel.steps.dayOfSteps = DateTimeOffset.Now.Date;
                gameStateModel.steps.stepsCount = 0;
            }

            _stepsCount.Value = gameStateModel.steps.stepsCount;
            _currentDayMidnight.Value = gameStateModel.steps.dayOfSteps;
            _stepsCount.Subscribe(steps => gameStateModel.steps.stepsCount = steps);
            _currentDayMidnight.Where(day => day.Date != gameStateModel.steps.dayOfSteps.Date).Subscribe(date =>
            {
                _stepsCount.Value = 0;
                DateTimeOffset firstDate = gameStateModel.steps.dayOfSteps;
                DayChanged?.Invoke(Utils.Utils.CountDayDifference(firstDate, date),
                    Utils.Utils.AreDifferentWeeks(firstDate, date));
                gameStateModel.steps.dayOfSteps = date;
            });
        }

        public void SetStepsCount(int stepsCount) => _stepsCount.Value = stepsCount;
        public void SkipDays(int daysCount, bool changeWeek) => DayChanged?.Invoke(daysCount, changeWeek);
        public void SetCurrentDay(DateTimeOffset date) => _currentDayMidnight.Value = date.Date;
    }
}