using ScreenNavigationSystem;
using UnityEngine;
using UnityEngine.UI;
using Utils;
using Zenject;

namespace Screens.CheatsPopup
{
    public class ShowCheatsButton : MonoBehaviour
    {
        [SerializeField] private Button button;
        private ScreensController _screensController;

        [Inject]
        public void Construct(ScreensController screensController)
        {
            _screensController = screensController;
        }

        private void Awake()
        {
            button.ActionWithThrottle(() =>
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<CheatsPopupPresenter>()));
        }
    }
}