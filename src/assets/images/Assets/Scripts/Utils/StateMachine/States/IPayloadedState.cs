using Cysharp.Threading.Tasks;

namespace Utils.StateMachine.States
{
    public interface IPayloadedState<in TPayload1, in TPayload2> : IExitableState
    {
        UniTask Enter(TPayload1 payload1, TPayload2 payload2);
    }

    public interface IPayloadedState<in TPayload> : IExitableState
    {
        UniTask Enter(TPayload payload);
    }
}