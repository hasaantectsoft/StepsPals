using System;
using System.Collections.Generic;
using System.Linq;
using InApps;
using UniRx;

namespace Data.DataProxy
{
    public class MonetizationDataProxy
    {
        private readonly Subject<InAppOfferType> _offerBought = new();
        public IObservable<InAppOfferType> OfferBought => _offerBought;

        private static readonly Dictionary<InAppOfferType, string> ConsumableOffersSku = new()
        {
            [InAppOfferType.RevivePet] = GlobalConstants.ConsumableSku[0],
        };

        public string GetOfferSku(InAppOfferType offerType) => ConsumableOffersSku[offerType];

        public InAppOfferType GetOfferType(string sku) => ConsumableOffersSku.First(o => o.Value == sku).Key;

        public void OnOfferBought(InAppOfferType offerType) => _offerBought.OnNext(offerType);
    }
}