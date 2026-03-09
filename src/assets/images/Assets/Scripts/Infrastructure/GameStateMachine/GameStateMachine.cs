using Infrastructure.GameStateMachine.GameStates;
using Installers;
using Utils.StateMachine;
using Zenject;

namespace Infrastructure.GameStateMachine
{
    public class GameStateMachine : StateMachine, IInitializable
    {
        private readonly IProjectContextInstaller _projectContextInstaller;

        public GameStateMachine(IProjectContextInstaller projectContextInstaller)
        {
            _projectContextInstaller = projectContextInstaller;
            
        }

        public void Initialize()
        {
            AddNewState(_projectContextInstaller.Create<BootstrapState>());
            AddNewState(_projectContextInstaller.Create<LoadLevelState>());
            AddNewState(_projectContextInstaller.Create<GameLoopState>());
            Enter<BootstrapState>();
        }
    }
}