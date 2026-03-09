using System;
using Assets;
using Cysharp.Threading.Tasks;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Managers;
using Managers.OpenPopupsQueue;
using ScreenNavigationSystem;
using Screens.PetSelectionScreen;
using Subscription;
using UniRx;
using Zenject;

namespace Game.HomeRoom
{
    public class HomeRoomController : IInitializable, IDisposable
    {
        private readonly PlayersPetsDataProxy _playersPetsDataProxy;
        private readonly HomeRoomPresenter _homeRoomPresenter;
        private readonly ScreensController _screensController;
        private readonly AssetsProvider _assetsProvider;
        private readonly PermissionsManager _permissionsManager;
        private readonly CompositeDisposable _compositeDisposable = new();
        private readonly TutorialsDataProxy _tutorialsDataProxy;
        private readonly SubscriptionManager _subscriptionManager;
        private readonly OpenPopupOnLaunchManager _openPopupOnLaunchManager;

        public HomeRoomController(HomeRoomPresenter homeRoomPresenter, PlayersPetsDataProxy playersPetsDataProxy,
            ScreensController screensController, AssetsProvider assetsProvider, PermissionsManager permissionsManager,
            TutorialsDataProxy tutorialsDataProxy, SubscriptionManager subscriptionManager,
            OpenPopupOnLaunchManager openPopupOnLaunchManager)
        {
            _playersPetsDataProxy = playersPetsDataProxy;
            _screensController = screensController;
            _homeRoomPresenter = homeRoomPresenter;
            _assetsProvider = assetsProvider;
            _permissionsManager = permissionsManager;
            _tutorialsDataProxy = tutorialsDataProxy;
            _subscriptionManager = subscriptionManager;
            _openPopupOnLaunchManager = openPopupOnLaunchManager;
        }

        public void Initialize()
        {
            _permissionsManager.TryInitializePermissions();
            _homeRoomPresenter.Initialize(_playersPetsDataProxy, _assetsProvider, _screensController,
                _tutorialsDataProxy);
            _subscriptionManager.CheckSubscription().Forget();
            _playersPetsDataProxy.ActivePet.Where(pet => pet == null).Subscribe(_ =>
            {
                _openPopupOnLaunchManager.ShowScreen<PetSelectionScreenPresenter>(new PetSelectionViewInfo(true),
                    !_tutorialsDataProxy.IsAnyActiveTutorial);
            }).AddTo(_compositeDisposable);
        }

        public void Dispose()
        {
            _compositeDisposable?.Dispose();
        }
    }
}