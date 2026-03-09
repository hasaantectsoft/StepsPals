using System;
using System.Linq;
using Analytics;
using Balances;
using Data.Helpers;
using Data.Models.PlayerPetsModels;
using Data.Types;
using Sounds;
using UniRx;
using UnityEngine;

namespace Data.DataProxy.PlayersPetsDataProxy
{
    public class ActivePetDataProxy
    {
        private readonly PlayerPetModel _petData;
        private readonly GameBalances _gameBalances;

        private readonly Subject<bool> _animationState = new();

        #region ReactiveProperties

        private readonly ReactiveProperty<PetMaturity> _maturationStage = new(PetMaturity.Egg);
        private readonly ReactiveProperty<int> _age = new(0);
        private readonly ReactiveProperty<int> _growthDay = new(0);
        private readonly ReactiveProperty<int> _missedDays = new(0);
        private readonly ReactiveProperty<ConditionState> _condition = new(ConditionState.Healthy);
        private readonly ReactiveProperty<CareActionType> _lastDoneCareAction = new(CareActionType.None);
        private readonly ReactiveProperty<bool> _successApplied = new();

        private readonly Subject<PetMaturity> _petMaturated = new();

        public IReadOnlyReactiveProperty<PetMaturity> MaturationStage => _maturationStage;
        public IReadOnlyReactiveProperty<int> Age => _age;
        public IReadOnlyReactiveProperty<int> GrowthDay => _growthDay;
        public IReadOnlyReactiveProperty<int> MissedDays => _missedDays;
        public IReadOnlyReactiveProperty<ConditionState> Condition => _condition;
        public IReadOnlyReactiveProperty<CareActionType> LastDoneCareAction => _lastDoneCareAction;
        public IObservable<PetMaturity> PetMaturated => _petMaturated;

        #endregion

        public bool AllCareActionsDone =>
            _lastDoneCareAction.Value == Utils.Utils.GetEnumValues<CareActionType>().Last();

        public event Action OnFirstTapOnEgg;

        public IObservable<(bool isOn, CareActionType careActionType)> AnimationState =>
            _animationState.StartWith(false).CombineLatest(_lastDoneCareAction, (isOn, care) => (isOn, care));

        public string Name => _petData.name;
        public PetType Species => _petData.petType;
        public DateTime Birthday => _petData.birthday;
        public DateTime? DeathDay => _petData.deathDay;
        public bool IsInCollection => _petData.inCollection;

        public ActivePetDataProxy(PlayerPetModel petData, GameBalances gameBalances)
        {
            _petData = petData;
            _gameBalances = gameBalances;

            _maturationStage.Value = _petData.maturity;
            _age.Value = _petData.age;
            _growthDay.Value = _petData.growthDay;
            _condition.Value = _petData.condition;
            _missedDays.Value = _petData.missedDays;
            _lastDoneCareAction.Value = _petData.lastDoneCareAction;
            _successApplied.Value = _petData.successDayApplied;

            _age.Subscribe(age => _petData.age = age);
            _growthDay.Subscribe(growthDay => _petData.growthDay = growthDay);
            _maturationStage.Subscribe(maturity => _petData.maturity = maturity);
            _condition.Subscribe(condition => _petData.condition = condition);
            _missedDays.Subscribe(missedDays => _petData.missedDays = missedDays);
            _lastDoneCareAction.Subscribe(lastCareAction => _petData.lastDoneCareAction = lastCareAction);
            _successApplied.Subscribe(successApplied => _petData.successDayApplied = successApplied);
        }

        public void RevivePet()
        {
            SoundsManager.PlaySound(AudioKey.ReviveSound);
            _petData.deathDay = null;
            _petData.inCollection = _petData.maturity == PetMaturity.Adult;
            EndDaySuccessfullyAndTryMaturate(false);
        }

        public bool EndDaySuccessfullyAndTryMaturate(bool growPet = true)
        {
            if (_successApplied.Value)
                return false;

            _missedDays.Value = 0;
            SetCondition(ConditionState.Healthy);
            _successApplied.Value = true;
            Debug.Log($"Pet missed days = {_missedDays.Value}");
            if (growPet)
            {
                return GrowPetAndTryMaturate();
            }

            return false;
        }

        public ConditionState EndPetFailDay(int missedDays)
        {
            AddMissedDays(missedDays);
            ConditionState condition = ConditionState.Healthy;
            if (missedDays > 0)
            {
                condition = ContentHelper.GetConditionStateByMissedDays(_missedDays.Value);
                SetCondition(condition);
            }

            Debug.Log($"Pet missed days = {_missedDays.Value}");
            return condition;
        }


        private void SetCondition(ConditionState condition)
        {
            _condition.Value = condition;
            Debug.Log($"Pet condition is {_condition.Value}");

            if (_condition.Value == ConditionState.Dead)
            {
                _petData.deathDay = DateTimeOffset.Now.Date;
                _petData.inCollection = false;
            }
        }

        public bool GrowPetAndTryMaturate(int growDays = 1)
        {
            Debug.Log($"Pet is growing");
            _growthDay.Value += growDays;
            if (_maturationStage.Value == PetMaturity.Adult)
            {
                return false;
            }

            if (_growthDay.Value < GetDaysToMature())
            {
                return false;
            }

            MaturatePet();
            return true;
        }

        public void AddAge(int passedDays) => _age.Value += passedDays;

        public void AddMissedDays(int missedDays) => _missedDays.Value += missedDays;

        public void TakeCareOfPet(CareActionType careActionType)
        {
            _lastDoneCareAction.Value = careActionType;
        }

        public void ResetCareActions()
        {
            _lastDoneCareAction.Value = CareActionType.None;
            _successApplied.Value = false;
        }

        public int GetDaysToMature()
        {
            if (_maturationStage.Value == PetMaturity.Adult)
                return 0;

            PetMaturity nextMaturityStage = Utils.Utils.GetNextValue(_maturationStage.Value);
            return _gameBalances.GrowthDaysToMature[nextMaturityStage];
        }

        public void MaturatePet()
        {
            PetMaturity newMaturityState = Utils.Utils.GetNextValue(_maturationStage.Value);
            if (_maturationStage.Value != PetMaturity.Egg)
            {
                DevToDevManager.LogEvent(DevToDevKey.pet_evolve,
                    (DevToDevKey.state_from, DevToDevHelper.PetMaturityKeys[_maturationStage.Value]),
                    (DevToDevKey.state_to, DevToDevHelper.PetMaturityKeys[newMaturityState]));
            }

            _maturationStage.Value = newMaturityState;
            _petMaturated.OnNext(_maturationStage.Value);

            Debug.Log($"Pet matured to {_maturationStage.Value}");
        }

        public void ResetMaturity()
        {
            _maturationStage.Value = PetMaturity.Egg;
        }

        public void UpdateCareActionAnimationStatus(bool isOn)
        {
            _animationState.OnNext(isOn);
        }

        public void FirstTapOnEgg()
        {
            OnFirstTapOnEgg?.Invoke();
        }

        public void AddToCollection()
        {
            _petData.inCollection = true;
        }
    }
}