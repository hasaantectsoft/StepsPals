namespace Utils.StateMachine.States
{
    public interface IPreparableState<in TPayload> : ITransitiveState
    {
        void Prepare(TPayload payload);
    }

    public interface IPreparableState<in TPayload1, in TPayload2> : ITransitiveState
    {
        void Prepare(TPayload1 payload1, TPayload2 payload2);
    }

    public interface IPreparableState<in TPayload1, in TPayload2, in TPayload3> : ITransitiveState
    {
        void Prepare(TPayload1 payload1, TPayload2 payload2, TPayload3 payload3);
    }
}