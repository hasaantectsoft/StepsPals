using Cysharp.Threading.Tasks;

namespace Utils.StateMachine.States
{
    public interface IState : IExitableState
    {
        UniTask Enter();
    }
}