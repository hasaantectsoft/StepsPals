using System;
using Analytics;
using Cysharp.Threading.Tasks;
using Data.DataProxy;
using ScreenNavigationSystem;
using Screens.GraveyardScreen;
using Screens.LeaderboardScreen;
using Screens.SettingsScreen;
using Screens.StatisticsScreen;
using Screens.SubscriptionScreen;
using UnityEngine;
using Zenject;

namespace Screens.Shared.NavigationBar
{
    public class NavigationBarPresenter : MonoBehaviour
    {
        [SerializeField] private NavigateBarView view;

        private ScreensController _screensController;
        private LeaderboardsDataProxy _leaderboardsDataProxy;

        [Inject]
        private void Construct(ScreensController screensController, LeaderboardsDataProxy leaderboardsData)
        {
            _screensController = screensController;
            _leaderboardsDataProxy = leaderboardsData;
        }

        public void Initialize(NavigationButtonType openedNavigation)
        {
            view.Initialize(openedNavigation);
            view.SetOverlayActiveAboveNavigationBar(false);
            view.ClickedNavigationButton += OnNavigationButtonClicked;
        }

        public async UniTask HighlightButton(NavigationButtonType navigationButtonType)
        {
            await view.HighlightButton(navigationButtonType);
        }

        public void SetOverlayAboveNavigationBar(bool overlayActive)
        {
            view.SetOverlayActiveAboveNavigationBar(overlayActive);
        }

        private void OnNavigationButtonClicked(NavigationButtonType type)
        {
            if (IsSubscriptionScreensActive())
                return;

            switch (type)
            {
                case NavigationButtonType.Home:
                    _screensController.ExecuteCommand(new NavigationCommand().CloseCurrentScreen());
                    DevToDevManager.LogEvent(DevToDevKey.home_screen_opened);
                    break;
                case NavigationButtonType.Statistics:
                    _screensController.ExecuteCommand(new NavigationCommand().CloseCurrentScreen());
                    _screensController.ExecuteCommand(
                        new NavigationCommand().ShowNextScreen<StatisticsScreenPresenter>());
                    break;
                case NavigationButtonType.Graveyard:
                    _screensController.ExecuteCommand(new NavigationCommand().CloseCurrentScreen());
                    _screensController.ExecuteCommand(
                        new NavigationCommand().ShowNextScreen<GraveyardScreenPresenter>());
                    break;
                case NavigationButtonType.Settings:
                    _screensController.ExecuteCommand(new NavigationCommand().CloseCurrentScreen());
                    _screensController.ExecuteCommand(new NavigationCommand()
                        .ShowNextScreen<SettingsScreenPresenter>());
                    break;
                case NavigationButtonType.Leaderboard:
                    OpenLeaderboard();
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(type), type, null);
            }
        }

        private void OpenLeaderboard()
        {
            view.SetLoaderActive(true);
            _leaderboardsDataProxy.FetchLeaderboards(delegate
            {
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<LeaderboardScreenPresenter>()
                    .CloseCurrentScreen());
                view.SetLoaderActive(false);
            }, delegate
            {
                Debug.LogError("Failed to fetch leaderboards");
                view.SetLoaderActive(false);
            });
        }

        private bool IsSubscriptionScreensActive() =>
            _screensController.IsScreenActive<SubscriptionScreenPresenter>() &&
            _screensController.IsSomeScreenActiveNow;
    }
}