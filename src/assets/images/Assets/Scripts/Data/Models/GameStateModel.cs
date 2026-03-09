using System;
using System.Collections.Generic;
using Data.Models.PlayerPetsModels;
using Data.Types;

namespace Data.Models
{
    [Serializable]
    public class GameStateModel
    {
        public int stateVersion;
        public int lastSeenAt;
        public PlayersPetsModel playersPets;
        public StatisticsModel statistics;
        public bool permissionsGranted;
        public StepsModel steps;
        public Dictionary<TutorialScenarioId, TutorialProgressModel> tutorialsProgress = new();
        public LeaderboardModel leaderboard;
        
        public static GameStateModel CreateEmptyGameStateModel() =>
            new()
            {
                stateVersion = 1,
                lastSeenAt = Utils.Utils.GetCurrentTimeInInteger(DateTime.Now),
                playersPets = new PlayersPetsModel(),
                steps = new StepsModel(),
                statistics = new StatisticsModel(),
                permissionsGranted = false,
                leaderboard = new LeaderboardModel {weeklySteps = 0},
            };
    }
}