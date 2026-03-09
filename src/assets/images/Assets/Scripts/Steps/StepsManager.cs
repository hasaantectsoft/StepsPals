using System;
using Data.DataProxy;
using Data.Types;
using Managers.OpenPopupsQueue;
using Screens.ResultPopup;
using UniRx;
using UnityEngine;
using Zenject;

namespace Steps
{
    public class StepsManager : MonoBehaviour
    {
        [SerializeField] private IOSStepCounter iosStepCounterPrefab;
        [SerializeField] private AndroidStepCounterBase androidStepCounterPrefab;

        private const float UpdateIntervalInSeconds = 10f;
        private const int DaysInWeek = 7;

        private StepCounterBase _stepCounterBaseInstance;
        private HealthStepsDataProxy _healthStepsDataProxy;
        private LeaderboardsDataProxy _leaderboardsDataProxy;
        private TimeDataProxy _timeDataProxy;
        private OpenPopupOnLaunchManager _openPopupOnLaunchManager;
        private readonly CompositeDisposable _authorizationDisposable = new();
        private readonly CompositeDisposable _disposable = new();

        private bool _cheatDataIsOn;
        private bool _isNeedShowResult;

        [Inject]
        private void Construct(HealthStepsDataProxy healthStepsDataProxy, LeaderboardsDataProxy leaderboardsDataProxy,
            TimeDataProxy timeDataProxy, OpenPopupOnLaunchManager openPopupOnLaunchManager)
        {
            _healthStepsDataProxy = healthStepsDataProxy;
            _leaderboardsDataProxy = leaderboardsDataProxy;
            _timeDataProxy = timeDataProxy;
            _openPopupOnLaunchManager = openPopupOnLaunchManager;
            _healthStepsDataProxy.DayChanged += CheckWeeklyRanking;
        }

        public void Initialize()
        {
            _stepCounterBaseInstance = CreateStepCounter();
            Observable.NextFrame().Subscribe(_ =>
            {
                _stepCounterBaseInstance.Authorize(delegate(bool success)
                {
                    Debug.Log($"Authorization: {success}");

                    _authorizationDisposable.Clear();
                    if (success == false) return;
                    ReadStepData();
                    Observable.Interval(TimeSpan.FromSeconds(UpdateIntervalInSeconds)).Subscribe(_ => ReadStepData())
                        .AddTo(_authorizationDisposable);
                });
                _disposable.Clear();
            });

            Observable.Interval(TimeSpan.FromSeconds(1f)).Subscribe(_ => UpdateCurrentDay()).AddTo(_disposable);

            if (_isNeedShowResult)
            {
                OpenWeekResultPopup();
            }
        }

        private StepCounterBase CreateStepCounter()
        {
        #if UNITY_IOS
            return Instantiate(iosStepCounterPrefab, transform);
        #elif UNITY_ANDROID
            return Instantiate(androidStepCounterPrefab, transform);
        #else
            throw new Exception($"[STEPS MANAGER] Unsupported platform: {Application.platform}");
        #endif
        }

        public void SetCheatDataSteps(bool cheatsDataIsOn, int stepsCount)
        {
            _cheatDataIsOn = cheatsDataIsOn;
            if (_cheatDataIsOn)
            {
                _healthStepsDataProxy.SetStepsCount(stepsCount);
                _leaderboardsDataProxy.UpdateWeeklySteps(stepsCount);
            }
        }

        public void SkipDays(int daysCount, bool changeWeek) => _healthStepsDataProxy.SkipDays(daysCount, changeWeek);

        private void GetPreviousWeekSteps(Action<int> onSuccess, Action onError)
        {
            DateTimeOffset currentTime = _timeDataProxy.CurrentTime;
            int daysSinceMonday = ((int)currentTime.DayOfWeek + 6) % DaysInWeek;
            DateTimeOffset startOfPreviousWeek =
                new(currentTime.UtcDateTime.Date.AddDays(-daysSinceMonday - 7), TimeSpan.Zero);
            DateTimeOffset endOfPreviousWeek = startOfPreviousWeek.AddDays(DaysInWeek).AddTicks(-1);
            Debug.Log($"Previous week: {startOfPreviousWeek} - {endOfPreviousWeek}");
            _stepCounterBaseInstance.ReadStepData(startOfPreviousWeek, endOfPreviousWeek,
                stepsCount => { onSuccess?.Invoke(stepsCount); }, onError);
        }

        private void ReadStepData()
        {
            if (_cheatDataIsOn)
                return;
            UpdateCurrentDay();

            DateTimeOffset startTime = _healthStepsDataProxy.CurrentDayMidnight.UtcDateTime;
            DateTimeOffset currentTime = DateTimeOffset.Now.UtcDateTime;
            _stepCounterBaseInstance.ReadStepData(startTime, currentTime, stepsCount =>
            {
                _healthStepsDataProxy.SetStepsCount(stepsCount);
                Debug.Log($"Total steps: {stepsCount}");
            });

            UpdateWeeklyData();
        }

        private void UpdateWeeklyData()
        {
            DateTimeOffset currentTime = _timeDataProxy.CurrentTime;
            int daysSinceMonday = ((int)currentTime.DayOfWeek + 6) % DaysInWeek;
            DateTimeOffset startOfWeek = new(currentTime.UtcDateTime.Date.AddDays(-daysSinceMonday), TimeSpan.Zero);

            _stepCounterBaseInstance.ReadStepData(startOfWeek, currentTime,
                stepsCount => { _leaderboardsDataProxy.UpdateWeeklySteps(stepsCount); });
        }

        private void UpdateCurrentDay()
        {
            _healthStepsDataProxy.SetCurrentDay(DateTimeOffset.Now.Date);
        }

        private void CheckWeeklyRanking(int countOfDays, bool changeWeeks)
        {
            Debug.Log($"Checking weekly ranking: {countOfDays}, changing weeks: {changeWeeks}");
            if (!changeWeeks || countOfDays >= DaysInWeek)
                return;

            _isNeedShowResult = true;
            if (!_stepCounterBaseInstance)
                return;
            OpenWeekResultPopup();
        }

        private void OpenWeekResultPopup()
        {
            if (_cheatDataIsOn)
            {
                OpenResultPopup(_healthStepsDataProxy.StepsCount.Value);
            }
            else
            {
                GetPreviousWeekSteps(OpenResultPopup, () =>
                {
                    Debug.LogError("Weekly ranking result failed");
                    _isNeedShowResult = false;
                });
            }

            return;

            void OpenResultPopup(int stepCount)
            {
                Debug.Log($"OpenResultPopup with previos week steps: {stepCount}");
                _isNeedShowResult = false;
                LeagueType leagueType = _leaderboardsDataProxy.GetLeagueTypeByWeeklySteps(stepCount);
                _openPopupOnLaunchManager.ShowScreen<ResultPopupPresenter>(new ResultPopupInfo(stepCount, leagueType),
                    true, true);
            }
        }
    }
}