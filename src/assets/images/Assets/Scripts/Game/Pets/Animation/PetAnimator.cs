using System;
using Data.Types;
using Sounds;
using UnityEngine;
using Utils;

namespace Game.Pets.Animation
{
    public class PetAnimator : MonoBehaviour
    {
        #region Animation Keys

        private static readonly int PuffKey = Animator.StringToHash("Puff");

        private static readonly int FeedingKey = Animator.StringToHash("Feeding");
        private static readonly int DrinkingKey = Animator.StringToHash("Drinking");
        private static readonly int CleaningPoopKey = Animator.StringToHash("CleaningPoop");
        private static readonly int GivingTreatKey = Animator.StringToHash("GivingTreat");

        private static readonly int IsVerySickKey = Animator.StringToHash("IsVerySick");
        private static readonly int DyingKey = Animator.StringToHash("Dying");
        private static readonly int MaturityKey = Animator.StringToHash("Maturity");
        private static readonly int ConditionKey = Animator.StringToHash("Condition");
        private static readonly int PetFeedingAnimationKey = Animator.StringToHash("Feeding");

        #endregion

        [SerializeField] private Animator careActionsAnimator;
        [SerializeField] private Animator conditionsAnimator;
        [SerializeField] private Animator petAnimator;
        [SerializeField] private Animator puffAnimator;

        [SerializeField]
        private SerializedDictionary<PetType, RuntimeAnimatorController> petAnimatorControllersByPetType;

        [SerializeField]
        private SerializedDictionary<PetType, RuntimeAnimatorController> conditionsAnimatorControllersByPetType;

        private CareActionType _triggeredAnimation;

        public event Action<bool> ChangedAnimationState;

        private void OnEnable()
        {
            CaringActionStateBehavior.AnimationStateChanged += HandleAnimation;
        }

        private void OnDisable()
        {
            CaringActionStateBehavior.AnimationStateChanged -= HandleAnimation;
        }

        private void HandleAnimation(bool isInProcess)
        {
            ChangedAnimationState?.Invoke(isInProcess);
        }

        public void SetFeedingTrigger() => careActionsAnimator.SetTrigger(FeedingKey);
        public void SetDrinkingTrigger() => careActionsAnimator.SetTrigger(DrinkingKey);
        public void SetCleaningPoopTrigger() => careActionsAnimator.SetTrigger(CleaningPoopKey);
        public void SetGivingTreatTrigger() => careActionsAnimator.SetTrigger(GivingTreatKey);

        public void SetDyingTrigger() => conditionsAnimator.SetTrigger(DyingKey);
        public void SetIsVerySickParameter(bool isVerySick) => conditionsAnimator.SetBool(IsVerySickKey, isVerySick);
        public void SetMaturityParameter(int maturity) => petAnimator.SetInteger(MaturityKey, maturity);
        public void SetConditionParameter(int condition) => petAnimator.SetInteger(ConditionKey, condition);

        public void SetPetFeedingTrigger()
        {
            petAnimator.SetTrigger(PetFeedingAnimationKey);
            SoundsManager.PlaySound(AudioKey.ChewingTreatSound);
        }

        public void PlayPuffAnimation() => puffAnimator.SetTrigger(PuffKey);

        public void SetAnimationEnabled(bool enable)
        {
            petAnimator.enabled = enable;
            conditionsAnimator.enabled = enable;
        }

        public void SetAnimatorControllersByPetType(PetType petType)
        {
            petAnimator.runtimeAnimatorController = petAnimatorControllersByPetType[petType];
            conditionsAnimator.runtimeAnimatorController = conditionsAnimatorControllersByPetType[petType];
        }
    }
}