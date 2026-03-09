using System;
using System.Collections.Generic;
using Balances.Leaderboard;
using Data.Models;
using Data.Types;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PlayFab;
using PlayFab.ClientModels;
using PlayFab.SharedModels;
using UnityEngine;

namespace Playfab
{
    public class PlayfabApi : IApiInterface
    {
        private const string GameStateKey = "GameState";
        private const string DeleteAccountFunctionName = "deleteAccount";
        private readonly List<Request> _requestsList = new();
        private const string WeeklyStepsStatisticName = "WeeklySteps";
        private const string WeeklyLeagueBotsKey = "weeklyLeagueBots";
        private const string GetBotsFunctionName = "GenerateWeeklyBotsByLeague";

        public string LocalUserPlayFabId { get; set; }

        public void SaveData(GameStateModel gameState, Action onSuccess, Action onError)
        {
            string json = JsonConvert.SerializeObject(gameState);
            UpdateUserDataRequest request = new()
            {
                Data = new Dictionary<string, string> {[GameStateKey] = json},
                Permission = UserDataPermission.Public
            };

            AddRequestToList(new Request(request,
                () =>
                {
                    PlayFabClientAPI.UpdateUserData(request, _ => SuccessRequestHandler(onSuccess),
                        error => ErrorRequestHandler(onError, error.ErrorMessage));
                }));
        }

        public void LoadData(Action<GameStateModel> onSuccess, Action onError)
        {
            LoadData(null, onSuccess, onError);
        }

        public void LoadData(string playFabID, Action<GameStateModel> onSuccess, Action onFailure)
        {
            GetUserDataRequest request = new() {Keys = new List<string> {GameStateKey}, PlayFabId = playFabID};
            AddRequestToList(new Request(request, () =>
            {
                PlayFabClientAPI.GetUserData(request, delegate(GetUserDataResult result)
                {
                    bool tryGetValue = result.Data.TryGetValue(GameStateKey, out UserDataRecord value);
                    SuccessRequestHandler(() =>
                    {
                        GameStateModel gameStateModel = GameStateModel.CreateEmptyGameStateModel();
                        if (tryGetValue && value != null)
                        {
                            try
                            {
                                gameStateModel = JsonConvert.DeserializeObject<GameStateModel>(value.Value);
                            }
                            catch (Exception)
                            {
                                gameStateModel = GameStateModel.CreateEmptyGameStateModel();
                            }
                        }

                        onSuccess?.Invoke(gameStateModel);
                    });
                }, error => ErrorRequestHandler(onFailure, error.ErrorMessage));
            }));
        }

        public void SignInWithApple(string token, Action onSuccess, Action onError)
        {
            LoginWithAppleRequest request = new() {CreateAccount = false, IdentityToken = token,};
            AddRequestToList(new Request(request, () =>
            {
                PlayFabClientAPI.LoginWithApple(request, delegate(LoginResult loginResult)
                {
                    LocalUserPlayFabId = loginResult.PlayFabId;
                    SuccessRequestHandler(onSuccess);
                }, error => ErrorRequestHandler(onError, error.ErrorMessage));
            }));
        }

        public void LinkApple(string token, Action onSuccess, Action onError)
        {
            LinkAppleRequest request = new() {IdentityToken = token, ForceLink = true,};

            if (!PlayFabClientAPI.IsClientLoggedIn())
            {
                onError?.Invoke();
                return;
            }

            AddRequestToList(new Request(request,
                () =>
                {
                    PlayFabClientAPI.LinkApple(request, delegate { SuccessRequestHandler(onSuccess); },
                        error => ErrorRequestHandler(onError, error.ErrorMessage));
                }));
        }

        public void UnlinkApple(Action onSuccess, Action onError)
        {
            UnlinkAppleRequest request = new();

            AddRequestToList(new Request(request,
                () =>
                {
                    PlayFabClientAPI.UnlinkApple(request, delegate { SuccessRequestHandler(onSuccess); },
                        error => ErrorRequestHandler(onError, error.ErrorMessage));
                }));
        }

        public void LoginWithGooglePlay(string code, Action onSuccess, Action onError)
        {
            LoginWithGooglePlayGamesServicesRequest request = new()
            {
                CreateAccount = false, ServerAuthCode = code, TitleId = PlayFabSettings.staticSettings.TitleId,
            };
            AddRequestToList(new Request(request, () =>
            {
                PlayFabClientAPI.LoginWithGooglePlayGamesServices(request, loginResult =>
                {
                    LocalUserPlayFabId = loginResult.PlayFabId;
                    SuccessRequestHandler(onSuccess);
                }, error => ErrorRequestHandler(onError, error.ErrorMessage));
            }));
        }

        public void LinkGooglePlayAccount(string code, Action onSuccess, Action onError)
        {
            LinkGooglePlayGamesServicesAccountRequest request = new() {ForceLink = true, ServerAuthCode = code,};

            if (!PlayFabClientAPI.IsClientLoggedIn())
            {
                onError?.Invoke();
                return;
            }

            AddRequestToList(new Request(request,
                () =>
                {
                    PlayFabClientAPI.LinkGooglePlayGamesServicesAccount(request,
                        delegate { SuccessRequestHandler(onSuccess); },
                        error => ErrorRequestHandler(onError, error.ErrorMessage));
                }));
        }

        public void UnlinkGooglePlayAccount(Action onSuccess, Action onError)
        {
            UnlinkGooglePlayGamesServicesAccountRequest request = new();

            AddRequestToList(new Request(request,
                () =>
                {
                    PlayFabClientAPI.UnlinkGooglePlayGamesServicesAccount(request,
                        delegate { SuccessRequestHandler(onSuccess); },
                        error => ErrorRequestHandler(onError, error.ErrorMessage));
                }));
        }

        public void LoginWithCustomID(string id, Action onSuccess, Action<PlayFabErrorCode> onError)
        {
            LoginWithCustomIDRequest request = new()
            {
                CreateAccount = true,
                CustomId = id,
                InfoRequestParameters = new GetPlayerCombinedInfoRequestParams {GetPlayerProfile = true,}
            };
            AddRequestToList(new Request(request, () =>
            {
                PlayFabClientAPI.LoginWithCustomID(request, delegate(LoginResult loginResult)
                {
                    LocalUserPlayFabId = loginResult.PlayFabId;
                    SuccessRequestHandler(onSuccess);
                }, HandleError);
            }));
            return;

            void HandleError(PlayFabError error)
            {
                onError?.Invoke(error?.Error ?? PlayFabErrorCode.Unknown);
                ErrorRequestHandler(null, error?.ErrorMessage);
            }
        }

        public void DeleteAccount(Action onSuccess, Action onError = null)
        {
            ExecuteCloudScriptRequest request = new()
            {
                FunctionName = DeleteAccountFunctionName, GeneratePlayStreamEvent = true
            };

            ExecuteCloudScript(request, _ =>
            {
                PlayFabClientAPI.ForgetAllCredentials();
                onSuccess?.Invoke();
            }, onError);
        }

        private void ExecuteCloudScript(ExecuteCloudScriptRequest request, Action<ExecuteCloudScriptResult> onSuccess,
            Action onError)
        {
            AddRequestToList(new Request(request, () => PlayFabClientAPI.ExecuteCloudScript(request, result =>
            {
                SuccessRequestHandler(() => onSuccess?.Invoke(result));
                Debug.Log("CloudScript executed: " + result.FunctionResult);
            }, error =>
            {
                ErrorRequestHandler(onError, error.ErrorMessage);
                Debug.LogError("Error calling CloudScript: " + error.ErrorMessage);
            })));
        }

        private void SuccessRequestHandler(Action onSuccess = null)
        {
            onSuccess?.Invoke();
            DeleteExecutedRequestAndSendNext();
        }

        private void ErrorRequestHandler(Action onError, string errorMessage)
        {
            Debug.LogError(errorMessage);
            onError?.Invoke();
            DeleteExecutedRequestAndSendNext();
        }

        public void GetLeaderboards(int dataCount, Action<List<PlayerLeaderboardEntry>> onSuccess, Action onError)
        {
            List<PlayerLeaderboardEntry> leaderboardEntries = new();
            const int step = 100;
            int requestsCounter = 0;
            for (int i = 0; i < dataCount; i += step)
            {
                GetLeaderboardRequest request = new()
                {
                    MaxResultsCount = step,
                    ProfileConstraints = new PlayerProfileViewConstraints {ShowDisplayName = true,},
                    StartPosition = i,
                    StatisticName = WeeklyStepsStatisticName,
                };

                requestsCounter++;
                AddRequestToList(new Request(request, () =>
                {
                    PlayFabClientAPI.GetLeaderboard(request, delegate(GetLeaderboardResult result)
                    {
                        leaderboardEntries.AddRange(result.Leaderboard);
                        requestsCounter--;
                        if (requestsCounter <= 0)
                        {
                            onSuccess?.Invoke(leaderboardEntries);
                        }

                        SuccessRequestHandler();
                    }, error => ErrorRequestHandler(onError, error.ErrorMessage));
                }));
            }
        }

        public void GetBots(LeaderboardBalances leaderboardBalances, DateTime? time,
            Action<Dictionary<LeagueType, List<LeaderboardBotModel>>> onSuccess, Action onError)
        {
            List<LeaguePlayfabModel> leagues = new();
            foreach (LeagueType league in Utils.Utils.GetEnumValues<LeagueType>())
            {
                LeagueBalanceModel balance = leaderboardBalances.GetLeagueBalance(league);
                if (balance == null)
                    continue;
                leagues.Add(new LeaguePlayfabModel
                {
                    type = balance.Type,
                    requiredStepsCount = balance.RequiredStepsCount,
                    visibleTopUsersCount = balance.VisibleTopUsersCount
                });
            }

            ExecuteCloudScriptRequest request = new()
            {
                FunctionName = GetBotsFunctionName,
                FunctionParameter = new {leagues, testTime = time?.ToString("o")},
                GeneratePlayStreamEvent = true
            };

            ExecuteCloudScript(request, result =>
            {
                foreach (LogStatement log in result.Logs)
                {
                    Debug.Log(log.Message);
                }

                string json = result.FunctionResult.ToString();
                JObject root = JObject.Parse(json);
                JToken weeklyBots = root[WeeklyLeagueBotsKey];

                if (weeklyBots == null)
                {
                    ErrorRequestHandler(onError, "CustomFunction returned null result");
                    return;
                }

                Dictionary<LeagueType, List<LeaderboardBotModel>> botsByLeague =
                    weeklyBots.ToObject<Dictionary<LeagueType, List<LeaderboardBotModel>>>();

                foreach (LeagueType league in botsByLeague.Keys)
                {
                    foreach (LeaderboardBotModel bot in botsByLeague[league])
                    {
                        Debug.Log($"League {league}: Bot {bot.name}, Steps {bot.steps}");
                    }
                }

                SuccessRequestHandler(() => onSuccess?.Invoke(botsByLeague));
            }, onError);
        }

        public void SetWeeklyHighScore(int weeklyHighScore, Action onSuccess, Action onError = null)
        {
            PlayFabClientAPI.UpdatePlayerStatistics(
                new UpdatePlayerStatisticsRequest
                {
                    Statistics = new List<StatisticUpdate>
                    {
                        new() {StatisticName = WeeklyStepsStatisticName, Value = weeklyHighScore}
                    }
                }, _ => { SuccessRequestHandler(onSuccess); },
                error => ErrorRequestHandler(onError, error.ErrorMessage));
        }


        public void GetTime(Action<DateTime> onSuccess, Action onError)
        {
            if (!PlayFabClientAPI.IsClientLoggedIn())
            {
                return;
            }

            GetTimeRequest request = new();
            AddRequestToList(new Request(request,
                () =>
                {
                    PlayFabClientAPI.GetTime(request,
                        delegate(GetTimeResult result)
                        {
                            SuccessRequestHandler(() => { onSuccess?.Invoke(result.Time); });
                        }, error => ErrorRequestHandler(onError, error.ErrorMessage));
                }));
        }

        #region RequestQueue

        public void ClearRequestsList()
        {
            _requestsList.Clear();
        }

        private void AddRequestToList(Request request, bool asFirst = false)
        {
            if (_requestsList.Find(r => r.PlayfabRequest == request.PlayfabRequest) != null)
            {
                Debug.LogWarning("Request (" + request.PlayfabRequest + ") is already in list");
                return;
            }

            if (asFirst)
            {
                _requestsList.Insert(0, request);
            }
            else
            {
                _requestsList.Add(request);
            }

            if (_requestsList.Count == 1)
            {
                TryToSendNextRequest();
            }
        }

        private void TryToSendNextRequest()
        {
            if (_requestsList.Count == 0) return;

            _requestsList[0]?.Action?.Invoke();
        }

        private void DeleteExecutedRequestAndSendNext()
        {
            if (_requestsList.Count == 0) return;

            _requestsList.RemoveAt(0);
            TryToSendNextRequest();
        }

        private class Request
        {
            public readonly PlayFabRequestCommon PlayfabRequest;
            public readonly Action Action;

            public Request(PlayFabRequestCommon playfabRequest, Action action)
            {
                PlayfabRequest = playfabRequest;
                Action = action;
            }
        }

        #endregion
    }
}