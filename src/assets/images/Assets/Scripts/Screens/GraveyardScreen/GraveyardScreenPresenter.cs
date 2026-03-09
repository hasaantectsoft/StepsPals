using System.Collections.Generic;
using Analytics;
using Assets;
using Data.DataProxy.PlayersPetsDataProxy;
using ModestTree;
using ScreenNavigationSystem;
using Screens.Shared.PetGrave;
using UnityEngine;
using Utils;
using Zenject;

namespace Screens.GraveyardScreen
{
    public class GraveyardScreenPresenter : ScreenPresenter
    {
        [SerializeField] private GraveyardScreenView view;

        private readonly List<PetGraveView> _petGraves = new();

        private GameObjectPool<PetGraveView> _gravesViewPool;
        private PlayersPetsDataProxy _playersPetsDataProxy;
        private AssetsProvider _assetsProvider;

        [Inject]
        public void Construct(PlayersPetsDataProxy playersPetsDataProxy, AssetsProvider assetsProvider)
        {
            _playersPetsDataProxy = playersPetsDataProxy;
            _assetsProvider = assetsProvider;
        }

        private void Awake()
        {
            view.Initialize();
            _gravesViewPool = new GameObjectPool<PetGraveView>(0, view.PetGrabePrefab, view.GravesPanelsRoot);

            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            DevToDevManager.LogEvent(DevToDevKey.graveyard_screen_opened);
            UpdateObjectivePanels();
            view.SetNoPetsTextActive(_petGraves.IsEmpty());
            view.SetEarlyPetsTextActive(!_petGraves.IsEmpty());
        }

        private void UpdateObjectivePanels()
        {
            _gravesViewPool.Release(_petGraves);
            _petGraves.Clear();

            PetGraveViewInfo[] petGravesInfo = _playersPetsDataProxy.GetPetsGravesInfo();

            foreach (PetGraveViewInfo petGrave in petGravesInfo)
            {
                PetGraveView petGraveView = _gravesViewPool.Get();
                petGraveView.Configure(petGrave, _assetsProvider.GetPetGraveSprite(petGrave.PetSpecies));
                _petGraves.Add(petGraveView);
            }
        }
    }
}