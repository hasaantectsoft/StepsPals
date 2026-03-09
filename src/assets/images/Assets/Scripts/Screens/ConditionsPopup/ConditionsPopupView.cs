using System;
using Cysharp.Threading.Tasks;
using Data.Helpers;
using Data.Types;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using TMPro;
using UnityEngine;
using Utils;

namespace Screens.ConditionsPopup
{
    public class ConditionsPopupView : ScreenView
    {
        [SerializeField] private CloseButton closeButton;
        [SerializeField] private Transform paw;
        [SerializeField] private TextMeshProUGUI mainText;
        [SerializeField] private SerializedDictionary<ConditionState, GameObject> popupsBackgrounds;

        public event Action ClickedCloseButton;

        public void Initialize()
        {
            closeButton.Clicked += () => ClickedCloseButton?.Invoke();
        }

        public void Configure(ConditionState state, string petName)
        {
            foreach ((ConditionState conditionState, GameObject go) in popupsBackgrounds.Dictionary)
            {
                go.SetActive(state == conditionState);
            }

            mainText.text = string.Format(ContentHelper.GetTextForConditionsPopup(state), petName,
                ColorUtility.ToHtmlStringRGBA(ColorsStorage.VerySickPopupTextColor));
        }

        public async UniTask PlayPawAnimation()
        {
            await Animations.PlayScaleAnimation(paw);
        }
    }
}