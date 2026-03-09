using System;
using TMPro;

namespace Utils
{
    public static class InputFieldExtension
    {
        public static void ConfigureStringInputField(this TMP_InputField inputField, Action<string> onValidated)
        {
            inputField.onValueChanged.AddListener(text => onValidated?.Invoke(text.Trim()));
            inputField.onValidateInput = (text, index, addedChar) =>
                !char.IsWhiteSpace(addedChar) || (index > 0 && !char.IsWhiteSpace(text[index - 1])) ? addedChar
                    : (char)0;
        }

        public static void ConfigureIntegerInputField(this TMP_InputField inputField, Action<int> onValidated)
        {
            inputField.characterValidation = TMP_InputField.CharacterValidation.CustomValidator;
            inputField.onEndEdit.AddListener(text =>
            {
                int defaultValue = 0;
                int finalResult = int.TryParse(text, out int result) && result >= 0 ? result : defaultValue;
                inputField.SetTextWithoutNotify(finalResult.ToString());
                onValidated?.Invoke(finalResult);
            });

            inputField.onValidateInput = (text, index, addedChar) =>
            {
                if (char.IsWhiteSpace(addedChar))
                    return (char)0;
                string resultText = text.Insert(index, addedChar.ToString());
                if (!int.TryParse(resultText, out int result) || result < 0)
                    return (char)0;
                return addedChar;
            };
        }

        public static bool IsCharacterAllowed(this char character) =>
            char.IsDigit(character) || IsLetter(character) || char.IsWhiteSpace(character) 
            || character == '_' || char.IsNumber(character);

        public static bool IsBasicLatinLetter(this char character) =>
            (character is >= 'A' and <= 'Z' or >= 'a' and <= 'z');

        public static bool IsLetter(this char character) => char.IsLetter(character);
    }
}