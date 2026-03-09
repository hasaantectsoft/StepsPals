using System;
using Cysharp.Threading.Tasks;
using Screens.Shared.Buttons;
using UnityEngine;
using Utils;

namespace Screens.Shared.NavigationBar
{
    public class NavigateBarView : MonoBehaviour
    {
        [SerializeField] private SerializedDictionary<NavigationButtonType, CustomButton> navigationButtons;
        [SerializeField] private GameObject overlayGo;
        [SerializeField] private GameObject loadingOverlay;

        public event Action<NavigationButtonType> ClickedNavigationButton;

        public void Initialize(NavigationButtonType openedNavigation)
        {
            foreach ((NavigationButtonType type, CustomButton button) in navigationButtons.Dictionary)
            {
                button.FinishedClicking += () => ClickedNavigationButton?.Invoke(type);
            }

            if (navigationButtons.Dictionary.TryGetValue(openedNavigation, out CustomButton navButton))
            {
                navButton.SetInteractable(false);
            }
        }

        public async UniTask HighlightButton(NavigationButtonType buttonType)
        {
            await Animations.PlayHighlightButtonAnimation(navigationButtons[buttonType].transform);
        }

        public void SetOverlayActiveAboveNavigationBar(bool overlayActive)
        {
            overlayGo.SetActive(overlayActive);
        }

        public void SetLoaderActive(bool active)
        {
            loadingOverlay.SetActive(active);
        }
    }
}