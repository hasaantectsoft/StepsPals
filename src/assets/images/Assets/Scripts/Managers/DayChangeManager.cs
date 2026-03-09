using System.Linq;
using Analytics;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using UnityEngine;

namespace Managers
{
    public class DayChangeManager
    {
        private readonly HealthStepsDataProxy _healthStepsDataProxy;
        private readonly PlayersPetsDataProxy _playersPetsDataProxy;
        private readonly StatisticsDataProxy _statisticsDataProxy;

        public DayChangeManager(HealthStepsDataProxy healthStepsDataProxy, PlayersPetsDataProxy playersPetsDataProxy,
            StatisticsDataProxy statisticsDataProxy)
        {
            _healthStepsDataProxy = healthStepsDataProxy;
            _playersPetsDataProxy = playersPetsDataProxy;
            _statisticsDataProxy = statisticsDataProxy;
            _healthStepsDataProxy.DayChanged += OnDayChanged;
        }

        private void OnDayChanged(int countOfDays, bool changeWeeks)
        {
            if (_playersPetsDataProxy.ActivePet == null)
                return;

            _playersPetsDataProxy.TryChangeStepGoal();

            ActivePetDataProxy activePet = _playersPetsDataProxy.ActivePet.Value;
            if (activePet == null)
                return;

            if (countOfDays > 0)
            {
                UpdatePetData(countOfDays, activePet);
            }
        }

        private void UpdatePetData(int countOfDays, ActivePetDataProxy activePet)
        {
            Debug.Log("UpdatePetData on day change");
            if (activePet.MaturationStage.Value == PetMaturity.Egg)
                return;

            if (activePet.Condition.Value == ConditionState.Dead)
            {
                activePet.AddMissedDays(countOfDays);
                UpdateAnalyticsEvents(activePet, false);
                return;
            }

            bool allActionsDone = activePet.AllCareActionsDone;
            bool success = allActionsDone && countOfDays == 1;
            ConditionState conditionState = ConditionState.Healthy;
            ConditionState prevCondition = activePet.Condition.Value;
            int missedDays = success ? 0 : countOfDays - (allActionsDone ? 1 : 0);
            if (success)
            {
                activePet.EndDaySuccessfullyAndTryMaturate();
            }
            else
            {
                conditionState = activePet.EndPetFailDay(missedDays);
            }

            if (conditionState != ConditionState.Dead)
            {
                activePet.AddAge(countOfDays);
            }
            else
            {
                int daysPassed = (int)Utils.Utils.GetEnumValues<ConditionState>().Last() - (int)prevCondition;
                activePet.AddAge(allActionsDone ? daysPassed : daysPassed - 1);
            }

            UpdateAnalyticsEvents(activePet, success);
            if (activePet.Condition.Value == ConditionState.Dead)
            {
                DevToDevManager.LogEvent(DevToDevKey.pet_dead, (DevToDevKey.days_lived, activePet.Age.Value),
                    (DevToDevKey.best_streak, _statisticsDataProxy.BestStreak));
            }

            activePet.ResetCareActions();
        }

        private void UpdateAnalyticsEvents(ActivePetDataProxy activePet, bool success)
        {
            if (!_statisticsDataProxy.IsInitialized)
            {
                return;
            }

            DevToDevManager.LogEvent(DevToDevKey.daily_result, (DevToDevKey.all_done, success),
                (DevToDevKey.missed_consecutive, (int)activePet.Condition.Value),
                (DevToDevKey.current_streak, _statisticsDataProxy.CurrentStreak),
                (DevToDevKey.current_state, DevToDevHelper.PetConditionsKeys[activePet.Condition.Value]),
                (DevToDevKey.mature_stage, DevToDevHelper.PetMaturityKeys[activePet.MaturationStage.Value]),
                (DevToDevKey.pet_age, activePet.Age.Value));

            DevToDevManager.LogEvent(DevToDevKey.daily_stats,
                (DevToDevKey.missed_total, _statisticsDataProxy.TotalMissedDays),
                (DevToDevKey.current_streak, _statisticsDataProxy.CurrentStreak),
                (DevToDevKey.best_streak, _statisticsDataProxy.BestStreak),
                (DevToDevKey.total_dead_pets, _statisticsDataProxy.DeadPetsCount),
                (DevToDevKey.total_grown_pets, _statisticsDataProxy.TotalGrownPets));
        }
    }
}