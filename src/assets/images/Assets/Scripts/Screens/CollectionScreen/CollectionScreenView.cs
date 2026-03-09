using ScreenNavigationSystem;
using Screens.Shared.NavigationBar;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.CollectionScreen
{
    public class CollectionScreenView : ScreenView
    {
        [field: SerializeField] public Transform CollectionPanelsRoot { get; private set; }
        [field: SerializeField] public PetInCollectionView PetInCollectionPrefab { get; private set; }
        [SerializeField] private NavigationBarPresenter navigationBar;
        [SerializeField] private ScrollRect scrollRect;
        [SerializeField] private TextMeshProUGUI upperText;

        public void Initialize()
        {
            navigationBar.Initialize(NavigationButtonType.None);
        }

        public void ResetView()
        {
            scrollRect.verticalNormalizedPosition = 1f;
        }

        public void SetText(int count)
        {
            upperText.text = count == 0 ? StringKeys.NoPetsCollectionPopupText
                : string.Format(StringKeys.CollectionPopupText, count);
        }
    }
}