using System;
using Analytics;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using Modules.InAppPurchasesProvider;
using UniRx;
using UnityEngine;
using UnityEngine.Purchasing;
using Zenject;

namespace InApps
{
    public class InAppPurchasesController : IInitializable, IDisposable
    {
        private readonly CompositeDisposable _compositeDisposable = new();
        private readonly IAPProvider _iapProvider;
        private readonly MonetizationDataProxy _monetizationDataProxy;
        private readonly PlayersPetsDataProxy _playersPetsDataProxy;

        public event Action FailedPurchase;

        public InAppPurchasesController(MonetizationDataProxy monetizationDataProxy, IAPProvider iapProvider,
            PlayersPetsDataProxy playersPetsDataProxy)
        {
            _monetizationDataProxy = monetizationDataProxy;
            _iapProvider = iapProvider;
            _playersPetsDataProxy = playersPetsDataProxy;
        }

        public void Dispose()
        {
            _compositeDisposable.Dispose();
        }

        public void Initialize()
        {
            Debug.Log("InAppPurchasesController Initialize");
            _iapProvider.BoughtProduct += OnBoughtProduct;
            _iapProvider.PurchaseFailed += OnPurchaseFailed;
            _iapProvider.RestoredPurchases += OnRestoredPurchases;
        }

        private void OnPurchaseFailed()
        {
            FailedPurchase?.Invoke();
        }

        public void BuyOffer(InAppOfferType offerType)
        {
            _iapProvider.Buy(_monetizationDataProxy.GetOfferSku(offerType));
        }

        public string GetLocalizedProductPrice(InAppOfferType offerType) =>
            _iapProvider.GetLocalizedProductPrice(_monetizationDataProxy.GetOfferSku(offerType));

        private void OnBoughtProduct((string sku, string receipt) tuple, ProductMetadata metadata)
        {
            OnValidate(tuple.sku);
        }

        private void OnValidate(string sku)
        {
            InAppOfferType offerType = _monetizationDataProxy.GetOfferType(sku);
            _monetizationDataProxy.OnOfferBought(offerType);
            SendAnalyticsEvent(offerType);
        }

        private void SendAnalyticsEvent(InAppOfferType offerType)
        {
            DevToDevManager.LogEvent(DevToDevKey.in_app_purchase,
                (DevToDevKey.type, DevToDevHelper.InAppKeys[offerType]));
        }

        private void OnRestoredPurchases(bool success)
        {
            if (!success)
            {
                return;
            }

            ActivePetDataProxy activePet = _playersPetsDataProxy.ActivePet.Value;
            if (activePet.Condition.Value == ConditionState.Dead)
            {
                activePet.RevivePet();
            }
        }
    }
}