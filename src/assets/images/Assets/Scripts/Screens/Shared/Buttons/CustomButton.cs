using System;
using Cysharp.Threading.Tasks;
using DG.Tweening;
using Sounds;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.Shared.Buttons
{
    [RequireComponent(typeof(Button))]
    public class CustomButton : MonoBehaviour
    {
        [SerializeField] protected Image buttonBgImage;
        [SerializeField] protected TextMeshProUGUI text;
        [SerializeField] protected Sprite graySprite;
        [SerializeField] protected Sprite defaultSprite;
        [SerializeField] protected Color disabledTextColor;
        [SerializeField] protected Material grayscaleMaterial;

        private const float AnimationDuration = 0.2f;
        private const float ScaleAnimationCoef = 1.15f;

        private Button _button;
        private Transform _transform;
        private Color _defaultTextColor;
        private bool _isClicking;

        private Button Button => _button ??= GetComponent<Button>();

        public event Action FinishedClicking;
        public event Action StartedClicking;

        protected virtual void Awake()
        {
            _transform = transform;
            _defaultTextColor = text?.color ?? disabledTextColor;
            Button.ActionWithThrottle(OnClick);
        }

        public virtual void SetInteractable(bool interactable)
        {
            Button.interactable = interactable;
            if (graySprite)
            {
                buttonBgImage.sprite = interactable ? defaultSprite : graySprite;
            }
            else
            {
                buttonBgImage.material = interactable ? default : grayscaleMaterial;
            }

            if (text)
            {
                text.color = interactable ? _defaultTextColor : disabledTextColor;
            }
        }

        protected virtual void OnClick()
        {
            ClickWithAnimation().Forget();
        }

        protected void ClickWithAnimationWithoutDelay()
        {
            FinishedClicking?.Invoke();
            PlayClickAnimation().Forget();
        }

        private async UniTask ClickWithAnimation()
        {
            if (_isClicking)
            {
                return;
            }

            _isClicking = true;
            StartedClicking?.Invoke();
            await PlayClickAnimation();
            SoundsManager.PlaySound(AudioKey.CustomButtonClickSound);
            FinishedClicking?.Invoke();
            _isClicking = false;
        }

        private async UniTask PlayClickAnimation()
        {
            Vector3 currentScale = _transform.localScale;
            DOTween.Kill(_transform);
            await DOTween.Sequence()
                .Append(_transform.DOScale(new Vector3(ScaleAnimationCoef, ScaleAnimationCoef, currentScale.z),
                    AnimationDuration)).Append(_transform.DOScale(currentScale, AnimationDuration))
                .SetEase(Ease.OutBounce).SetTarget(_transform).AsyncWaitForCompletion();
        }

        private void OnDestroy()
        {
            DOTween.Kill(_transform);
        }
    }
}