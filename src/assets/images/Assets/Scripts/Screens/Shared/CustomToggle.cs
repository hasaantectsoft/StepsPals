using System;
using Cysharp.Threading.Tasks;
using DG.Tweening;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.Shared
{
    public class CustomToggle : MonoBehaviour
    {
        private const float AnimationDuration = 0.2f;

        [SerializeField] private Slider sliderToAnimate;
        [SerializeField] private Toggle toggle;

        public event Action<bool> ChangedToggleState;

        protected virtual void Awake()
        {
            toggle.onValueChanged.AddListener(isOn => { ChangeStateWithAnimation(isOn).Forget(); });
        }

        public void Configure(bool isOn)
        {
            toggle.SetIsOnWithoutNotify(isOn);
            sliderToAnimate.value = isOn ? 1f : 0f;
        }

        private async UniTask ChangeStateWithAnimation(bool isOn)
        {
            await PlayClickAnimation(isOn);
            ChangedToggleState?.Invoke(isOn);
        }

        private async UniTask PlayClickAnimation(bool isOn)
        {
            DOTween.Kill(sliderToAnimate);
            await sliderToAnimate.DOValue(isOn ? 1f : 0f, AnimationDuration).SetEase(Ease.InOutCubic)
                .SetTarget(sliderToAnimate).AsyncWaitForCompletion();
        }

        private void OnDestroy()
        {
            DOTween.Kill(sliderToAnimate);
        }
    }
}