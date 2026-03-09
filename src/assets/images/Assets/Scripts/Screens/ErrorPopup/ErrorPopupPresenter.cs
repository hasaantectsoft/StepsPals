using ScreenNavigationSystem;
using UnityEngine;

namespace Screens.ErrorPopup
{
    public class ErrorPopupPresenter : ScreenPresenter
    {
        [SerializeField] private ErrorPopupView view;

        private void Awake()
        {
            view.Initialize();
            view.ClickedCloseButton += CloseScreen;
        }
    }
}