using System;
using System.Threading;
using System.Threading.Tasks;
using Cysharp.Threading.Tasks;
using ScreenNavigationSystem;
using Services;
using UnityEngine;
using Zenject;

namespace Screens.NoConnectionPopup
{
    public class NoConnectionPopupPresenter : ScreenPresenter
    {
        private const int AnimationTaskDelay = 2;
        
        [SerializeField] private NoConnectionPopupView view;

        private InternetConnectionService _internetConnectionService;
        private CancellationTokenSource _cancellationTokenSource;

        [Inject]
        public void Construct(InternetConnectionService internetConnectionService)
        {
            _internetConnectionService = internetConnectionService;
        }
        
        private void Awake()
        {
            view.Initialize();
            view.ClickedRetryButton += () => { OnRetryButtonClicked().Forget(); };
            
            OnShowCallback += _ => view.SetOverlayActive(false);
        }

        private async UniTask OnRetryButtonClicked()
        {
            if (_cancellationTokenSource != null)
            {
                _cancellationTokenSource?.Cancel();
                _cancellationTokenSource?.Dispose();
            }
            
            view.SetOverlayActive(true);
            view.PlayPawAnimation().Forget();
            
            _cancellationTokenSource = new CancellationTokenSource();
            UniTask animationTask = UniTask.Delay(TimeSpan.FromSeconds(AnimationTaskDelay), cancellationToken: _cancellationTokenSource.Token);
            UniTask<bool> checkForConnectionTask = _internetConnectionService.CheckInternetConnectionAsync(_cancellationTokenSource.Token);
            Task<bool> checkTask = checkForConnectionTask.AsTask();
            await UniTask.WhenAll(animationTask, checkTask.AsUniTask());
            view.SetOverlayActive(false);
            if (checkTask.Result)
            {
                CloseScreen();
            }
        }
    }
}