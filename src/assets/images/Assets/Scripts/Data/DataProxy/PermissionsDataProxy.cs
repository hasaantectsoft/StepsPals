using Data.Models;
using UniRx;

namespace Data.DataProxy
{
    public class PermissionsDataProxy : IDataProxy
    {
        private readonly ReactiveProperty<bool> _permissionsGranted = new();

        public bool IsPermissionGranted => _permissionsGranted.Value;

        public void SetGameState(GameStateModel gameStateModel)
        {
            _permissionsGranted.Value = gameStateModel.permissionsGranted;
            _permissionsGranted.Subscribe(granted => gameStateModel.permissionsGranted = granted);
        }

        public void GrandPermissions()
        {
            _permissionsGranted.Value = true;
        }
    }
}