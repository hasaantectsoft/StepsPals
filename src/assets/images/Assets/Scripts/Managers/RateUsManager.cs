using System;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using ScreenNavigationSystem;
using Screens.RateUsPopup;
using UniRx;
using Utils;
using Zenject;

namespace Managers
{
    public class RateUsManager
    {
        private readonly ScreensController _screensController;

        public RateUsManager(ScreensController screensController)
        {
            _screensController = screensController;
        }

        public void SetGameRatedByPlayer() => PlayerPrefsHelper.IsGameRatedByPlayer = true;

        public void TryShowRateUsPopup(bool isPetMatured)
        {
            if (PlayerPrefsHelper.IsGameRatedByPlayer) return;
            if (PlayerPrefsHelper.IsDayEndSuccessfulRateUsCalled == false || isPetMatured)
            {
                PlayerPrefsHelper.IsDayEndSuccessfulRateUsCalled = true;
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<RateUsPopupPresenter>().Delayed());
            }
        }
    }
}