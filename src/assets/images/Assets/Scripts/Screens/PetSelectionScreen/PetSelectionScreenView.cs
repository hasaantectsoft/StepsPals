using System;
using Data.Types;
using ScreenNavigationSystem;
using Screens.Shared;
using Screens.Shared.Buttons;
using UnityEngine;
using Utils;

namespace Screens.PetSelectionScreen
{
    public class PetSelectionScreenView : ScreenView
    {
        [field: SerializeField] public SerializedDictionary<PetType, PetToggleView> petsToggles;
        [SerializeField] private CustomButton nextButton;

        public event Action ClickedNextButton;
        public event Action<PetType, bool> ToggleChanged;

        private void Awake()
        {
            nextButton.StartedClicking += () => SetInteractableForAllToggles(false);
            nextButton.FinishedClicking += () => ClickedNextButton?.Invoke();
            foreach ((PetType type, PetToggleView petToggle) in petsToggles.Dictionary)
            {
                petToggle.ToggleValueChanged += isOn => { ToggleChanged?.Invoke(type, isOn); };
            }
        }

        public void Reset()
        {
            foreach ((PetType type, PetToggleView petToggle) in petsToggles.Dictionary)
            {
                petToggle.SetToggle(false);
            }
        }

        public void Configure(bool nextButtonActive)
        {
            SetNextButtonActive(nextButtonActive);
            SetInteractableForAllToggles(true);
        }

        private void SetNextButtonActive(bool active) => nextButton.gameObject.SetActive(active);

        private void SetInteractableForAllToggles(bool interactable)
        {
            foreach ((PetType _, PetToggleView petToggle) in petsToggles.Dictionary)
            {
                petToggle.SetInteractable(interactable);
            }
        }
    }
}