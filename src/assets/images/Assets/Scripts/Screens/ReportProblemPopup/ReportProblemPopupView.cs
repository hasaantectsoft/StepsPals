using System;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using UnityEngine;

namespace Screens.ReportProblemPopup
{
    public class ReportProblemPopupView : ScreenView
    {
        [SerializeField] private CustomButton yesButton;
        [SerializeField] private CustomButton noButton;
        
        public event Action ClickedYesButton;
        public event Action ClickedNoButton;
        
        private void Awake()
        {
            yesButton.FinishedClicking += () => ClickedYesButton?.Invoke();
            noButton.FinishedClicking += () => ClickedNoButton?.Invoke();
        }
    }
}