using System;
using DG.Tweening;
using DG.Tweening.Core;
using DG.Tweening.Plugins.Options;
using ScreenNavigationSystem.TransitionAnimations;
using UnityEngine;

namespace Screens.TransitionAnimations
{
    public class LeftToFrontTransition : IScreenTransitionAnimation
    {
        private readonly RectTransform _rectTransform;
        private readonly CanvasGroup _canvasGroup;
        private readonly RectTransform _parentRectTransform;
        private readonly bool _reverse;
        private readonly float _duration;
        private Vector2 _oldPos;
        private Vector2 _toPos;
        private TweenerCore<Vector3, Vector3, VectorOptions> _anim;

        public bool IsPlaying => _anim.IsPlaying();

        public LeftToFrontTransition(CanvasGroup canvasGroup, bool reverse, float showDuration = 0.2f)
        {
            _parentRectTransform = canvasGroup.transform.parent.GetComponent<RectTransform>();
            _canvasGroup = canvasGroup;
            _rectTransform = canvasGroup.gameObject.GetComponent<RectTransform>();
            _reverse = reverse;
            _duration = showDuration;
        }

        public void KillAnim()
        {
            if (_anim == null)
            {
                return;
            }

            _anim.Kill();
            _anim = null;
            _rectTransform.position = _toPos;
        }

        public void PerformAnimation(Action onEndCallback = null)
        {
            RecalculateStartAndEndPositions();
            _rectTransform.position = _oldPos;
            _canvasGroup.alpha = 1;

            _anim = _rectTransform.DOMoveX(_toPos.x, _duration).OnComplete(delegate { onEndCallback?.Invoke(); });
        }

        private void RecalculateStartAndEndPositions()
        {
            Vector3 position = _parentRectTransform.position;
            _toPos.y = _oldPos.y = position.y;
            _oldPos.x = position.x * (_reverse ? 1 : -1);
            _toPos.x = position.x * (_reverse ? -1 : 1);
        }
    }
}