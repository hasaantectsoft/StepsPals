using Assets;
using Balances;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Helpers;
using Data.Types;
using ScreenNavigationSystem;
using Screens.ConfirmationPopup;
using Screens.NewPetProposalPopup;
using Sounds;
using UnityEngine;
using Utils;
using Zenject;

namespace Screens.EvolutionStagePopup
{
    public class EvolutionStagePopupPresenter : ScreenPresenter
    {
        [SerializeField] private EvolutionStagePopupView view;

        private AssetsProvider _assetsProvider;
        private GameBalances _gameBalances;
        private PlayersPetsDataProxy _playersPetsData;
        private ScreensController _screensController;
        private PetMaturity _petMaturity;
        private bool _isNeedReplacePet;

        [Inject]
        public void Construct(AssetsProvider assetsProvider, GameBalances gameBalances,
            PlayersPetsDataProxy playersPetsData, ScreensController screensController)
        {
            _assetsProvider = assetsProvider;
            _gameBalances = gameBalances;
            _playersPetsData = playersPetsData;
            _screensController = screensController;
        }

        private void Awake()
        {
            view.Initialize();
            view.ClickedCloseButton += () =>
            {
                view.PlayPawAnimation();
                CloseScreen();

                if (_petMaturity == PetMaturity.Adult)
                {
                    _screensController.ExecuteCommand(new NavigationCommand()
                        .ShowNextScreen<NewPetProposalPopupPresenter>());
                }
            };
            view.FinishClickingAddToCollection += OnAddToCollection;
            view.StartClickingAddToCollection += () =>
            {
                view.PlayCongratulationVfxAnimation();
                SoundsManager.PlaySound(AudioKey.ResultPopupAppearing);
            };
            OnShowCallback += OnShow;
        }

        private void OnAddToCollection()
        {
            if (_isNeedReplacePet)
            {
                string oldestPetName = _playersPetsData.GetOldestPetNameInCollection();
                if (!string.IsNullOrEmpty(oldestPetName))
                {
                    _screensController.ExecuteCommand(new NavigationCommand()
                        .ShowNextScreen<ConfirmationPopupPresenter>().WithExtraData(oldestPetName)
                        .CloseCurrentScreen());
                }
            }
            else
            {
                _screensController.ExecuteCommand(new NavigationCommand().ShowNextScreen<NewPetProposalPopupPresenter>()
                    .CloseCurrentScreen());
            }

            CloseScreen();
        }

        private void OnShow(object data)
        {
            SoundsManager.PlaySound(AudioKey.EvolutionSound);
            if (data is not EvolutionStagePopupViewInfo info)
                return;

            _petMaturity = info.MaturityStage;
            if (_petMaturity == PetMaturity.Adult)
            {
                _isNeedReplacePet = !_playersPetsData.TryAddActivePetToCollection();
            }

            view.Configure(info, _assetsProvider.GetPetSprite(info.PetSpecies, _petMaturity, ConditionState.Healthy),
                ContentHelper.GetTitleTextForEvolutionsPopup(_petMaturity),
                string.Format(ContentHelper.GetMainTextForEvolutionsPopup(_petMaturity), info.PetName,
                    ColorUtility.ToHtmlStringRGBA(ColorsStorage.DarkBrownPopupText),
                    _gameBalances.GrowthDaysToMature[_petMaturity]));
        }
    }
}