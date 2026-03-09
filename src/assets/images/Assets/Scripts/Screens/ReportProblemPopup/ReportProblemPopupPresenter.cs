using Analytics;
using ScreenNavigationSystem;

namespace Screens.ReportProblemPopup
{
    public class ReportProblemPopupPresenter : ScreenPresenter
    {
        private ReportProblemPopupView _view;
        
        private void Awake()
        {
            _view = GetComponent<ReportProblemPopupView>();
            _view.ClickedYesButton += () =>
            {
                Utils.Utils.OpenEmail(GlobalConstants.SupportEmail);
                DevToDevManager.LogEvent(DevToDevKey.email_support);
                CloseScreen();
            };

            _view.ClickedNoButton += CloseScreen;
        }
    }
}