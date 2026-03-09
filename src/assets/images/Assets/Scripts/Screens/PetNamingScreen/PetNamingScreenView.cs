using System;
using ScreenNavigationSystem;
using Screens.Shared;
using Screens.Shared.Buttons;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.PetNamingScreen
{
    public class PetNamingScreenView : ScreenView
    {
        [SerializeField] private CustomButton nextButton;
        [SerializeField] private CloseButton backButton;
        [SerializeField] private Image petEggImage;
        [SerializeField] private CustomInputField nameInputField;

        public event Action ClickedNextButton;
        public event Action ClickedBackButton;
        public event Action<string> NameChanged;

        private void Awake()
        {
            nextButton.FinishedClicking += () => ClickedNextButton?.Invoke();
            backButton.Clicked += () => ClickedBackButton?.Invoke();
            nextButton.StartedClicking += () => { SetBackButtonInteractable(false); };
            nameInputField.TextChanged += result => NameChanged?.Invoke(result);
        }

        public void Reset()
        {
            nameInputField.SetText(string.Empty);
        }

        public void Configure(Sprite eddSprite)
        {
            petEggImage.sprite = eddSprite;
            SetNextButtonInteractable(!string.IsNullOrEmpty(nameInputField.Text));

            if (string.IsNullOrWhiteSpace(nameInputField.Text))
            {
                nameInputField.SetTextWithoutNotify(string.Empty);
                HideErrorMessage();
            }
        }

        public void ShowErrorMessage(string message)
        {
            nameInputField.ShowErrorMessage(message);
        }

        public void HideErrorMessage() => nameInputField.HideErrorMessage();
        public void SetNextButtonInteractable(bool interactable) => nextButton.SetInteractable(interactable);
        public void SetBackButtonInteractable(bool interactable) => backButton.SetInteractable(interactable);
    }
}