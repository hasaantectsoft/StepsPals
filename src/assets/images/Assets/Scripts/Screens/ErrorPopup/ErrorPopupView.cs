using System;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using UnityEngine;

namespace Screens.ErrorPopup
{
    public class ErrorPopupView : ScreenView
    {
        [SerializeField] private CloseButton closeButton;

        public event Action ClickedCloseButton;

        public void Initialize()
        {
            closeButton.Clicked += () => ClickedCloseButton?.Invoke();
        }
    }
}