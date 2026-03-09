using System;
using Sounds;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.Shared.Buttons
{
    [RequireComponent(typeof(Button))]
    public class CloseButton : MonoBehaviour
    {
        private Button _button;

        private Button Button => _button ??= GetComponent<Button>();

        public event Action Clicked;

        private void Awake()
        {
            Button.ActionWithThrottle(OnClick);
        }

        public void SetInteractable(bool interactable) => Button.interactable = interactable;

        private void OnClick()
        {
            SoundsManager.PlaySound(AudioKey.CloseButtonClickSound);
            Clicked?.Invoke();
        }
    }
}