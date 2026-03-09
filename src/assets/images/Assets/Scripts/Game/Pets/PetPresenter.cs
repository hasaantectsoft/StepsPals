using System;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using Game.Pets.Animation;
using Sounds;
using UniRx;
using UnityEngine;

namespace Game.Pets
{
    [RequireComponent(typeof(PetView))]
    public class PetPresenter : MonoBehaviour, IDisposable
    {
        [SerializeField] private PetView view;
        [SerializeField] private PuffAnimationEventHandler puffBigCloudHandler;
        [SerializeField] private GivingTreatAnimationEventHandler givingTreatHandler;

        private PlayersPetsDataProxy _playersPetsDataProxy;
        private ActivePetDataProxy _activePetDataProxy;

        public void Initialize(PlayersPetsDataProxy playersPetsDataProxy)
        {
            view.Initialize();

            _playersPetsDataProxy = playersPetsDataProxy;
            _playersPetsDataProxy.BuryPet += OnBuryPet;
            puffBigCloudHandler.AppearedBigCloud += UpdateAppearanceOfPet;
            givingTreatHandler.TreatBitten += () => view.SetPetFeedingAnimation();
            _playersPetsDataProxy.ActivePet.Where(pet => pet == null).Subscribe(_ =>
            {
                view.SetAnimationEnabled(false);
                view.ResetAnimationPetSprite();
            }).AddTo(this);
            _playersPetsDataProxy.ActivePet.Where(pet => pet != null).Subscribe(RegisterPet).AddTo(this);

            view.ChangedAnimationState += isAnimationInProcess =>
            {
                _activePetDataProxy.UpdateCareActionAnimationStatus(isAnimationInProcess);
            };
        }

        private void RegisterPet(ActivePetDataProxy pet)
        {
            _activePetDataProxy = pet;
            _activePetDataProxy.LastDoneCareAction.Skip(1).Subscribe(careAction =>
            {
                view.PlayCareActionAnimation(careAction);
            }).AddTo(this);
            _activePetDataProxy.MaturationStage.Subscribe(maturity =>
            {
                view.UpdateCareActionAndConditionsAnimations(_activePetDataProxy.Species, maturity);
            }).AddTo(this);

            UpdateAppearanceOfPet();
            _activePetDataProxy.MaturationStage
                .CombineLatest(_activePetDataProxy.Condition, (maturity, condition) => (maturity, condition)).Skip(1)
                .Subscribe(_ => { view.PlayPuffAnimation(); }).AddTo(this);
        }

        private void UpdateAppearanceOfPet()
        {
            if (_activePetDataProxy.MaturationStage.Value == PetMaturity.Egg)
                return;

            view.SetAnimatorControllersByPetType(_activePetDataProxy.Species);
            view.SetAnimationEnabled(true);
            UpdateConditionOfPet(_activePetDataProxy.Condition.Value);
            UpdateMaturityOfPet(_activePetDataProxy.MaturationStage.Value);
        }

        private void OnBuryPet()
        {
            view.FadePet();
            SoundsManager.PlaySound(AudioKey.FadeOutPetSound);
        }

        private void UpdateConditionOfPet(ConditionState condition)
        {
            view.SetConditionAnimation(condition, condition == ConditionState.VerySick);
            if (condition == ConditionState.Dead)
            {
                view.PlayDyingSpiritAnimation();
            }
        }

        private void UpdateMaturityOfPet(PetMaturity petMaturity)
        {
            view.SetAnimationEnabled(petMaturity != PetMaturity.Egg);
            if (petMaturity == PetMaturity.Egg)
            {
                view.ResetAnimationPetSprite();
            }

            view.SetNewMaturityAnimation(petMaturity);
        }

        public void Dispose()
        {
            _playersPetsDataProxy.BuryPet -= OnBuryPet;
        }
    }
}