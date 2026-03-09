using System;
using Data.Types;
using UnityEngine;

namespace Balances.Leaderboard
{
    [Serializable]
    public class LeagueBalanceModel
    {
        [SerializeField] private LeagueType type;
        [SerializeField] private int requiredStepsCount;
        [SerializeField] private int visibleTopUsersCount;

        public LeagueType Type => type;
        public int RequiredStepsCount => requiredStepsCount;
        public int VisibleTopUsersCount => visibleTopUsersCount;
    }
}