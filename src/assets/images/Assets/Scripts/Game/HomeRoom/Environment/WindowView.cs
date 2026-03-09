using DG.Tweening;
using UnityEngine;

namespace Game.HomeRoom.Environment
{
    public class WindowView : MonoBehaviour
    {
        [SerializeField] private Transform cloudTransform;
        [SerializeField] private Transform cloudStartPoint;
        [SerializeField] private Transform cloudEndPoint;

        private const float CloudMovingAnimationDuration = 4f;
        private const float CloudFloatingAnimationDuration = 0.8f;
        private const float CloudAnimationInterval = 2f;
        private const float FloatingPositionOffset = 0.3f;

        private Sequence _cloudAnimation;
        private Tween _floatingTween;

        private void Awake()
        {
            SetCloudBasePosition();
        }

        private void OnDestroy()
        {
            _cloudAnimation?.Kill();
            _floatingTween?.Kill();
        }

        public void PlayCloudAnimation()
        {
            _cloudAnimation?.Kill();
            _cloudAnimation = DOTween.Sequence()
                .AppendCallback(() =>
                {
                    SetCloudBasePosition();

                    _floatingTween = cloudTransform
                        .DOLocalMoveY(cloudTransform.localPosition.y + FloatingPositionOffset, CloudFloatingAnimationDuration)
                        .SetEase(Ease.Linear)
                        .SetLoops(-1, LoopType.Yoyo);
                })
                .Append(cloudTransform.DOLocalMoveX(cloudEndPoint.localPosition.x, CloudMovingAnimationDuration)
                    .SetEase(Ease.Linear)
                    .OnComplete(() => _floatingTween.Kill()))
                .AppendInterval(CloudAnimationInterval)
                .SetLoops(-1, LoopType.Restart);
        }
        
        private void SetCloudBasePosition() => cloudTransform.localPosition = cloudStartPoint.localPosition;
    }
}