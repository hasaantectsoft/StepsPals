using System;
using System.Threading;
using Analytics;
using Cysharp.Threading.Tasks;
using SceneManagement;
using ScreenNavigationSystem;
using Screens.LoadingScreen;
using UnityEngine;
using Utils.StateMachine.States;

namespace Infrastructure.GameStateMachine.GameStates
{
    public class LoadLevelState : IPayloadedState<SceneName>
    {
        private const float SceneLoadDelay = 0.5f;
        private readonly SceneLoader _sceneLoader;
        private readonly GameStateMachine _gameStateMachine;
        private readonly ScreensController _screensController;
        private CancellationTokenSource _cancellationTokenSource;

        public LoadLevelState(SceneLoader sceneLoader, GameStateMachine gameStateMachine,
            ScreensController screensController)
        {
            _sceneLoader = sceneLoader;
            _gameStateMachine = gameStateMachine;
            _screensController = screensController;
        }

        public void Dispose()
        {
        }

        public async UniTask Enter(SceneName sceneName)
        {
            _cancellationTokenSource = new CancellationTokenSource();
            _sceneLoader.SetProgress(0f);
            _screensController.ExecuteCommand(new NavigationCommand().CloseAllScreens());
            _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<LoadingScreenPresenter>().Global()
                .Animated(false));

            await UniTask.Delay(TimeSpan.FromSeconds(SceneLoadDelay),
                cancellationToken: _cancellationTokenSource.Token);
            await _sceneLoader.Load(sceneName, _cancellationTokenSource.Token);
            OnSceneLoaded(sceneName);
        }

        public void Exit()
        {
            _cancellationTokenSource?.Cancel();
            _cancellationTokenSource?.Dispose();
            _screensController.ExecuteCommand(new NavigationCommand().CloseScreen<LoadingScreenPresenter>());
        }

        private void OnSceneLoaded(SceneName sceneName)
        {
            Debug.Log("Loaded " + sceneName);

            if (sceneName == SceneName.MainScene)
            {
                DevToDevManager.LogEvent(DevToDevKey.main_scene_loaded);
            }

            _gameStateMachine.Enter<GameLoopState>();
        }
    }
}