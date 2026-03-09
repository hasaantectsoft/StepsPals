using Data.Models;

namespace Data.DataProxy
{
    public interface IDataProxy
    {
        void SetGameState(GameStateModel gameStateModel);
    }
}