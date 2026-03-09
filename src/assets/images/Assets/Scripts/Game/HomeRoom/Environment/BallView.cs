using DG.Tweening;
using UnityEngine;

namespace Game.HomeRoom.Environment
{
    public class BallView : MonoBehaviour
    {
        [SerializeField] private Transform ballTransform;
        [SerializeField] private Transform ballStartPoint;
        [SerializeField] private Transform ballEndPoint;

        private const float BallMovingAnimationDuration = 3f;
        private const float BallRollingAnimationDuration = 1.2f;
        private const float BallAnimationInterval = 4f;
        private const float TargetRotation = 360f;
        
        private Sequence _ballAnimation;
        private Tween _rotationTween;
        
        private void Awake()
        {
            ballTransform.localPosition = ballStartPoint.localPosition;
        }

        private void OnDestroy()
        {
            _ballAnimation?.Kill();
            _rotationTween?.Kill();
        }

        public void PlayBallBackAndForthRollingAnimation()
        {
            _ballAnimation?.Kill();
            _ballAnimation = DOTween.Sequence()
                .Append(PlayMovingAndRotationAnimation(ballEndPoint.localPosition, -TargetRotation))
                .AppendInterval(BallAnimationInterval)
                .Append(PlayMovingAndRotationAnimation(ballStartPoint.localPosition, TargetRotation))
                .AppendInterval(BallAnimationInterval)
                .SetLoops(-1, LoopType.Restart);
            return;

            Sequence PlayMovingAndRotationAnimation(Vector3 targetPosition, float rotationZ)
            {
                Sequence sequence = DOTween.Sequence();
                sequence.AppendCallback(() =>
                {
                    _rotationTween?.Kill();
                    ballTransform.localRotation = Quaternion.Euler(Vector3.zero);
                    _rotationTween = ballTransform
                        .DOLocalRotate(new Vector3(0f, 0f, rotationZ), BallRollingAnimationDuration, RotateMode.FastBeyond360)
                        .SetLoops(-1)
                        .SetEase(Ease.Linear);
                });

                sequence.Append(ballTransform
                    .DOLocalMove(targetPosition, BallMovingAnimationDuration)
                    .SetEase(Ease.Linear).OnComplete(() => _rotationTween.Kill()));

                return sequence;
            }
        }
    }
}