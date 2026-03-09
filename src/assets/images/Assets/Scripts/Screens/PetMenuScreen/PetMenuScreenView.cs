using System;
using Data.Helpers;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using Screens.Shared.StepGoalSlider;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.PetMenuScreen
{
    public class PetMenuScreenView : ScreenView
    {
        private static readonly string InfoColorTextString =
            ColorUtility.ToHtmlStringRGB(ColorsStorage.LightBrownForText);

        private static readonly string GrowthColorTextString =
            ColorUtility.ToHtmlStringRGB(ColorsStorage.LighterBrownForText);

        [SerializeField] private CustomButton saveButton;
        [SerializeField] private CloseButton backButton;
        [SerializeField] private StepGoalSliderPresenter stepGoalSlider;
        [SerializeField] private TextMeshProUGUI stepsGoalText;
        [SerializeField] private TextMeshProUGUI petNameText;
        [SerializeField] private TextMeshProUGUI growthProgressText;
        [SerializeField] private Image petImage;
        [SerializeField] private SerializedDictionary<PetMenuInfoType, TextMeshProUGUI> petMenuInfos;

        public event Action ClickedSaveButton;
        public event Action ClickedBackButton;
        public event Action<int> ChangedStepsSlider;

        public void Initialize()
        {
            stepGoalSlider.Initialize();
            saveButton.StartedClicking += () => { stepGoalSlider.SetInteractable(false); };
            saveButton.FinishedClicking += () =>
            {
                ClickedSaveButton?.Invoke();
                stepGoalSlider.SetInteractable(true);
            };
            backButton.Clicked += () => ClickedBackButton?.Invoke();
            stepGoalSlider.ChangedStepCount += newValue => ChangedStepsSlider?.Invoke(newValue);
        }

        public void Configure(int defaultSliderValue)
        {
            stepGoalSlider.ConfigureSlider(defaultSliderValue);
            SetStepsGoalText(defaultSliderValue);
        }

        public void SetPetImage(Sprite petSprite)
        {
            petImage.sprite = petSprite;
        }

        public void ChangePetMenuInfoValue(PetMenuInfoType infoType, string value, bool pluralForm = true)
        {
            petMenuInfos[infoType].text = string.Format(StringKeys.PetMenuInfoText,
                ContentHelper.PetMenuInfoLabels[infoType], InfoColorTextString, value,
                pluralForm ? ContentHelper.GetPetMenuMeasuresPlural(infoType)
                    : ContentHelper.GetPetMenuMeasuresSingular(infoType));
        }

        public void SetPetNameText(string petName)
        {
            petNameText.text = petName;
        }

        public void SetGrowthProgressText(int currentDay, int endGrowthDay, bool isMax)
        {
            growthProgressText.text = isMax ? string.Format(StringKeys.MaxGrowthDaysFormat, GrowthColorTextString)
                : string.Format(StringKeys.GrowthDaysFormat, currentDay, GrowthColorTextString, endGrowthDay,
                    currentDay == 1 ? ContentHelper.GetPetMenuMeasuresSingular(PetMenuInfoType.Growth)
                        : ContentHelper.GetPetMenuMeasuresPlural(PetMenuInfoType.Growth));
        }

        public void SetStepsGoalText(int value)
        {
            stepsGoalText.text = string.Format(StringKeys.StepsGoalCountText, value);
        }

        public void SetSaveButtonInteractable(bool interactable) => saveButton.SetInteractable(interactable);
    }
}