using System;
using System.Collections.Generic;
using System.Linq;
using Screens.SubscriptionScreen;
using UnityEngine;

namespace Subscription
{
    public class RevenueCatManager : MonoBehaviour
    {
        private const string Entitlement = "subscription";

        [SerializeField] private Purchases purchases;

        public void GetSubscriptionsInfo(Action<List<SubscriptionScreenViewInfo>> successCallback,
            Action<string> errorCallback)
        {
            List<SubscriptionScreenViewInfo> subscriptionInfos = new();
        #if UNITY_EDITOR
            //TODO: create mock data for unity editor
            successCallback?.Invoke(subscriptionInfos);
        #else
            
        #endif
            purchases.GetOfferings((offerings, error) =>
            {
                if (error != null)
                {
                    Debug.LogError("Error fetching offerings: " + error.Message);
                    errorCallback?.Invoke(error.Message);
                    return;
                }

                if (offerings.Current == null)
                {
                    string errorString = "No current offerings";
                    Debug.LogError(errorString);
                    errorCallback?.Invoke(errorString);
                    return;
                }

                foreach (Purchases.Package package in offerings.Current.AvailablePackages)
                {
                    Purchases.StoreProduct product = package.StoreProduct;
                    string title = GetProductTitle(product);
                    subscriptionInfos.Add(new SubscriptionScreenViewInfo(title, product.PriceString,
                        product.Description, package));
                    Debug.Log($"Package ID: {package.Identifier}");
                    Debug.Log($"Price: {product.PriceString}");
                    Debug.Log($"Description: {product.Description}");
                    Debug.Log($"Title: {title}");
                }

                successCallback?.Invoke(subscriptionInfos);
            });
        }

        private static string GetProductTitle(Purchases.StoreProduct product)
        {
            string title = product.Identifier.ToLower();
            if (title.Contains("com.steppals.subscription.premium:annual"))
                return "Annual plan";
            if (title.Contains("com.steppals.subscription.premium:montly"))
                return "Monthly Plan";
            if (title.Contains("com.steppals.subscription.premium:weekly"))
                return "Weekly Plan";
            
            return product.Title;
        }

        public void BeginPurchase(Purchases.Package package, Action successfulCallback, Action<string> errorCallback)
        {
        #if UNITY_EDITOR
            successfulCallback?.Invoke();
        #else
            purchases.PurchasePackage(package, (productIdentifier, customerInfo, userCancelled, error) =>
            {
                if (userCancelled)
                {
                    Debug.Log("User cancelled purchase");
                    errorCallback?.Invoke("User cancelled purchase");
                }
                else
                {
                    if (error != null)
                    {
                        Debug.LogError("Purchase failed: " + error.Message);
                        errorCallback?.Invoke(error.Message);
                        return;
                    }

                    successfulCallback?.Invoke();
                    Debug.Log("User purchased product ID: " + productIdentifier);
                    Debug.Log("Expiration date = " + customerInfo.Entitlements.Active[Entitlement].ExpirationDate);
                }
            });
        #endif
        }

        public void CheckSubscriptionStatus(
            Action<(bool hasActiveSubscription, bool trialUsed, PackageIdentifier packageIdentifier)> successCallback,
            Action<string> errorCallback)
        {
        #if UNITY_EDITOR
            successCallback?.Invoke((hasActiveSubscription: true, trialUsed: false, PackageIdentifier.None));
        #else
            purchases.GetCustomerInfo((customerInfo, error) =>
            {
                if (error == null)
                {
                    string productId = string.Empty;
                    bool isSubscribed = HasSubscription(customerInfo);
                    if (isSubscribed)
                    {
                        Purchases.EntitlementInfo entitlement = customerInfo.Entitlements.Active[Entitlement];
                        productId = entitlement.ProductIdentifier;
                        Debug.Log("Expiration date = " + entitlement.ExpirationDate);
                    }

                    bool hadSubscription = customerInfo.LatestExpirationDate != null;
                    Debug.Log($"User had a subscription before (trial or paid) : {hadSubscription}");

                    successCallback?.Invoke((isSubscribed, hadSubscription,
                        PackagesHelper.GetPackageByProductsIdentifier(productId)));
                }
                else
                {
                    errorCallback?.Invoke(error.Message);
                }
            });
        #endif
        }

        public void RestoreSubscription(Action<bool> successCallback, Action<string> errorCallback)
        {
        #if UNITY_EDITOR
            successCallback?.Invoke(true);
        #else
            purchases.RestorePurchases((customerInfo, error) =>
            {
                if (error != null)
                {
                    Debug.Log("Restore failed: " + error.Message);
                    errorCallback?.Invoke(error.Message);
                }
                else
                {
                    bool isSubscribed = HasSubscription(customerInfo);
                    successCallback?.Invoke(isSubscribed);
                    Debug.Log($"User has an active subscription: {isSubscribed}");
                }
            });
        #endif
        }

        private bool HasSubscription(Purchases.CustomerInfo customerInfo)
        {
            bool isSubscribed = customerInfo.Entitlements.Active.ContainsKey(Entitlement);
            Debug.Log("Is subscribed: " + isSubscribed);
            return isSubscribed;
        }
    }
}