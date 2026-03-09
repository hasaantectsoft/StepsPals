using ScreenNavigationSystem;
using Screens.Shared.NavigationBar;
using Screens.Shared.PetGrave;
using UnityEngine;

namespace Screens.GraveyardScreen
{
    public class GraveyardScreenView : ScreenView
    {
        [field: SerializeField] public Transform GravesPanelsRoot { get; private set; }
        [field: SerializeField] public PetGraveView PetGrabePrefab { get; private set; }
        [SerializeField] private NavigationBarPresenter navigationBarPresenter;
        [SerializeField] private GameObject noPetsTextGo;
        [SerializeField] private GameObject earlyPetsTextGo;

        public void Initialize()
        {
            navigationBarPresenter.Initialize(NavigationButtonType.Graveyard);
        }

        public void SetNoPetsTextActive(bool active) => noPetsTextGo.SetActive(active);
        public void SetEarlyPetsTextActive(bool active) => earlyPetsTextGo.SetActive(active);
    }
}