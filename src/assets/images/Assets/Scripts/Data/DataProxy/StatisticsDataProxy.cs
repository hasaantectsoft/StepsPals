using Data.Models;
using Screens.StatisticsScreen;

namespace Data.DataProxy
{
    public class StatisticsDataProxy : IDataProxy
    {
        private StatisticsModel _statisticsData;

        public int CurrentStreak => _statisticsData.currentStreak;
        public int TotalMissedDays => _statisticsData.totalMissedDays;
        public int BestStreak => _statisticsData.bestStreak;
        public int TotalGrownPets => _statisticsData.fullyGrownPetsCount;
        public int DeadPetsCount => _statisticsData.deadPetsCount;
        
        public bool IsInitialized => _statisticsData != null;

        public void SetGameState(GameStateModel gameStateModel)
        {
            gameStateModel.statistics ??= new StatisticsModel();
            _statisticsData = gameStateModel.statistics;
        }

        public StatisticsViewInfo GetStatisticsViewInfo() =>
            new(_statisticsData.bestStreak, _statisticsData.currentStreak, _statisticsData.totalMissedDays,
                _statisticsData.deadPetsCount, _statisticsData.fullyGrownPetsCount);

        public void UpdateStatisticsOnPetBuried()
        {
            _statisticsData.bestStreak = 0;
            _statisticsData.deadPetsCount++;
            _statisticsData.totalMissedDays = 0;
        }

        public void UpdateFullyGrownPetsStatistics()
        {
            _statisticsData.fullyGrownPetsCount++;
        }

        public void UpdateTotalMissedDays()
        {
            _statisticsData.currentStreak = 0;
            _statisticsData.totalMissedDays++;
        }

        public void UpdateStreak()
        {
            _statisticsData.currentStreak++;
            if (_statisticsData.bestStreak < _statisticsData.currentStreak)
            {
                _statisticsData.bestStreak = _statisticsData.currentStreak;
            }
        }
    }
}