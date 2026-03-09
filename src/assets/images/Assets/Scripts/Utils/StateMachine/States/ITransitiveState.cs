namespace Utils.StateMachine.States
{
    public interface ITransitiveState : IExitableState
    {
        bool CanEnterHimself { get; }
        ITransitiveState MakeTransition(ITransitiveState state);
        void Enter();
    }
}