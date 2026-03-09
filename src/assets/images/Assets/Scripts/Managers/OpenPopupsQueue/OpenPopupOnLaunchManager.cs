using System;
using System.Collections.Generic;
using System.Linq;
using ScreenNavigationSystem;
using Screens.RateUsPopup;
using Screens.SubscriptionScreen;
using Subscription;
using UnityEngine;
using Utils;

namespace Managers.OpenPopupsQueue
{
    public class OpenPopupOnLaunchManager : IDisposable
    {
        private readonly Queue<PopupInfo> _queueToOpen = new();
        private readonly SubscriptionManager _subscriptionManager;
        private readonly ScreensController _screensController;

        private PopupInfo _currentScreen;
        private bool _isShowing;

        public OpenPopupOnLaunchManager(ScreensController screensController, SubscriptionManager subscriptionManager)
        {
            _screensController = screensController;
            _subscriptionManager = subscriptionManager;
        }

        public void ShowScreen<T>(object data, bool animated = true, bool global = false) where T : ScreenPresenter
        {
            Type screenType = typeof(T);
            if (_queueToOpen.Any(x => x.PopupType == screenType))
            {
                Debug.LogWarning($"Error: {screenType} is already in queue!");
                return;
            }

            _queueToOpen.Enqueue(new PopupInfo(screenType, data, animated, global));
            TryShowNextScreen();
        }

        private void TryShowNextScreen()
        {
            if (_queueToOpen.Count <= 0 || _isShowing)
                return;

            _currentScreen = _queueToOpen.Peek();
            _isShowing = true;
            _subscriptionManager.OpenScreenOnlyAfterSubscriptionScreen(() =>
            {
                NavigationCommand command = new NavigationCommand().Animated(_currentScreen.Animated)
                    .ShowNextScreen(_currentScreen.PopupType).WithExtraData(_currentScreen.Data)
                    .CloseAllScreensExceptThis(typeof(SubscriptionScreenPresenter), typeof(RateUsPopupPresenter))
                    .Global(_currentScreen.Global).Delayed();
                _screensController.ScreenClosing += OnScreenClosed;
                _screensController.ExecuteCommand(command);
            });
        }

        private void OnScreenClosed(Type type)
        {
            if (type != _currentScreen.PopupType)
            {
                return;
            }

            _isShowing = false;
            _queueToOpen.Dequeue();
            _screensController.ScreenClosing -= OnScreenClosed;
            TryShowNextScreen();
        }

        public void Dispose()
        {
            _isShowing = false;
            _screensController.ScreenClosing -= OnScreenClosed;
            _subscriptionManager?.Dispose();
            _screensController?.Dispose();
            _queueToOpen.Clear();
        }
    }
}