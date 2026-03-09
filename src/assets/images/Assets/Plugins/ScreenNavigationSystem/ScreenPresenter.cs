using System;
using ScreenNavigationSystem.TransitionAnimations;
using UnityEngine;
#if SNS_WITH_UNIRX
    using UniRx;
#endif

namespace ScreenNavigationSystem
{
    [RequireComponent(typeof(UILayerConfigurator))]
    public abstract class ScreenPresenter : MonoBehaviour
    {
        private Action _onCloseAction;
        private float _inactiveTimer;
        private UILayerConfigurator _uiLayerConfigurator;
        private ScreenView _screenView;

    #if SNS_WITH_UNIRX
        private readonly ReactiveProperty<bool> _isOnFocus = new();
        private readonly Subject<object> _onShowCallback = new();
        private readonly Subject<bool> _onHideCallback = new();
        public ISubject<object> OnShowCallback => _onShowCallback;
        public ISubject<bool> OnHideCallback => _onHideCallback;
        protected IReadOnlyReactiveProperty<bool> IsOnFocus => _isOnFocus;
    #else
        public event Action<object> OnShowCallback;
        public event Action OnHideCallback;
        public event Action<bool> OnFocusCallback;

        public bool IsOnFocus { get; private set; }
    #endif
        public IScreenTransitionAnimation ShowAnimation { get; protected set; }
        public IScreenTransitionAnimation HideAnimation { get; protected set; }

        public bool ShouldDeleteAfterHide => ScreenView.ShouldDeleteAfterHide;
        public int OrderLayer => UILayerConfigurator.OrderLayer;
        private CanvasGroup CanvasGroup => ScreenView.CanvasGroup;
        private UILayerConfigurator UILayerConfigurator => _uiLayerConfigurator ??= GetComponent<UILayerConfigurator>();
        private ScreenView ScreenView => _screenView ??= GetComponent<ScreenView>();

        public void PrepareScreen(Action closeAction)
        {
            _onCloseAction = closeAction;
            SetScreenVisible(false);
        }

        public void ShowOnPosition(object extraData)
        {
            ShowAnimation?.KillAnim();
            InvokeShowWith(extraData);
            GotFocus();
        }

        public void DeactivateScreen()
        {
        #if SNS_WITH_UNIRX
        _onHideCallback?.OnNext(true);
        #else
            OnHideCallback?.Invoke();
        #endif

        #if SNS_LOGS
            Debug.Log("SNS | ScreenDeactivate: " + name);
        #endif
            SetScreenVisible(false);
            gameObject.SetActive(false);
            LostFocus();
        }

        public void GotFocus()
        {
        #if SNS_WITH_UNIRX
        if (_isOnFocus.Value)
            {
                return;
            }
        #else
            if (IsOnFocus)
            {
                return;
            }
        #endif

            SetScreenVisible(true);
            UILayerConfigurator.BackToDefaultOrder();
        #if SNS_LOGS
            Debug.Log("SNS | ScreenGotFocus: " + name);
        #endif
        #if SNS_WITH_UNIRX
        _isOnFocus.Value = true;
        #else
            IsOnFocus = true;
            OnFocusCallback?.Invoke(IsOnFocus);
        #endif
        }

        public void LostFocus()
        {
        #if SNS_WITH_UNIRX
        if (!_isOnFocus.Value)
            {
                return;
            }
        #else
            if (!IsOnFocus)
            {
                return;
            }
        #endif

            CanvasGroup.blocksRaycasts = false;
        #if SNS_LOGS
            Debug.Log("SNS | ScreenLostFocus: " + name);
        #endif
        #if SNS_WITH_UNIRX
        _isOnFocus.Value = false;
        #else
            IsOnFocus = false;
            OnFocusCallback?.Invoke(IsOnFocus);
        #endif
        }

        public void PerformHideAnimation(Action callback)
        {
            ShowAnimation?.KillAnim();
            UILayerConfigurator.SetHideAnimatingOrder();
            HideAnimation?.PerformAnimation(delegate { callback?.Invoke(); });
        }

        public void PerformShowAnimationWhenReady(Action callback)
        {
            UILayerConfigurator.SetShowAnimatingOrder();
            HideAnimation?.KillAnim();
            ShowAnimation?.PerformAnimation(delegate
            {
                GotFocus();
                callback();
            });
        }

        public void InvokeShowWith(object extraData)
        {
        #if SNS_LOGS
            Debug.Log("SNS | ScreenActivate: " + name);
        #endif
            gameObject.SetActive(true);

        #if SNS_WITH_UNIRX
            _onShowCallback?.OnNext(extraData);
        #else
            OnShowCallback?.Invoke(extraData);
        #endif
        }

        public void LayUnderScreen(int shift = 1)
        {
            UILayerConfigurator.SetDefaultLayer(shift);
        }

        protected void CloseScreen()
        {
            _onCloseAction.Invoke();
        }

        private void SetScreenVisible(bool visible)
        {
            CanvasGroup.blocksRaycasts = visible;
            CanvasGroup.alpha = Convert.ToInt32(visible);
        }
    }
}