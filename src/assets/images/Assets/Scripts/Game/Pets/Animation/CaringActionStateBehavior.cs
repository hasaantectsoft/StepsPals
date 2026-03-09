using System;
using UnityEngine;

namespace Game.Pets.Animation
{
    public class CaringActionStateBehavior : StateMachineBehaviour
    {
        public static event Action<bool> AnimationStateChanged;

        public override void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
        {
            AnimationStateChanged?.Invoke(true);
        }

        public override void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
        {
            AnimationStateChanged?.Invoke(false);
        }
    }
}