using System;
using Cysharp.Threading.Tasks;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using TMPro;
using UnityEngine;
using Utils;

namespace Screens.WelcomePopup
{
    public class WelcomePopupView : ScreenView
    {
        [SerializeField] private CloseButton closeButton;
        [SerializeField] private Transform paw;
        [SerializeField] private TextMeshProUGUI mainText;
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private SerializedDictionary<bool, GameObject> popupsBackgrounds;

        public event Action ClickedCloseButton;

        public void Initialize()
        {
            closeButton.Clicked += () => ClickedCloseButton?.Invoke();
        }

        public void Configure(bool isTrial)
        {
            foreach ((bool trial, GameObject go) in popupsBackgrounds.Dictionary)
            {
                go.SetActive(isTrial == trial);
            }

            titleText.text = isTrial ? StringKeys.WelcomeFreeTrialTitle : StringKeys.WelcomeBackTitle;
            mainText.text = isTrial ? StringKeys.WelcomeFreeTrialText : StringKeys.WelcomeText;
        }

        public async UniTask PlayPawAnimation()
        {
            await Animations.PlayScaleAnimation(paw);
        }
    }
}