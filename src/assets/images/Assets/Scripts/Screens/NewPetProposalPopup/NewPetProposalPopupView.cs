using System;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.NewPetProposalPopup
{
    public class NewPetProposalPopupView : ScreenView
    {
        [SerializeField] private CustomButton yesButton;
        [SerializeField] private CustomButton noButton;
        [SerializeField] private Button closeOverlayButton;

        public event Action<bool> ClickedButton;

        public void Initialize()
        {
            yesButton.FinishedClicking += () => ClickedButton?.Invoke(true);
            noButton.FinishedClicking += () => ClickedButton?.Invoke(false);
            closeOverlayButton.onClick.AddListener(() => ClickedButton?.Invoke(false));
        }
    }
}