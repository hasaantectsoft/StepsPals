using System.Collections.Generic;
using Data.Types;
using UnityEngine;

namespace Balances.Leaderboard
{
    [CreateAssetMenu(fileName = "LeaderboardBalances", menuName = "SO/Balances/Leaderboard Balances")]
    public class LeaderboardBalances : ScriptableObject
    {
        [SerializeField] private List<LeagueBalanceModel> leagueBalances;

        public List<LeagueBalanceModel> LeagueBalances => leagueBalances;

        public LeagueBalanceModel GetLeagueBalance(LeagueType leagueType)
        {
            return leagueBalances.Find(balance => balance.Type == leagueType);
        }
    }
}