using System;
using ScreenNavigationSystem;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.CheatsPopup
{
    public class CheatsPopupView : ScreenView
    {
        [SerializeField] private Button rewriteStepsButton;
        [SerializeField] private Button cancelRewriteStepsButton;
        [SerializeField] private Button closeButton;
        [SerializeField] private TMP_InputField stepsInputField;
        [SerializeField] private TMP_InputField skipDaysInputField;
        [SerializeField] private Button skipDaysButton;
        [SerializeField] private Button revivePetButton;
        [SerializeField] private Button doAllCareActionsPetButton;
        [SerializeField] private Button maturatePetButton;
        [SerializeField] private Toggle changeWeeksToggle;

        public event Action ClickedRewriteStepsButton;
        public event Action ClickedCloseButton;
        public event Action ClickedCancelRewriteStepsButton;
        public event Action<int> ChangedStepsValue;
        public event Action<int> ChangedSkipDaysValue;
        public event Action<bool> ClickedSkipDaysButton;
        public event Action ClickedRevivePetButton;
        public event Action ClickedDoAllCareActionsButton;
        public event Action ClickedMaturatePetButton;

        public void Initialize()
        {
            stepsInputField.ConfigureIntegerInputField(result => ChangedStepsValue?.Invoke(result));
            skipDaysInputField.ConfigureIntegerInputField(result => ChangedSkipDaysValue?.Invoke(result));
            rewriteStepsButton.ActionWithThrottle(() => ClickedRewriteStepsButton?.Invoke());
            cancelRewriteStepsButton.ActionWithThrottle(() => ClickedCancelRewriteStepsButton?.Invoke());
            closeButton.ActionWithThrottle(() => ClickedCloseButton?.Invoke());
            skipDaysButton.ActionWithThrottle(() => ClickedSkipDaysButton?.Invoke(changeWeeksToggle.isOn));
            revivePetButton.ActionWithThrottle(() => ClickedRevivePetButton?.Invoke());
            doAllCareActionsPetButton.ActionWithThrottle(() => ClickedDoAllCareActionsButton?.Invoke());
            maturatePetButton.ActionWithThrottle(() => ClickedMaturatePetButton?.Invoke());
        }
    }
}