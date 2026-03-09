using System;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using UnityEngine;

namespace Screens.TryLoginLaterPopup
{
    public class TryLoginLaterPopupView : ScreenView
    {
        [SerializeField] private CustomButton closeButton;

        public event Action ClickedCloseButton;

        public void Initialize()
        {
            closeButton.FinishedClicking += () => ClickedCloseButton?.Invoke();
        }
    }
}