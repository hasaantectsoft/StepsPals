using System;
using System.Threading;
using Cysharp.Threading.Tasks;
using DG.Tweening;
using Sounds;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.Shared.Buttons
{
    public class CareActionButton : CustomButton
    {
        private const float PulsingAnimationDuration = 0.4f;
        private const float HintBubbleAnimationDuration = 0.4f;
        private const float HintBubbleAppearingTime = 1.2f;
        private const float AlphaOfIconOnDisabledButton = 0.5f;

        [SerializeField] private bool fadeIconOnDisabled;
        [SerializeField] private Sprite doneActionSprite;
        [SerializeField] private Image icon;
        [SerializeField] private Sprite doneIcon;
        [SerializeField] private Transform hintOnDisabledButton;
        [SerializeField] private TextMeshProUGUI hintText;

        private CancellationTokenSource _cancellationTokenSource;
        private Sprite _defaultIcon;
        private bool _isBlocked;
        private bool _showHintOnDisabled = true;

        public event Action ClickedInactiveButton;

        protected override void Awake()
        {
            base.Awake();
            _defaultIcon = icon.sprite;
        }

        public void Configure()
        {
            SetHintVisible(false);
        }

        public void SetActionState(CareActionState state, string hint, bool showHintOnDisabled)
        {
            buttonBgImage.sprite = state switch
            {
                CareActionState.NotAvailable => graySprite,
                CareActionState.Available => defaultSprite,
                CareActionState.Completed => doneActionSprite,
                _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
            };
            _isBlocked = state is CareActionState.NotAvailable;
            _showHintOnDisabled = showHintOnDisabled;
            hintText.text = hint;
            SetInteractable(!_isBlocked);
            SetActionDone(state is CareActionState.Completed);
        }

        public override void SetInteractable(bool interactable)
        {
            icon.material = interactable ? default : grayscaleMaterial;
            if (fadeIconOnDisabled)
            {
                icon.SetAlpha(interactable ? 1f : AlphaOfIconOnDisabledButton);
            }
        }

        public async UniTask HideHintBubble()
        {
            if (!hintOnDisabledButton.gameObject.activeSelf)
                return;

            KillBubbleAnimation();

            await hintOnDisabledButton.DOScale(0f, HintBubbleAnimationDuration).SetTarget(hintOnDisabledButton)
                .AsyncWaitForCompletion();
            SetHintVisible(false);
        }

        protected override void OnClick()
        {
            if (_isBlocked)
            {
                ClickedInactiveButton?.Invoke();
                if (_showHintOnDisabled)
                {
                    ShowHintAppearingAnimation().Forget();
                }
            }
            else
            {
                ClickWithAnimationWithoutDelay();
            }

            SoundsManager.PlaySound(AudioKey.CustomButtonClickSound);
        }

        private void SetHintVisible(bool visible)
        {
            hintOnDisabledButton.gameObject.SetActive(visible);
        }

        private async UniTask ShowHintAppearingAnimation()
        {
            KillBubbleAnimation();
            hintOnDisabledButton.localScale = Vector3.zero;
            SetHintVisible(true);
            await hintOnDisabledButton.DOScale(1f, HintBubbleAnimationDuration).SetEase(Ease.OutBounce)
                .SetTarget(hintOnDisabledButton).AsyncWaitForCompletion();
            _cancellationTokenSource = new CancellationTokenSource();
            await UniTask.Delay(TimeSpan.FromSeconds(HintBubbleAppearingTime),
                cancellationToken: _cancellationTokenSource.Token);
            HideHintBubble().Forget();
        }

        private void KillBubbleAnimation()
        {
            _cancellationTokenSource?.Cancel();
            _cancellationTokenSource?.Dispose();
            _cancellationTokenSource = null;
            DOTween.Kill(hintOnDisabledButton);
        }

        private void SetActionDone(bool isDone)
        {
            icon.sprite = isDone ? doneIcon : _defaultIcon;
        }

        public void PlayPulsingAnimation(bool play)
        {
            DOTween.Kill(gameObject);
            gameObject.transform.localScale = Vector3.one;
            if (play)
            {
                DOTween.Sequence()
                    .Append(gameObject.transform.DOScale(1.3f, PulsingAnimationDuration).SetEase(Ease.InCubic))
                    .SetLoops(-1, LoopType.Yoyo).SetTarget(gameObject);
            }
        }

        private void OnDestroy()
        {
            KillBubbleAnimation();
        }
    }
}