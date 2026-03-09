using Subscription;

namespace Screens.SubscriptionScreen
{
    public struct SubscriptionScreenViewInfo
    {
        public string Title { get; private set; }
        public string PriceString { get; private set; }
        public string Description { get; private set; }
        public Purchases.Package Package { get; private set; }
        public PackageIdentifier PackageIdentifier { get; private set; }

        public SubscriptionScreenViewInfo(string title, string priceString, string description,
            Purchases.Package package)
        {
            Title = title;
            PriceString = priceString;
            Description = description;
            Package = package;
            PackageIdentifier = PackagesHelper.PackageIdentifiers[package.Identifier];
        }
    }
}