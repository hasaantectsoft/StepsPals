using System;
using Cysharp.Threading.Tasks;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using TMPro;
using UnityEngine;
using Utils;

namespace Screens.NoConnectionPopup
{
    public class NoConnectionPopupView : ScreenView
    {
        [SerializeField] private CloseButton retryButton;
        [SerializeField] private Transform paw;
        [SerializeField] private GameObject loadingOverlay;

        public event Action ClickedRetryButton;

        public void Initialize()
        {
            retryButton.Clicked += () => ClickedRetryButton?.Invoke();
        }

        public void SetOverlayActive(bool active)
        {
            loadingOverlay.SetActive(active);
        }

        public async UniTask PlayPawAnimation()
        {
            await Animations.PlayScaleAnimation(paw);
        }
    }
}