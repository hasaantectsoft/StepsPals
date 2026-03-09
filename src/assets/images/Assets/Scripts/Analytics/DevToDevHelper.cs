using System.Collections.Generic;
using Data.Types;
using InApps;
using Subscription;

namespace Analytics
{
    public static class DevToDevHelper
    {
        public static readonly Dictionary<CareActionType, string> CareActionsKeys = new()
        {
            {CareActionType.Feed, DevToDevKey.feed.ToString()},
            {CareActionType.GiveWater, DevToDevKey.water.ToString()},
            {CareActionType.CleanPoop, DevToDevKey.clean.ToString()},
            {CareActionType.GiveTreat, DevToDevKey.treat.ToString()},
        };

        public static readonly Dictionary<PetMaturity, string> PetMaturityKeys = new()
        {
            {PetMaturity.Baby, DevToDevKey.baby.ToString()},
            {PetMaturity.Teen, DevToDevKey.teen.ToString()},
            {PetMaturity.Adult, DevToDevKey.adult.ToString()},
        };

        public static readonly Dictionary<ConditionState, string> PetConditionsKeys = new()
        {
            {ConditionState.Healthy, DevToDevKey.healthy.ToString()},
            {ConditionState.Sick, DevToDevKey.sick.ToString()},
            {ConditionState.VerySick, DevToDevKey.very_sick.ToString()},
            {ConditionState.Dead, DevToDevKey.dead.ToString()},
        };

        public static readonly Dictionary<PetType, string> PetSpeciesKeys = new()
        {
            {PetType.Dog, DevToDevKey.dog.ToString()},
            {PetType.Cat, DevToDevKey.cat.ToString()},
            {PetType.Dino, DevToDevKey.dino.ToString()},
        };

        public static readonly Dictionary<InAppOfferType, string> InAppKeys = new()
        {
            {InAppOfferType.RevivePet, DevToDevKey.revive_5.ToString()},
        };

        public static readonly Dictionary<PackageIdentifier, string> SubscriptionPlans = new()
        {
            {PackageIdentifier.Annual, DevToDevKey.annual.ToString()},
            {PackageIdentifier.Monthly, DevToDevKey.monthly.ToString()},
            {PackageIdentifier.Weekly, DevToDevKey.weekly.ToString()},
            {PackageIdentifier.None, DevToDevKey.none.ToString()},
        };
    }
}