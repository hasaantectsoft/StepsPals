using System;
using System.Collections.Generic;
using UniRx;
using Unity.Services.Core;
using UnityEngine;
using UnityEngine.Purchasing;
using UnityEngine.Purchasing.Extension;

namespace Modules.InAppPurchasesProvider
{
    public class IAPProvider : IDetailedStoreListener
    {
        private readonly ReactiveProperty<bool> _isInitialized = new(false);
        private readonly List<Product> _products = new();
        private IStoreController _storeController;
        private IExtensionProvider _storeExtensionProvider;

        public IReadOnlyReactiveProperty<bool> IsInitialized => _isInitialized;

        public event Action<(string sku, string receipt), ProductMetadata> BoughtProduct;
        public event Action PurchaseFailed;
        public event Action<bool> RestoredPurchases;

        public void InitializePurchasing(IEnumerable<string> nonConsumableSku, IEnumerable<string> consumableSku)
        {
            AsyncInitializePurchasing(nonConsumableSku, consumableSku);
        }

        public void OnInitialized(IStoreController controller, IExtensionProvider extensions)
        {
            _storeController = controller;
            _storeExtensionProvider = extensions;
            _products.Clear();
            foreach (Product item in controller.products.all)
            {
                if (!item.availableToPurchase) continue;
                _products.Add(item);
            }

            Debug.Log("InAppPurchasing Initialized!");

            _isInitialized.Value = true;
        }

        public void OnPurchaseFailed(Product product, PurchaseFailureDescription failureDescription)
        {
            Debug.Log($"InAppPurchasing OnPurchaseFailed Product: {product.definition.id}, " +
                      $"PurchaseFailureDescription: {failureDescription}");
            PurchaseFailed?.Invoke();
        }

        public void OnInitializeFailed(InitializationFailureReason error)
        {
            Debug.Log("InAppPurchasing OnInitializeFailed InitializationFailureReason:" + error);
        }

        public void OnInitializeFailed(InitializationFailureReason error, string message)
        {
            Debug.Log("InAppPurchasing OnInitializeFailed InitializationFailureReason:" + error);
        }

        public void Buy(string productId)
        {
            Debug.Log("Try purchase product: " + productId);

            if (!_isInitialized.Value)
            {
                Debug.Log("BuyProductID FAIL. Not initialized.");
                return;
            }

            Product product = _storeController.products.WithID(productId);
            if (product is {availableToPurchase: true})
            {
                Debug.Log($"Purchasing product asynchronously: '{product.definition.id}'");
                _storeController.InitiatePurchase(product);
            }
            else
            {
                Debug.Log("BuyProductID: FAIL. " +
                          "Not purchasing product, either is not found or is not available for purchase");
            }
        }

        public PurchaseProcessingResult ProcessPurchase(PurchaseEventArgs args)
        {
            Debug.Log($"ProcessPurchase: PASS. Product: '{args.purchasedProduct.definition.id}'");
            BoughtProduct?.Invoke((args.purchasedProduct.definition.id, args.purchasedProduct.receipt),
                args.purchasedProduct.metadata);
            return PurchaseProcessingResult.Complete;
        }

        public void OnPurchaseFailed(Product product, PurchaseFailureReason failureReason)
        {
            Debug.Log($"OnPurchaseFailed. Product: '{product.definition.storeSpecificId}'," +
                      $" PurchaseFailureReason: {failureReason}");
            PurchaseFailed?.Invoke();
        }

        public string GetLocalizedProductPrice(string sku)
        {
            foreach (Product product in _products)
            {
                if (product.definition.id == sku)
                {
                    return product.metadata.localizedPriceString;
                }
            }

            return "undefined";
        }

        public decimal GetProductPrice(string sku)
        {
            foreach (Product product in _products)
            {
                if (product.definition.id == sku)
                {
                    return product.metadata.localizedPrice;
                }
            }

            return 0;
        }

        public void RestorePurchases()
        {
            if (!IsInitialized.Value)
            {
                Debug.Log("RestorePurchases FAIL. Not initialized.");
                return;
            }

            if (Application.platform is RuntimePlatform.IPhonePlayer or RuntimePlatform.OSXPlayer)
            {
                _storeExtensionProvider.GetExtension<IAppleExtensions>().RestoreTransactions(OnRestoredTransactions);
            }
            else
            {
                _storeExtensionProvider.GetExtension<IGooglePlayStoreExtensions>()
                    .RestoreTransactions(OnRestoredTransactions);
            }

            return;

            void OnRestoredTransactions(bool result, string error)
            {
                if (result)
                {
                    Debug.Log($"SUBTEST RestorePurchases continuing: {true} . " +
                              $"If no further messages, no purchases available to restore.");
                }
                else
                {
                    Debug.Log($"Restore Failed with error: {error}");
                }

                RestoredPurchases?.Invoke(result);
            }
        }

        public bool IsProductPurchased(string productID)
        {
            foreach (Product product in _products)
            {
                if (product.definition.id == productID)
                {
                    return product.transactionID != null && product.hasReceipt;
                }
            }

            return false;
        }

        private async void AsyncInitializePurchasing(IEnumerable<string> nonConsumableSku,
            IEnumerable<string> consumableSku)
        {
            if (UnityServices.State == ServicesInitializationState.Uninitialized)
            {
                await UnityServices.InitializeAsync();
            }

            if (IsInitialized.Value) return;

            ConfigurationBuilder builder = ConfigurationBuilder.Instance(StandardPurchasingModule.Instance());

            foreach (string productId in nonConsumableSku)
            {
                builder.AddProduct(productId, ProductType.NonConsumable);
            }

            foreach (string productId in consumableSku)
            {
                builder.AddProduct(productId, ProductType.Consumable);
            }

            UnityPurchasing.Initialize(this, builder);
        }
    }
}