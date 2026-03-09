using System;
using System.Collections.Generic;
using Balances.Leaderboard;
using Data.Models;
using Data.Types;
using PlayFab;
using PlayFab.ClientModels;

namespace Playfab
{
    public interface IApiInterface
    {
        public string LocalUserPlayFabId { get; set; }
        public void SignInWithApple(string token, Action onSuccess, Action onError);
        public void LinkApple(string token, Action onSuccess, Action onError);
        public void UnlinkApple(Action onSuccess, Action onError);
        void LoginWithGooglePlay(string code, Action onSuccess, Action onError);
        void LinkGooglePlayAccount(string code, Action onSuccess, Action onError);
        void UnlinkGooglePlayAccount(Action onSuccess, Action onError);
        void LoginWithCustomID(string deviceUniqueIdentifier, Action onSuccess, Action<PlayFabErrorCode> onError);
        void LoadData(Action<GameStateModel> onSuccess, Action onError);
        void LoadData(string playFabID, Action<GameStateModel> onSuccess, Action onFailure);
        void SaveData(GameStateModel saveModel, Action onSuccess, Action onError);
        void DeleteAccount(Action onSuccess, Action onError = null);
        void GetLeaderboards(int dataCount, Action<List<PlayerLeaderboardEntry>> onSuccess, Action onError);
        void SetWeeklyHighScore(int weeklyHighScore, Action onSuccess, Action onError = null);
        void GetBots(LeaderboardBalances leaderboardBalances, DateTime? time,
            Action<Dictionary<LeagueType, List<LeaderboardBotModel>>> onSuccess, Action onError);
        void GetTime(Action<DateTime> action, Action onError);
    }
}