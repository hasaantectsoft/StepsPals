using System;
using Data.Types;
using DG.Tweening;
using Game.Pets.Animation;
using UnityEngine;
using Utils;

namespace Game.Pets
{
    public class PetView : MonoBehaviour
    {
        [SerializeField] private PetAnimator petAnimator;
        [SerializeField] private GameObject verySickGo;
        [SerializeField] private SpriteRenderer animationPetSprite;
        [SerializeField] private SerializedDictionary<CareActionType, GameObject> careActionsAnimations;
        [SerializeField] private SerializedDictionary<ConditionState, GameObject> conditionsAnimations;
        [SerializeField] private SerializedDictionary<PetMaturity, CareActionsPoints> careActionsPointsByMaturity;
        [SerializeField]
        private SerializedDictionary<PetMaturity, ConditionsAnimationPoints> conditionsPointsByMaturity;

        public event Action<bool> ChangedAnimationState;

        public void Initialize()
        {
            petAnimator.ChangedAnimationState += isInProcess => ChangedAnimationState?.Invoke(isInProcess);
        }

        public void PlayCareActionAnimation(CareActionType actionType)
        {
            switch (actionType)
            {
                case CareActionType.None:
                    break;
                case CareActionType.Feed:
                    petAnimator.SetFeedingTrigger();
                    petAnimator.SetPetFeedingTrigger();
                    break;
                case CareActionType.GiveWater:
                    petAnimator.SetDrinkingTrigger();
                    petAnimator.SetPetFeedingTrigger();
                    break;
                case CareActionType.CleanPoop:
                    petAnimator.SetCleaningPoopTrigger();
                    break;
                case CareActionType.GiveTreat:
                    petAnimator.SetGivingTreatTrigger();
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(actionType), actionType, null);
            }
        }

        public void SetPetFeedingAnimation()
        {
            petAnimator.SetPetFeedingTrigger();
        }

        public void SetConditionAnimation(ConditionState condition, bool isVerySick)
        {
            petAnimator.SetConditionParameter((int)condition);
            verySickGo.SetActive(isVerySick);
            petAnimator.SetIsVerySickParameter(isVerySick);
        }

        public void SetNewMaturityAnimation(PetMaturity maturity)
        {
            petAnimator.SetMaturityParameter((int)maturity);
        }

        public void PlayDyingSpiritAnimation()
        {
            petAnimator.SetDyingTrigger();
        }
        
        public void FadePet(float duration = 0.5f)
        {
            animationPetSprite.DOFade(0f, duration);
        }

        public void ResetAnimationPetSprite()
        {
            animationPetSprite.sprite = null;
        }

        public void SetAnimationEnabled(bool isActive)
        {
            petAnimator.SetAnimationEnabled(isActive);
            animationPetSprite.SetAlpha(isActive ? 1f : 0f);
        }

        public void SetAnimatorControllersByPetType(PetType petType) => petAnimator.SetAnimatorControllersByPetType(petType);

        public void UpdateCareActionAndConditionsAnimations(PetType species, PetMaturity maturity)
        {
            if (maturity == PetMaturity.Egg)
                return;

            foreach ((CareActionType careActionType, GameObject go) in careActionsAnimations.Dictionary)
            {
                go.transform.localPosition = careActionsPointsByMaturity[maturity]
                    .GetPositionOfAnimation(species, careActionType);
            }
            
            foreach ((ConditionState condition, GameObject go) in conditionsAnimations.Dictionary)
            {
                go.transform.localPosition = conditionsPointsByMaturity[maturity]
                    .GetPositionOfAnimation(species, condition);
            }
        }

        public void PlayPuffAnimation() => petAnimator.PlayPuffAnimation();
    }
}