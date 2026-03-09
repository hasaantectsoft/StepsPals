using Data.DataProxy;
using ScreenNavigationSystem;
using ScreenNavigationSystem.TransitionAnimations;
using Screens.TransitionAnimations;
using UniRx;
using UnityEngine;
using Zenject;

namespace Screens
{
    public class OnboardingScreenPresenter : ScreenPresenter
    {
        private const float TransitionAnimationDuration = 0.3f;

        [SerializeField] protected ScreenView view;
        private ScreenOrderDataProxy _screensOrderDataProxy;

        [Inject]
        public void Construct(ScreenOrderDataProxy screensOrderDataProxy)
        {
            _screensOrderDataProxy = screensOrderDataProxy;
        }

        protected void Awake()
        {
            CanvasGroup canvasGroup = view.CanvasGroup;

            IScreenTransitionAnimation leftToFrontTransition =
                new LeftToFrontTransition(canvasGroup, false, TransitionAnimationDuration);
            IScreenTransitionAnimation leftToFrontTransitionReverse =
                new LeftToFrontTransition(canvasGroup, true, TransitionAnimationDuration);
            IScreenTransitionAnimation rightToFrontTransition =
                new RightToFrontTransition(canvasGroup, false, TransitionAnimationDuration);
            IScreenTransitionAnimation rightToFrontTransitionReverse =
                new RightToFrontTransition(canvasGroup, true, TransitionAnimationDuration);

            _screensOrderDataProxy.IsGoingForward.Subscribe(isForward =>
            {
                ShowAnimation = isForward ? rightToFrontTransition : leftToFrontTransition;
                HideAnimation = isForward ? leftToFrontTransitionReverse : rightToFrontTransitionReverse;
            }).AddTo(this);
        }
    }
}