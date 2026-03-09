using System;
using System.Threading;
using Cysharp.Threading.Tasks;
using UniRx;
using UnityEngine;
using UnityEngine.SceneManagement;
using ThreadPriority = UnityEngine.ThreadPriority;

namespace SceneManagement
{
    public class SceneLoader
    {
        private readonly ReactiveProperty<float> _progress = new();
        public IReadOnlyReactiveProperty<float> LoadingProgress => _progress;

        public async UniTask Load(SceneName sceneName, CancellationToken cancellationToken)
        {
            Application.backgroundLoadingPriority = ThreadPriority.Low;
            await LoadScene(sceneName, cancellationToken);
        }

        private async UniTask LoadScene(SceneName nextScene, CancellationToken cancellationToken)
        {
            if (SceneManager.GetActiveScene().name == nextScene.ToString())
            {
                return;
            }

            AsyncOperation waitNextScene = SceneManager.LoadSceneAsync(nextScene.ToString());
            if (waitNextScene == null)
            {
                throw new NullReferenceException("Load scene async is null");
            }

            IDisposable loadingObserver = Observable.EveryUpdate().Subscribe(_ =>
            {
                _progress.Value = waitNextScene.progress;
            });

            await waitNextScene;
            loadingObserver?.Dispose();
            if (!cancellationToken.IsCancellationRequested)
            {
                _progress.Value = 1f;
            }
        }

        public void SetProgress(float progress)
        {
            _progress.Value = progress;
        }
    }
}