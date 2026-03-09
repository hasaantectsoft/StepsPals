using Data.DataProxy.PlayersPetsDataProxy;
using ScreenNavigationSystem;
using Screens.NewPetProposalPopup;
using UnityEngine;
using Zenject;

namespace Screens.ConfirmationPopup
{
    public class ConfirmationPopupPresenter : ScreenPresenter
    {
        [SerializeField] private ConfirmationPopupView view;

        private PlayersPetsDataProxy _playersPetsData;
        private ScreensController _screensController;

        [Inject]
        public void Construct(PlayersPetsDataProxy playersPetsData, ScreensController screensController)
        {
            _playersPetsData = playersPetsData;
            _screensController = screensController;
        }

        private void Awake()
        {
            view.Initialize();

            view.ClickedButton += OnClickedYesNoButton;
            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            if (data is not string petName)
                return;

            view.Configure(petName);
        }

        private void OnClickedYesNoButton(bool replacePet)
        {
            if (replacePet)
            {
                _playersPetsData.AddActivePetToCollection(true);
                _screensController.ExecuteCommand(
                    new NavigationCommand().ShowNextScreen<NewPetProposalPopupPresenter>());
            }

            CloseScreen();
        }
    }
}