using System;
using Sounds;
using Subscription;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.SubscriptionScreen
{
    public class SubscriptionToggleView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI planNameText;
        [SerializeField] private GameObject freeTrialGo;
        [SerializeField] private TextMeshProUGUI priceText;
        [SerializeField] private TextMeshProUGUI descriptionText;
        [SerializeField] private SerializedDictionary<bool, Sprite> spriteByIsOn;
        [SerializeField] private Toggle toggle;
        [SerializeField] private Image backgroundImage;

        public event Action<bool> ChangedToggleValue;

        private void Awake()
        {
            toggle.onValueChanged.AddListener(isOn =>
            {
                ChangeBackgroundSprite(isOn);
                ChangedToggleValue?.Invoke(isOn);
                if (isOn)
                {
                    SoundsManager.PlaySound(AudioKey.CustomButtonClickSound);
                }
            });
        }

        public void Configure(SubscriptionScreenViewInfo info, bool hasFreeTrial, bool isOn)
        {
            planNameText.text = info.Title;
            priceText.text = info.PriceString + PackagesHelper.PackagePriceSuffix[info.PackageIdentifier];
            descriptionText.text = info.Description;
            freeTrialGo.SetActive(hasFreeTrial);
            toggle.isOn = isOn;
        }

        private void ChangeBackgroundSprite(bool isOn)
        {
            backgroundImage.sprite = spriteByIsOn[isOn];
        }
    }
}