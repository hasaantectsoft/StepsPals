namespace Screens.StatisticsScreen
{
    public struct StatisticsViewInfo
    {
        public int BestStreak { get; private set; }
        public int CurrentStreak { get; private set; }
        public int TotalMissedDays { get; private set; }
        public int DeadPetsCount { get; private set; }
        public int FullyGrownPetsCount { get; private set; }

        public StatisticsViewInfo(int bestStreak, int currentStreak, int totalMissedDays, int deadPetsCount,
            int fullyGrownPetsCount)
        {
            BestStreak = bestStreak;
            CurrentStreak = currentStreak;
            TotalMissedDays = totalMissedDays;
            DeadPetsCount = deadPetsCount;
            FullyGrownPetsCount = fullyGrownPetsCount;
        }
    }
}