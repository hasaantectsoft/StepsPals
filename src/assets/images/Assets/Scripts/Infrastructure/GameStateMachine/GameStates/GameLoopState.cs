using Cysharp.Threading.Tasks;
using ScreenNavigationSystem;
using UnityEngine;
using Utils.StateMachine.States;

namespace Infrastructure.GameStateMachine.GameStates
{
    public class GameLoopState : IState
    {
        private readonly ScreensController _screensController;

        public GameLoopState(ScreensController screensController)
        {
            _screensController = screensController;
        }

        public void Dispose()
        {
        }

        public UniTask Enter()
        {
            DynamicGI.UpdateEnvironment();
            return UniTask.CompletedTask;
        }

        public void Exit()
        {
        }
    }
}