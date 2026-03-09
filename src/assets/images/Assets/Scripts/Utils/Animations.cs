using Cysharp.Threading.Tasks;
using DG.Tweening;
using UnityEngine;

namespace Utils
{
    public static class Animations
    {
        private const float AnimationDuration = 0.2f;
        private const float ScaleAnimationCoef = 0.8f;

        public static async UniTask PlayScaleAnimation(Transform transform)
        {
            Vector3 currentScale = transform.localScale;
            DOTween.Kill(transform);
            await DOTween.Sequence()
                .Append(transform.DOScale(new Vector3(ScaleAnimationCoef, ScaleAnimationCoef, currentScale.z),
                    AnimationDuration)).Append(transform.DOScale(currentScale, AnimationDuration))
                .SetEase(Ease.OutBounce).SetTarget(transform).AsyncWaitForCompletion();
        }

        public static async UniTask PlayHighlightButtonAnimation(Transform transform)
        {
            Vector3 currentScale = transform.localScale;
            DOTween.Kill(transform);
            await DOTween.Sequence()
                .Append(transform.DOScale(new Vector3(ScaleAnimationCoef, ScaleAnimationCoef, currentScale.z),
                    AnimationDuration)).Append(transform.DOScale(currentScale, AnimationDuration))
                .SetEase(Ease.OutBounce).SetLoops(2).SetTarget(transform).AsyncWaitForCompletion();
        }
    }
}