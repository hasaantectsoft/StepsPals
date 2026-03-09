using System;

namespace Utils.StateMachine.States
{
    public interface IExitableState : IDisposable
    {
        void Exit();
    }
}