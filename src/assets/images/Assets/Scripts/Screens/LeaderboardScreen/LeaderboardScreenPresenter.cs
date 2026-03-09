using System;
using System.Collections.Generic;
using System.Linq;
using Data.DataProxy;
using Data.Types;
using ScreenNavigationSystem;
using UniRx;
using UnityEngine;
using Utils;
using Zenject;

namespace Screens.LeaderboardScreen
{
    public class LeaderboardScreenPresenter : ScreenPresenter
    {
        [SerializeField] private LeaderboardScreenView view;

        private readonly List<LeaderboardUserPanelView> _userPanels = new();
        private LeaderboardsDataProxy _leaderboardsDataProxy;
        private TimeDataProxy _timeDataProxy;
        private GameObjectPool<LeaderboardUserPanelView> _usersPanelsPool;
        private IDisposable _interval;

        [Inject]
        public void Construct(LeaderboardsDataProxy leaderboardsDataProxy, TimeDataProxy timeDataProxy)
        {
            _leaderboardsDataProxy = leaderboardsDataProxy;
            _timeDataProxy = timeDataProxy;
        }

        private void Awake()
        {
            view.Initialize();
            _usersPanelsPool =
                new GameObjectPool<LeaderboardUserPanelView>(0, view.UserPanelPrefab, view.LeaguesPanelsRoot);

            foreach ((LeagueType leagueType, LeaderboardLeaguePanelView panel) in view.LeaguePanels.Dictionary)
            {
                panel.Configure(leagueType);
            }

            OnShowCallback += OnShow;

            OnHideCallback += delegate
            {
                _usersPanelsPool.Release(_userPanels);
                _userPanels.Clear();
            };
        }

        private void OnShow(object data)
        {
            view.ResetView();
            OnLeaderboardFetched();
            UpdateTimer();
            _interval?.Dispose();
            _interval = null;
            _interval = Observable.Interval(TimeSpan.FromSeconds(1)).Subscribe(delegate { UpdateTimer(); });
        }

        private void UpdateTimer()
        {
            DateTime now = _timeDataProxy.CurrentTime;
            int daysUntilSunday = ((int)DayOfWeek.Sunday - (int)now.DayOfWeek + 7) % 7;
            DateTime endOfWeek = now.Date.AddDays(daysUntilSunday + 1);
            TimeSpan timeLeft = endOfWeek - now;
            view.SetTimerText(timeLeft);
        }

        private void OnLeaderboardFetched()
        {
            foreach ((LeagueType leagueType, LeaderboardLeaguePanelView panelView) in view.LeaguePanels.Dictionary)
            {
                List<UserPanelInfo> userPanelInfos =
                    _leaderboardsDataProxy.GetUserPanelInfosForLeague(leagueType).ToList();
                panelView.gameObject.SetActive(userPanelInfos.Count > 0);
                panelView.transform.SetAsLastSibling();
                Transform parent = panelView.transform;
                int index = 0;
                foreach (UserPanelInfo userPanelInfo in userPanelInfos)
                {
                    index++;
                    UserPanelInfo info = userPanelInfo;
                    info.Parent = parent;
                    LeaderboardUserPanelView userPanel = _usersPanelsPool.Get();
                    userPanel.Configure(info, index);
                    _userPanels.Add(userPanel);
                }
            }
        }
    }
}