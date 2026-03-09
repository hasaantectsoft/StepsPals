using System;
using System.Collections.Generic;
using System.Linq;
using Balances.Leaderboard;
using Builder_TestMode;
using Data.Models;
using Data.Types;
using Playfab;
using PlayFab.ClientModels;
using Screens.LeaderboardScreen;
using UnityEngine;

namespace Data.DataProxy
{
    public class LeaderboardsDataProxy : IDataProxy
    {
        private readonly IApiInterface _apiInterface;
        private readonly LeaderboardBalances _leaderboardBalance;
        private List<UserPanelInfo> _userPanelInfos = new();
        private GameStateModel _gameStateModel;
        private LeaderboardModel _leaderboardModel;
        private Dictionary<LeagueType, List<LeaderboardBotModel>> _savedBots;

        public LeaderboardsDataProxy(IApiInterface apiInterface, LeaderboardBalances leaderboardBalances)
        {
            _apiInterface = apiInterface;
            _leaderboardBalance = leaderboardBalances;
        }

        public void FetchLeaderboards(Action onSuccess, Action onFailure)
        {
            _userPanelInfos.Clear();
            _apiInterface.GetLeaderboards(100, delegate(List<PlayerLeaderboardEntry> leaderboardEntries)
            {
                if (_savedBots == null)
                {
                    DateTime? time = BuildSettingsSO.IsTestMode ? DateTime.Now.ToUniversalTime() : null;
                    _apiInterface.GetBots(_leaderboardBalance, time, bots =>
                    {
                        _savedBots = bots;
                        HandleLeaderboardUsers(onSuccess, onFailure, leaderboardEntries);
                    }, onFailure);
                }
                else
                {
                    HandleLeaderboardUsers(onSuccess, onFailure, leaderboardEntries);
                }
            }, delegate { onFailure?.Invoke(); });
        }

        private void HandleLeaderboardUsers(Action onSuccess, Action onFailure,
            List<PlayerLeaderboardEntry> leaderboardEntries)
        {
            Debug.Log("Fetched leaderboards | " + leaderboardEntries.Count);
            List<LeagueBalanceModel> leagueBalanceModels = _leaderboardBalance.LeagueBalances;
            int requestsCount = 0;
            for (int index = 0; index < leagueBalanceModels.Count; index++)
            {
                LeagueBalanceModel leagueBalance = leagueBalanceModels[index];
                List<PlayerLeaderboardEntry> playerLeaderboardEntries = new();
                bool isFirstLeague = index >= _leaderboardBalance.LeagueBalances.Count - 1;
                foreach (PlayerLeaderboardEntry entry in leaderboardEntries)
                {
                    if (entry.StatValue >= leagueBalance.RequiredStepsCount && (isFirstLeague ||
                            entry.StatValue < leagueBalanceModels[index + 1].RequiredStepsCount))
                    {
                        playerLeaderboardEntries.Add(entry);
                    }
                }

                int usersToLoad = Mathf.Min(playerLeaderboardEntries.Count, leagueBalance.VisibleTopUsersCount);
                for (int i = 0; i < usersToLoad; i++)
                {
                    requestsCount++;
                    PlayerLeaderboardEntry entry = playerLeaderboardEntries[i];
                    _apiInterface.LoadData(entry.PlayFabId, gameStateModel =>
                    {
                        Debug.Log("Loaded data | " + entry.PlayFabId);
                        bool isLocalUser = _apiInterface.LocalUserPlayFabId == entry.PlayFabId;
                        string activePetName = gameStateModel.playersPets.allPets[^1].name;
                        _userPanelInfos.Add(new UserPanelInfo(activePetName, entry.StatValue, isLocalUser));
                        requestsCount--;
                        CheckIfAllUsersFetched(requestsCount);
                    }, delegate { onFailure?.Invoke(); });
                }

                if (leagueBalance.VisibleTopUsersCount > usersToLoad)
                {
                    SaveBotData(leagueBalance, usersToLoad);
                }
            }

            CheckIfAllUsersFetched(requestsCount);

            return;

            void CheckIfAllUsersFetched(int leftRequestsCount)
            {
                if (leftRequestsCount > 0)
                {
                    return;
                }

                _userPanelInfos = _userPanelInfos.OrderByDescending(info => info.Steps).ToList();
                onSuccess?.Invoke();
            }

            void SaveBotData(LeagueBalanceModel leagueBalance, int playerLeaderboardEntriesCount)
            {
                for (int i = 0; i < leagueBalance.VisibleTopUsersCount - playerLeaderboardEntriesCount; i++)
                {
                    if (!_savedBots.TryGetValue(leagueBalance.Type, out List<LeaderboardBotModel> bots) ||
                        i >= bots.Count)
                    {
                        continue;
                    }

                    LeaderboardBotModel bot = bots[i];
                    _userPanelInfos.Add(new UserPanelInfo(bot.name, bot.steps, false));
                }
            }
        }

        public IEnumerable<UserPanelInfo> GetUserPanelInfosForLeague(LeagueType leagueType)
        {
            LeagueBalanceModel leagueBalance = _leaderboardBalance.GetLeagueBalance(leagueType);
            List<LeagueBalanceModel> leagueBalanceModels = _leaderboardBalance.LeagueBalances;
            int index = leagueBalanceModels.IndexOf(leagueBalance);
            bool isFirstLeague = index >= _leaderboardBalance.LeagueBalances.Count - 1;
            foreach (UserPanelInfo info in _userPanelInfos)
            {
                if (info.Steps >= leagueBalance.RequiredStepsCount &&
                    (isFirstLeague || info.Steps < leagueBalanceModels[index + 1].RequiredStepsCount))
                    yield return info;
            }
        }

        public void SetGameState(GameStateModel data)
        {
            _gameStateModel = data;
            _leaderboardModel = _gameStateModel.leaderboard ?? new LeaderboardModel {weeklySteps = 0};
        }

        public void UpdateWeeklySteps(int steps)
        {
            _leaderboardModel.weeklySteps = steps;
            _apiInterface.SetWeeklyHighScore(_leaderboardModel.weeklySteps, null);
            Debug.Log($"WEEKLY total steps: {steps}");
        }

        public LeagueType GetLeagueTypeByWeeklySteps(int weeklySteps)
        {
            List<LeagueBalanceModel> leagueBalanceModels = _leaderboardBalance.LeagueBalances;
            for (int index = 0; index < leagueBalanceModels.Count; index++)
            {
                bool isFirstLeague = index >= _leaderboardBalance.LeagueBalances.Count - 1;
                LeagueBalanceModel leagueBalance = leagueBalanceModels[index];
                if (weeklySteps >= leagueBalance.RequiredStepsCount &&
                    (isFirstLeague || weeklySteps < leagueBalanceModels[index + 1].RequiredStepsCount))
                {
                    return leagueBalance.Type;
                }
            }

            return LeagueType.Unranked;
        }
    }
}