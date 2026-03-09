using System;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using UnityEngine;

namespace Screens.SignOutPopup
{
    public class SignOutPopupView : ScreenView
    {
        [SerializeField] private CustomButton yesButton;
        [SerializeField] private CustomButton noButton;

        [SerializeField] private GameObject loadingOverlay;

        public event Action<bool> ClickedButton;

        public void Initialize()
        {
            yesButton.FinishedClicking += () => ClickedButton?.Invoke(true);
            yesButton.StartedClicking += () => SetOverlayActive(true);
            noButton.FinishedClicking += () => ClickedButton?.Invoke(false);
        }


        public void SetOverlayActive(bool active)
        {
            loadingOverlay.SetActive(active);
        }
    }
}