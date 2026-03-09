using Data.DataProxy.PlayersPetsDataProxy;
using ScreenNavigationSystem;
using UnityEngine;
using Zenject;

namespace Screens.NewPetProposalPopup
{
    public class NewPetProposalPopupPresenter : ScreenPresenter
    {
        [SerializeField] private NewPetProposalPopupView view;

        private PlayersPetsDataProxy _playersPetsData;

        [Inject]
        public void Construct(PlayersPetsDataProxy playersPetsData)
        {
            _playersPetsData = playersPetsData;
        }

        private void Awake()
        {
            view.Initialize();

            view.ClickedButton += OnClickedYesNoButton;
        }

        private void OnClickedYesNoButton(bool createNewPet)
        {
            if (createNewPet)
            {
                _playersPetsData.RemoveActivePet();
            }

            CloseScreen();
        }
    }
}