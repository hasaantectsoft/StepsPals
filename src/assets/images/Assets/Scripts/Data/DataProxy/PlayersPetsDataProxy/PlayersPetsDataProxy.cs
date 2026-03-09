using System;
using System.Collections.Generic;
using System.Linq;
using Analytics;
using Balances;
using Data.Models;
using Data.Models.PlayerPetsModels;
using Data.Types;
using ModestTree;
using Screens.CollectionScreen;
using Screens.Shared.PetGrave;
using UniRx;

namespace Data.DataProxy.PlayersPetsDataProxy
{
    public class PlayersPetsDataProxy : IDataProxy
    {
        private const int GraveyardSize = 30;
        private const int CollectionSize = 24;

        private readonly GameBalances _gameBalances;
        private readonly ReactiveProperty<ActivePetDataProxy> _activePet = new();
        private readonly ReactiveProperty<int> _stepGoalCount = new();
        private PlayersPetsModel _playersPetsModel;
        private bool _petDead;

        public IReadOnlyReactiveProperty<ActivePetDataProxy> ActivePet => _activePet;
        public IReadOnlyReactiveProperty<int> StepGoalCount => _stepGoalCount;

        public int NewStepGoalForNextDay => _playersPetsModel.newStepGoalForNextDay;

        public bool IsNewStepGoalPending =>
            _playersPetsModel.newStepGoalForNextDay != 0 &&
            _stepGoalCount.Value != _playersPetsModel.newStepGoalForNextDay;

        public event Action BuryPet;
        public event Action<bool> CreatedPet;

        public PlayersPetsDataProxy(GameBalances gameBalances)
        {
            _gameBalances = gameBalances;
        }

        public void SetGameState(GameStateModel gameStateModel)
        {
            gameStateModel.playersPets ??= new PlayersPetsModel();
            _playersPetsModel = gameStateModel.playersPets;

            _stepGoalCount.Value = _playersPetsModel.stepsGoalCount;
            _playersPetsModel.allPets ??= new List<PlayerPetModel>();

            if (!_playersPetsModel.allPets.IsEmpty())
            {
                _activePet.Value = new ActivePetDataProxy(_playersPetsModel.allPets[^1], _gameBalances);
            }

            _stepGoalCount.Subscribe(stepGoal => _playersPetsModel.stepsGoalCount = stepGoal);
        }

        public void CreateNewPet(PetType petType, string name, int stepsGoal)
        {
            PlayerPetModel newPet = CreateDefaultPetModel(petType, name);
            _stepGoalCount.Value = stepsGoal;
            _playersPetsModel.newStepGoalForNextDay = stepsGoal;
            _activePet.Value = new ActivePetDataProxy(newPet, _gameBalances);
            _playersPetsModel.allPets.Add(newPet);

            CreatedPet?.Invoke(_petDead);
            _petDead = false;
            DevToDevManager.LogEvent(DevToDevKey.pet_born,
                (DevToDevKey.species, DevToDevHelper.PetSpeciesKeys[petType]),
                (DevToDevKey.is_restart, _playersPetsModel.allPets.Count > 1));
        }

        public void SetNewStepGoalForNextDay(int newStepGoal)
        {
            _playersPetsModel.newStepGoalForNextDay = newStepGoal;
        }

        public void TryChangeStepGoal()
        {
            if (IsNewStepGoalPending)
            {
                _stepGoalCount.Value = _playersPetsModel.newStepGoalForNextDay;
            }
        }

        public void BuryDeadActivePet()
        {
            BuryPet?.Invoke();
            _petDead = true;
        }

        public void RemoveActivePet()
        {
            _activePet.Value = null;
            RemoveOldPets();
        }

        public PetGraveViewInfo[] GetPetsGravesInfo()
        {
            List<PetGraveViewInfo> gravesInfo = new();
            for (int index = _playersPetsModel.allPets.Count - 1; index >= 0; index--)
            {
                PlayerPetModel petModel = _playersPetsModel.allPets[index];
                if (petModel.deathDay == null)
                    continue;

                gravesInfo.Add(new PetGraveViewInfo(petModel.name, petModel.petType, petModel.birthday,
                    petModel.deathDay ?? DateTime.Now.Date));

                if (gravesInfo.Count >= GraveyardSize)
                    return gravesInfo.ToArray();
            }

            return gravesInfo.ToArray();
        }

        public List<PetInCollectionInfo> GetPetsInCollectionInfo()
        {
            List<PetInCollectionInfo> petsInfo = new();
            foreach (PlayerPetModel petModel in _playersPetsModel.allPets)
            {
                if (IsPetInCollection(petModel))
                {
                    petsInfo.Add(new PetInCollectionInfo(petModel.name, petModel.petType, petModel.birthday));
                }
            }

            return petsInfo;
        }

        private static PlayerPetModel CreateDefaultPetModel(PetType petType, string name) =>
            new()
            {
                petType = petType,
                name = name,
                maturity = PetMaturity.Egg,
                age = 0,
                condition = ConditionState.Healthy,
                birthday = DateTime.Now.Date,
            };

        public string GetOldestPetNameInCollection()
        {
            foreach (PlayerPetModel petModel in _playersPetsModel.allPets)
            {
                if (petModel.inCollection)
                {
                    return petModel.name;
                }
            }

            return null;
        }

        public bool TryAddActivePetToCollection()
        {
            if (_playersPetsModel.allPets.Count(pet => pet.inCollection) >= CollectionSize)
            {
                return false;
            }

            AddActivePetToCollection(false);
            return true;
        }

        public void AddActivePetToCollection(bool replace)
        {
            _activePet.Value.AddToCollection();

            if (replace)
            {
                RemoveOldPets();
            }
        }

        private void RemoveOldPets()
        {
            int deadPets = _playersPetsModel.allPets.Count(pet => pet.deathDay != null);
            int inCollection = _playersPetsModel.allPets.Count(pet => pet.inCollection);
            for (int index = 0; index < _playersPetsModel.allPets.Count; index++)
            {
                PlayerPetModel petModel = _playersPetsModel.allPets[index];
                bool isDeadPet = petModel.deathDay != null;
                bool isInCollection = IsPetInCollection(petModel);

                bool remove = (isDeadPet && deadPets > GraveyardSize) ||
                              (isInCollection && inCollection > CollectionSize) || (!isDeadPet && !isInCollection &&
                                  (deadPets > GraveyardSize || inCollection > CollectionSize));

                if (!remove)
                    continue;

                _playersPetsModel.allPets.RemoveAt(index);

                if (isDeadPet)
                {
                    deadPets--;
                }

                if (isInCollection)
                {
                    inCollection--;
                }
            }
        }

        private bool IsPetInCollection(PlayerPetModel petModel) =>
            petModel.inCollection || (_playersPetsModel.allPets[^1] == petModel &&
                                      petModel.maturity == PetMaturity.Adult &&
                                      petModel.condition != ConditionState.Dead);
    }
}