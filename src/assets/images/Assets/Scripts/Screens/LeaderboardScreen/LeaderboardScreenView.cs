using System;
using Data.Types;
using ScreenNavigationSystem;
using Screens.Shared.NavigationBar;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.LeaderboardScreen
{
    public class LeaderboardScreenView : ScreenView
    {
        [field: SerializeField] public Transform LeaguesPanelsRoot { get; private set; }
        [field: SerializeField] public LeaderboardUserPanelView UserPanelPrefab { get; private set; }

        [field: SerializeField]
        public SerializedDictionary<LeagueType, LeaderboardLeaguePanelView> LeaguePanels { get; private set; }

        [SerializeField] private GameObject loaderGo;
        [SerializeField] private TextMeshProUGUI timerText;
        [SerializeField] private NavigationBarPresenter navigationBarPresenter;
        [SerializeField] private ScrollRect scrollRect;

        public void Initialize()
        {
            navigationBarPresenter.Initialize(NavigationButtonType.Leaderboard);
        }

        public void ResetView()
        {
            scrollRect.verticalNormalizedPosition = 1;
        }

        public void SetTimerText(TimeSpan leftTime)
        {
            string formattedTime = $"{leftTime.Days}d {leftTime.Hours:D2}:{leftTime.Minutes:D2}:{leftTime.Seconds:D2}";
            timerText.text = formattedTime;
        }
    }
}