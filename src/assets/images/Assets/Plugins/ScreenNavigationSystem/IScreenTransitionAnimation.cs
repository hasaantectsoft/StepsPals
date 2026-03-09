using System;

namespace ScreenNavigationSystem.TransitionAnimations
{
    public interface IScreenTransitionAnimation
    {
        bool IsPlaying { get; }
        void PerformAnimation(Action onEndCallback = null);
        void KillAnim();
    }
}