using System;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.ConfirmationPopup
{
    public class ConfirmationPopupView : ScreenView
    {
        [SerializeField] private CustomButton yesButton;
        [SerializeField] private CustomButton noButton;
        [SerializeField] private TextMeshProUGUI mainText;
        [SerializeField] private Button closeOverlayButton;

        public event Action<bool> ClickedButton;

        public void Initialize()
        {
            yesButton.FinishedClicking += () => ClickedButton?.Invoke(true);
            noButton.FinishedClicking += () => ClickedButton?.Invoke(false);
            closeOverlayButton.onClick.AddListener(() => ClickedButton?.Invoke(false));
        }

        public void Configure(string petName)
        {
            mainText.text = string.Format(StringKeys.ConfirmationReplacePopupText, petName);
        }
    }
}