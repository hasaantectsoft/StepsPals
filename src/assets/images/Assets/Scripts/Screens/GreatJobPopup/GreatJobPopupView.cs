using System;
using Cysharp.Threading.Tasks;
using DG.Tweening;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using UnityEngine;
using Utils;

namespace Screens.GreatJobPopup
{
    public class GreatJobPopupView : ScreenView
    {
        [SerializeField] private CloseButton closeButton;
        [SerializeField] private Transform paw;

        public event Action ClickedCloseButton;

        public void Initialize()
        {
            closeButton.Clicked += () => ClickedCloseButton?.Invoke();
        }

        public async UniTask PlayPawAnimation()
        {
            await Animations.PlayScaleAnimation(paw);
        }

        private void OnDestroy()
        {
            DOTween.Kill(paw);
        }
    }
}