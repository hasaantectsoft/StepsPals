using System;
using System.Globalization;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using Screens.Shared.PetGrave;
using TMPro;
using UnityEngine;
using Utils;

namespace Screens.DeathPopup
{
    public class DeathPopupView : ScreenView
    {
        [SerializeField] private CustomButton reviveButton;
        [SerializeField] private CustomButton startOverButton;
        [SerializeField] private PetGravePresenter petGravePresenter;
        [SerializeField] private TextMeshProUGUI mainText;
        [SerializeField] private TextMeshProUGUI reviveButtonText;
        [SerializeField] private GameObject loadingOverlay;

        public event Action ClickedReviveButton;
        public event Action ClickedStartOverButton;

        public void Initialize()
        {
            reviveButton.StartedClicking += () => ClickedReviveButton?.Invoke();
            startOverButton.StartedClicking += () => ClickedStartOverButton?.Invoke();
        }

        public void Configure(PetGraveViewInfo info, string revivePrice)
        {
            petGravePresenter.Configure(info);
            reviveButtonText.text = string.Format(StringKeys.ReviveInAppButtonText,
                revivePrice.ToString(CultureInfo.InvariantCulture));
            mainText.text = string.Format(StringKeys.DeathPopupText,
                ColorUtility.ToHtmlStringRGBA(ColorsStorage.PetNameDeathPopupText), info.PetName);
        }

        public void ShowLoadingOverlay(bool show)
        {
            loadingOverlay.SetActive(show);
        }
    }
}