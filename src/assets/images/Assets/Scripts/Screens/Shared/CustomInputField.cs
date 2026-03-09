using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.Shared
{
    public class CustomInputField : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI errorText;
        [SerializeField] private TMP_InputField inputField;
        [SerializeField] private TextMeshProUGUI inputText;
        [SerializeField] private Image borderImage;

        private Color? _defaultBorderColor;
        private Color? _defaultTextColor;

        public event Action<string> TextChanged;

        public string Text => inputField.text;

        private void Start()
        {
            _defaultBorderColor = borderImage.color;
            _defaultTextColor = inputText.color;
            inputField.ConfigureStringInputField(result => TextChanged?.Invoke(result));
        }

        public void SetText(string text)
        {
            inputField.text = text;
        }

        public void SetTextWithoutNotify(string text)
        {
            inputField.SetTextWithoutNotify(text);
        }

        public void ShowErrorMessage(string message)
        {
            errorText.gameObject.SetActive(true);
            errorText.text = message;
            borderImage.color = ColorsStorage.RedBorderErrorColor;
            inputText.color = ColorsStorage.RedErrorColor;
        }

        public void HideErrorMessage()
        {
            errorText.gameObject.SetActive(false);
            if (_defaultBorderColor.HasValue && _defaultTextColor.HasValue)
            {
                borderImage.color = _defaultBorderColor.Value;
                inputText.color = _defaultTextColor.Value;
            }
        }
    }
}