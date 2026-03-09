using System;
using Data.Models;

namespace SaveSystem
{
    public interface ISaveSystem
    {
        void SaveGameState(GameStateModel gameStateModel);
        void RetrieveGameState(Action<GameStateModel> onSuccess, Action onError);
    }
}