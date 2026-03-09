using System;
using Sounds;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.Shared
{
    public class PetToggleView : MonoBehaviour
    {
        [SerializeField] private GameObject selectionImageGo;
        [SerializeField] private TextMeshProUGUI petNameText;
        [SerializeField] private Image petEggImage;
        [SerializeField] private Toggle toggle;

        public event Action<bool> ToggleValueChanged;

        private void Awake()
        {
            toggle.onValueChanged.AddListener(isOn =>
            {
                ToggleValueChanged?.Invoke(isOn);
                SelectPet(isOn);
                if (isOn)
                {
                    SoundsManager.PlaySound(AudioKey.CustomButtonClickSound);
                }
            });
        }
        
        public void SetToggle(bool isOn) => toggle.isOn = isOn;

        public void ConfigureToggle(Sprite petEggSprite, string petName, bool hideSelection = true)
        {
            petNameText.text = petName;
            petEggImage.sprite = petEggSprite;
            if (hideSelection)
            {
                SelectPet(false);
            }
        }

        public void SetInteractable(bool interactable)
        {
            toggle.interactable = interactable;
        }

        private void SelectPet(bool select)
        {
            selectionImageGo.SetActive(select);
        }
    }
}