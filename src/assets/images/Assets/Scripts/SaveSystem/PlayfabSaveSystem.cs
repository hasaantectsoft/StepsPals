using System;
using Data.Models;
using Playfab;
using UnityEngine;

namespace SaveSystem
{
    public class PlayFabSaveSystem : ISaveSystem
    {
        private readonly IApiInterface _apiInterface;
        private readonly BinarySaveSystem _binarySaveSystem;

        public PlayFabSaveSystem(IApiInterface apiInterface, BinarySaveSystem binarySaveSystem)
        {
            _apiInterface = apiInterface;
            _binarySaveSystem = binarySaveSystem;
        }

        public void RetrieveGameState(Action<GameStateModel> onStateReceived, Action onError = null)
        {
            _apiInterface.LoadData(gameStateModel => { ValidateGameStateFromServer(gameStateModel, onStateReceived); },
                delegate { Debug.Log("Failed to receive save!"); });
        }

        private void ValidateGameStateFromServer(GameStateModel gameStateModel,
            Action<GameStateModel> onValidationPassed)
        {
            if (gameStateModel.playersPets.allPets == null)
            {
                _binarySaveSystem.RetrieveGameState(onValidationPassed);
            }
            else
            {
                onValidationPassed?.Invoke(gameStateModel);
            }
        }

        public void SaveGameState(GameStateModel saveModel)
        {
            _apiInterface.SaveData(saveModel, delegate { Debug.Log("Save successful!"); },
                delegate { Debug.Log("Save failed!"); });
        }
    }
}