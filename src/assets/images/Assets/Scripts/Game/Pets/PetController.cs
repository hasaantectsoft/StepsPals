using Data.DataProxy.PlayersPetsDataProxy;
using Zenject;

namespace Game.Pets
{
    public class PetController : IInitializable
    {
        private readonly PlayersPetsDataProxy _playersPetsDataProxy;
        private readonly PetPresenter _petPresenter;

        public PetController(PetPresenter petPresenter, PlayersPetsDataProxy playersPetsDataProxy)
        {
            _petPresenter = petPresenter;
            _playersPetsDataProxy = playersPetsDataProxy;
        }

        public void Initialize()
        {
            _petPresenter.Initialize(_playersPetsDataProxy);
        }
    }
}