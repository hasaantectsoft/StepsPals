using System;
using Balances;
using UnityEngine;
using Zenject;

namespace Screens.Shared.StepGoalSlider
{
    public class StepGoalSliderPresenter : MonoBehaviour
    {
        private const int PlusMinusButtonsStep = 100;
        private const int SlidersButtonsStep = 500;

        [SerializeField] private StepGoalSliderView view;

        private GameBalances _gameBalances;

        public event Action<int> ChangedStepCount;

        [Inject]
        private void Construct(GameBalances gameBalances)
        {
            _gameBalances = gameBalances;
        }

        public void Initialize()
        {
            view.Initialize();
            view.ClickedPlusMinusButton += isPlus =>
            {
                view.SetStepsSliderValueWithoutNotify(view.SliderValue + (isPlus ? 1 : -1) * PlusMinusButtonsStep);
                ChangedStepCount?.Invoke(view.SliderValue);
            };
            view.ChangedStepsSlider += newValue =>
            {
                view.SetStepsSliderValueWithoutNotify(Utils.Utils.RoundToNearest(newValue, SlidersButtonsStep));
                ChangedStepCount?.Invoke(view.SliderValue);
            };
        }

        public void ConfigureSlider(int value)
        {
            view.ConfigureSlider(value, _gameBalances.StepsGoalRange);
        }
        
        public void SetInteractable(bool interactable)
        {
            view.SetInteractable(interactable);
        }
    }
}