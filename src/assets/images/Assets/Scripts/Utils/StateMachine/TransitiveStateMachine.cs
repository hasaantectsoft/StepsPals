using System;
using System.Collections.Generic;
using Utils.StateMachine.States;

namespace Utils.StateMachine
{
    public class TransitiveStateMachine<T> where T : class, ITransitiveState
    {
        private readonly Dictionary<Type, IExitableState> _states = new();
        protected T _activeState;

        public void Enter<TState>() where TState : class, T, ICommonState => ChangeState(GetState<TState>());

        public void Enter<TState, TPayload>(TPayload payload) where TState : class, T, IPreparableState<TPayload>
        {
            TState state = GetState<TState>();
            state.Prepare(payload);
            ChangeState(state);
        }

        public void Enter<TState, TPayload1, TPayload2>(TPayload1 payload1, TPayload2 payload2)
            where TState : class, T, IPreparableState<TPayload1, TPayload2>
        {
            TState state = GetState<TState>();
            state.Prepare(payload1, payload2);
            ChangeState(state);
        }

        public void Enter<TState, TPayload1, TPayload2, TPayload3>(TPayload1 payload1, TPayload2 payload2,
            TPayload3 payload3) where TState : class, T, IPreparableState<TPayload1, TPayload2, TPayload3>
        {
            TState state = GetState<TState>();
            state.Prepare(payload1, payload2, payload3);
            ChangeState(state);
        }

        protected void AddNewState(IExitableState state)
        {
            _states.Add(state.GetType(), state);
        }

        private void ChangeState<TState>(TState state) where TState : T
        {
            if (_activeState != null)
            {
                ITransitiveState result = _activeState.MakeTransition(state);
                if (result == _activeState && !result.CanEnterHimself) return;
                _activeState.Exit();
                _activeState = state;
                _activeState.Enter();
            }
            else
            {
                _activeState = state;
                _activeState.Enter();
            }
        }

        private TState GetState<TState>() where TState : class, T, ITransitiveState =>
            _states[typeof(TState)] as TState;
    }
}