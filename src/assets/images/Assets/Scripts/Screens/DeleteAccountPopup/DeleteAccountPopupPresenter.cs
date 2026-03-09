using Data;
using Playfab;
using SaveSystem;
using ScreenNavigationSystem;
using UnityEngine;
using Utils;
using Zenject;

namespace Screens.DeleteAccountPopup
{
    [RequireComponent(typeof(DeleteAccountPopupView))]
    public class DeleteAccountPopupPresenter : ScreenPresenter
    {
        [SerializeField] private DeleteAccountPopupView view;

        private IApiInterface _apiInterface;
        private BinarySaveSystem _binarySaveSystem;
        private DataController _dataController;

        [Inject]
        private void Construct(IApiInterface apiInterface, BinarySaveSystem binarySaveSystem,
            DataController dataController)
        {
            _apiInterface = apiInterface;
            _binarySaveSystem = binarySaveSystem;
            _dataController = dataController;
        }

        private void Awake()
        {
            view.Initialize();

            view.ClickedButton += delete =>
            {
                if (delete)
                {
                    _apiInterface.DeleteAccount(OnDeleteAccount, () => { view.SetOverlayActive(false); });
                }
                else
                {
                    CloseScreen();
                }
            };
        }

        private void OnDeleteAccount()
        {
            _binarySaveSystem.DeleteSaveFile();
            PlayerPrefsHelper.IsLinkedSocial = false;
            _dataController.StopSavingData();

            Utils.Utils.QuitApp();
        }
    }
}