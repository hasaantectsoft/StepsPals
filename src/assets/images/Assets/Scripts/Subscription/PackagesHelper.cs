using System.Collections.Generic;

namespace Subscription
{
    public static class PackagesHelper
    {
        public static readonly Dictionary<string, PackageIdentifier> PackageIdentifiers = new()
        {
            {"$rc_annual", PackageIdentifier.Annual},
            {"$rc_monthly", PackageIdentifier.Monthly},
            {"$rc_weekly", PackageIdentifier.Weekly},
        };

        public static readonly Dictionary<PackageIdentifier, string> PackagePriceSuffix = new()
        {
            {PackageIdentifier.Annual, StringKeys.PerYear},
            {PackageIdentifier.Monthly, StringKeys.PerMonth},
            {PackageIdentifier.Weekly, StringKeys.PerWeek},
        };

        public static PackageIdentifier GetPackageByProductsIdentifier(string productId)
        {
            return productId switch
            {
                "com.steppals.subscription.annual.v2" => PackageIdentifier.Annual,
                "com.steppals.subscription.monthly.v2" => PackageIdentifier.Monthly,
                "com.steppals.subscription.weekly.v2" => PackageIdentifier.Weekly,
                _ => PackageIdentifier.None,
            };
        }
    }
}