namespace Screens.Shared
{
    using DG.Tweening;
    using UnityEngine;

    namespace Screens.Shared
    {
        public class Loader : MonoBehaviour
        {
            [SerializeField] private RectTransform rotatableTransform;
            [SerializeField] private bool autoStart;

            private const float RotationDuration = 1.3f;
            private const float RotateSpeed = 250;

            private void OnEnable()
            {
                if (autoStart)
                {
                    StartAnimation();
                }
            }

            private void OnDisable()
            {
                if (autoStart)
                {
                    StopAnimation();
                }
            }

            private void OnDestroy()
            {
                StopAnimation();
            }

            public void StartAnimation()
            {
                StopAnimation();
                rotatableTransform.DOLocalRotate(new Vector3(0, 0, -360), RotationDuration, RotateMode.FastBeyond360)
                    .SetRelative(true).SetEase(Ease.Linear).SetLoops(-1);
            }

            public void StopAnimation()
            {
                rotatableTransform.DOKill();
            }

            public void RotateLoader()
            {
                rotatableTransform.Rotate(0f, 0f, Time.deltaTime * -RotateSpeed);
            }

            public void ResetRotation()
            {
                StopAnimation();
                rotatableTransform.rotation = Quaternion.identity;
            }
        }
    }
}