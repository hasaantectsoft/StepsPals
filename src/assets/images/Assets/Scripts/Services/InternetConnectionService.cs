using System;
using System.Threading;
using Cysharp.Threading.Tasks;
using ScreenNavigationSystem;
using Screens.NoConnectionPopup;
using UnityEngine;
using UnityEngine.Networking;

namespace Services
{
    public class InternetConnectionService
    {
        private const int CheckTimeoutSeconds = 1;
        private readonly ScreensController _screensController;
        private bool _isProcessing;
        private bool _result;

        public event Action RestoredConnection;

        public InternetConnectionService(ScreensController screensController)
        {
            _screensController = screensController;
        }

        public async UniTask<bool> TryShowNoInternetConnection()
        {
            bool isConnected = await CheckInternetConnectionAsync();
            bool isShown = _screensController.IsScreenActive<NoConnectionPopupPresenter>();

            if (!isShown && !isConnected)
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<NoConnectionPopupPresenter>()
                    .Global());

            return isConnected;
        }

        public async UniTask<bool> CheckInternetConnectionAsync(CancellationToken cancellationToken = default)
        {
            if (_isProcessing)
            {
                await UniTask.WaitWhile(IsProcessing, cancellationToken: cancellationToken);
                return _result;
            }

            _isProcessing = true;
            using UnityWebRequest request = UnityWebRequest.Head("https://www.google.com");
            request.timeout = CheckTimeoutSeconds;

            try
            {
                await request.SendWebRequest().WithCancellation(cancellationToken);
                _result = request.result != UnityWebRequest.Result.ConnectionError &&
                          request.result != UnityWebRequest.Result.ProtocolError;
                if (_result)
                {
                    RestoredConnection?.Invoke();
                }
            }
            catch (OperationCanceledException)
            {
                Debug.LogWarning("Internet connection check was canceled.");
                _result = false;
            }
            catch (Exception ex)
            {
                Debug.LogWarning("Error while check internet connection: " + ex.Message);
                _result = false;
            }

            _isProcessing = false;
            return _result;
        }

        private bool IsProcessing() => _isProcessing;
    }
}