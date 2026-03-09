using System;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using Screens.Shared.StepGoalSlider;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.StepGoalSetupScreen
{
    public class StepGoalSetupScreenView : ScreenView
    {
        [SerializeField] private CloseButton backButton;
        [SerializeField] private CustomButton nextButton;
        [SerializeField] private StepGoalSliderPresenter stepsSlider;
        [SerializeField] private TextMeshProUGUI stepsCountText;
        [SerializeField] private TextMeshProUGUI petNameText;
        [SerializeField] private Image eggImage;

        public event Action ClickedNextButton;
        public event Action ClickedBackButton;
        public event Action<int> ChangedStepsSlider;

        public void Initialize()
        {
            stepsSlider.Initialize();
            backButton.Clicked += () => ClickedBackButton?.Invoke();
            nextButton.StartedClicking += () => { SetBackButtonInteractable(false); };
            nextButton.FinishedClicking += () => ClickedNextButton?.Invoke();
            stepsSlider.ChangedStepCount += value => ChangedStepsSlider?.Invoke(Convert.ToInt32(value));
        }

        public void Configure(int defaultSliderValue, string petName, Sprite eggSprite)
        {
            petNameText.text = petName;
            eggImage.sprite = eggSprite;
            stepsSlider.ConfigureSlider(defaultSliderValue);
            SetStepsCountText(defaultSliderValue);
        }

        public void SetStepsCountText(int value)
        {
            stepsCountText.text = string.Format(StringKeys.StepsSetUpCountText, value);
        }

        public void SetBackButtonInteractable(bool interactable) => backButton.SetInteractable(interactable);
    }
}