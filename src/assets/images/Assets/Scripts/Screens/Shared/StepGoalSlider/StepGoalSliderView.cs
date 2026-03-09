using System;
using Screens.Shared.Buttons;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.Shared.StepGoalSlider
{
    public class StepGoalSliderView : MonoBehaviour
    {
        [SerializeField] private Slider stepsSlider;
        [SerializeField] private CustomButton plusStepsButton;
        [SerializeField] private CustomButton minusStepsButton;

        private bool _isConfiguring;

        public event Action<bool> ClickedPlusMinusButton;
        public event Action<int> ChangedStepsSlider;

        public int SliderValue => (int)stepsSlider.value;

        public void Initialize()
        {
            plusStepsButton.StartedClicking += () => ClickedPlusMinusButton?.Invoke(true);
            minusStepsButton.StartedClicking += () => ClickedPlusMinusButton?.Invoke(false);
            stepsSlider.onValueChanged.AddListener(OnSliderValueChange);
        }

        private void OnSliderValueChange(float value)
        {
            if (_isConfiguring)
                return;

            ChangedStepsSlider?.Invoke(Convert.ToInt32(value));
        }

        public void ConfigureSlider(int defaultStepsCount, IntegerRange sliderRange)
        {
            _isConfiguring = true;
            stepsSlider.minValue = sliderRange.Min;
            stepsSlider.maxValue = sliderRange.Max;
            SetStepsSliderValueWithoutNotify(defaultStepsCount);
            _isConfiguring = false;
        }

        public void SetStepsSliderValueWithoutNotify(int value)
        {
            stepsSlider.SetValueWithoutNotify(value);
        }

        public void SetInteractable(bool interactable)
        {
            stepsSlider.interactable = interactable;
            minusStepsButton.SetInteractable(interactable);
            plusStepsButton.SetInteractable(interactable);
        }
    }
}