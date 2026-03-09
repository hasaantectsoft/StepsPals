using System;
using Coffee.UIExtensions;
using Cysharp.Threading.Tasks;
using Data.Helpers;
using Data.Types;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.EvolutionStagePopup
{
    public class EvolutionStagePopupView : ScreenView
    {
        [SerializeField] private CloseButton closeButton;
        [SerializeField] private CustomButton addToCollectionButton;
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private TextMeshProUGUI subtitleText;
        [SerializeField] private TextMeshProUGUI mainText;
        [SerializeField] private Image petImage;
        [SerializeField] private Transform paw;
        [SerializeField] private UIParticle congratulationVfx;
        [SerializeField] private GameObject pawButtonGo;

        public event Action ClickedCloseButton;
        public event Action FinishClickingAddToCollection;
        public event Action StartClickingAddToCollection;

        public void Initialize()
        {
            closeButton.Clicked += () => ClickedCloseButton?.Invoke();
            addToCollectionButton.FinishedClicking += () => FinishClickingAddToCollection?.Invoke();
            addToCollectionButton.StartedClicking += () => StartClickingAddToCollection?.Invoke();
        }

        public void Configure(EvolutionStagePopupViewInfo info, Sprite petSprite, string title, string main)
        {
            petImage.sprite = petSprite;
            titleText.text = title;
            subtitleText.text = string.Format(ContentHelper.GetSubtitleTextForEvolutionsPopup(info.MaturityStage),
                info.PetName);

            bool isAdult = info.MaturityStage == PetMaturity.Adult;
            addToCollectionButton.gameObject.SetActive(isAdult);
            mainText.gameObject.SetActive(!isAdult);
            pawButtonGo.SetActive(!isAdult);
            closeButton.SetInteractable(!isAdult);
            mainText.text = main;
        }

        public void PlayPawAnimation()
        {
            Animations.PlayScaleAnimation(paw).Forget();
        }

        public void PlayCongratulationVfxAnimation()
        {
            congratulationVfx.Play();
        }
    }
}