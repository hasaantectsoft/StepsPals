using ScreenNavigationSystem;
using UnityEngine;

namespace Screens.TryLoginLaterPopup
{
    [RequireComponent(typeof(TryLoginLaterPopupView))]
    public class TryLoginLaterPopupPresenter : ScreenPresenter
    {
        [SerializeField] private TryLoginLaterPopupView view;

        private void Awake()
        {
            view.Initialize();

            view.ClickedCloseButton += OnButtonClicked;
        }

        private void OnButtonClicked()
        {
            Utils.Utils.QuitApp();
        }
    }
}