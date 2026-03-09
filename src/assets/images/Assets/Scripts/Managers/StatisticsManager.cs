using System;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using UniRx;
using Zenject;

namespace Managers
{
    public class StatisticsManager : IInitializable, IDisposable
    {
        private readonly StatisticsDataProxy _statisticsDataProxy;
        private readonly PlayersPetsDataProxy _playersPetsDataProxy;
        private readonly CompositeDisposable _disposables = new();
        private readonly CompositeDisposable _petDisposables = new();
        private ActivePetDataProxy _activePetDataProxy;

        public StatisticsManager(StatisticsDataProxy statisticsDataProxy, PlayersPetsDataProxy playersPetsDataProxy)
        {
            _statisticsDataProxy = statisticsDataProxy;
            _playersPetsDataProxy = playersPetsDataProxy;
        }

        public void Initialize()
        {
            _playersPetsDataProxy.CreatedPet += OnPetCreated;
            _playersPetsDataProxy.ActivePet.Where(pet => pet != null).Subscribe(RegisterPet).AddTo(_disposables);
        }

        private void OnPetCreated(bool afterDeath)
        {
            if (afterDeath)
            {
                _statisticsDataProxy.UpdateStatisticsOnPetBuried();
            }
        }

        private void RegisterPet(ActivePetDataProxy pet)
        {
            _activePetDataProxy = pet;

            _petDisposables.Clear();
            _activePetDataProxy.MaturationStage.Skip(1).Where(maturity => maturity == PetMaturity.Adult)
                .Subscribe(_ => _statisticsDataProxy.UpdateFullyGrownPetsStatistics()).AddTo(_petDisposables);
            _activePetDataProxy.MissedDays.Skip(1).Where(missedDays => missedDays > 0)
                .Subscribe(_ => _statisticsDataProxy.UpdateTotalMissedDays()).AddTo(_petDisposables);
            _activePetDataProxy.LastDoneCareAction.Skip(1)
                .Where(lastDoneCareAction => lastDoneCareAction == CareActionType.GiveTreat)
                .Subscribe(_ => _statisticsDataProxy.UpdateStreak()).AddTo(_petDisposables);
        }

        public void Dispose()
        {
            _disposables.Clear();
            _petDisposables.Clear();
        }
    }
}