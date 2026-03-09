using System;
using System.Collections.Generic;
using Analytics;
using Assets;
using Data.DataProxy.PlayersPetsDataProxy;
using ScreenNavigationSystem;
using UnityEngine;
using Utils;
using Zenject;

namespace Screens.CollectionScreen
{
    public class CollectionScreenPresenter : ScreenPresenter
    {
        private const int MinimumCollectionItems = 12;
        private const int MaximumCollectionItems = 24;
        private const int ColumnCount = 3;

        [SerializeField] private CollectionScreenView view;

        private readonly List<PetInCollectionView> _pets = new();

        private GameObjectPool<PetInCollectionView> _petsViewsPool;
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
            _petsViewsPool =
                new GameObjectPool<PetInCollectionView>(0, view.PetInCollectionPrefab, view.CollectionPanelsRoot);

            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            DevToDevManager.LogEvent(DevToDevKey.collection_screen_opened);
            UpdateObjectivePanels();
            view.ResetView();
        }

        private void UpdateObjectivePanels()
        {
            _petsViewsPool.Release(_pets);
            _pets.Clear();

            List<PetInCollectionInfo> petsInfo = _playersPetsDataProxy.GetPetsInCollectionInfo();
            int countOfSlots = Math.Max(MinimumCollectionItems, petsInfo.Count);
            countOfSlots = Math.Min(countOfSlots, MaximumCollectionItems);
            for (int i = 0; i < countOfSlots; i++)
            {
                bool isEmptySlot = i >= petsInfo.Count;
                PetInCollectionInfo? petGrave = isEmptySlot ? null : petsInfo[i];
                PetInCollectionView petView = _petsViewsPool.Get();
                bool isMiddleSlot = i % ColumnCount == 1 && countOfSlots - i >= ColumnCount;
                petView.Configure(petGrave, isMiddleSlot, _assetsProvider);
                petView.gameObject.transform.SetAsLastSibling();
                _pets.Add(petView);
            }

            view.SetText(Math.Min(petsInfo.Count, MaximumCollectionItems));
        }
    }
}