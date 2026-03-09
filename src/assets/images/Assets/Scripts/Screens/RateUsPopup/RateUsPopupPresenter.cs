using System;
using Managers;
using Plugins.RateUs;
using ScreenNavigationSystem;
using Screens.ReportProblemPopup;
using Zenject;

namespace Screens.RateUsPopup
{
    public class RateUsPopupPresenter : ScreenPresenter
    {
        private RateUsPopupView _view;
        private ScreensController _screensController;
        private RateUsManager _rateUsManager;

        [Inject]
        private void Construct(ScreensController screensController, RateUsManager rateUsManager)
        {
            _rateUsManager = rateUsManager;
            _screensController = screensController;
        }
        
        private void Awake()
        {
            _view = GetComponent<RateUsPopupView>();
            _view.ClickedYesButton += () =>
            {
                _rateUsManager.SetGameRatedByPlayer();
                CloseScreen();
                NativeRateUs.Instance.RateApp();
            };

            _view.ClickedNoButton += () =>
            {
                CloseScreen();
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<ReportProblemPopupPresenter>());
            };
        }
    }
}