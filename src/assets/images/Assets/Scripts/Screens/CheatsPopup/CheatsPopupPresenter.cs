using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using ScreenNavigationSystem;
using Steps;
using UnityEngine;
using Zenject;

namespace Screens.CheatsPopup
{
    [RequireComponent(typeof(CheatsPopupView))]
    public class CheatsPopupPresenter : ScreenPresenter
    {
        [SerializeField] private CheatsPopupView view;

        private StepsManager _stepsManager;
        private PlayersPetsDataProxy _playersPetsDataProxy;
        private int _cheatsSteps;
        private int _daysToSkip;

        [Inject]
        private void Construct(StepsManager stepsManager, PlayersPetsDataProxy playersPetsDataProxy)
        {
            _stepsManager = stepsManager;
            _playersPetsDataProxy = playersPetsDataProxy;
        }

        private void Awake()
        {
            view.Initialize();
            view.ClickedRewriteStepsButton += () => _stepsManager.SetCheatDataSteps(true, _cheatsSteps);
            view.ClickedCancelRewriteStepsButton += () => _stepsManager.SetCheatDataSteps(false, _cheatsSteps);
            view.ClickedSkipDaysButton += changeWeeks => _stepsManager.SkipDays(_daysToSkip, changeWeeks);
            view.ClickedDoAllCareActionsButton += () =>
            {
                ActivePetDataProxy activePet = _playersPetsDataProxy.ActivePet.Value;
                activePet?.TakeCareOfPet(CareActionType.GiveTreat);
            };
            view.ClickedRevivePetButton += () =>
            {
                ActivePetDataProxy activePet = _playersPetsDataProxy.ActivePet.Value;
                activePet?.RevivePet();
            };
            view.ChangedStepsValue += stepsCount => _cheatsSteps = stepsCount;
            view.ChangedSkipDaysValue += daysToSkip => _daysToSkip = daysToSkip;
            view.ClickedCloseButton += CloseScreen;
            view.ClickedMaturatePetButton += () =>
            {
                CloseScreen();
                ActivePetDataProxy activePet = _playersPetsDataProxy.ActivePet.Value;
                int daysToMature = activePet.GetDaysToMature() - activePet.GrowthDay.Value;
                activePet.AddAge(daysToMature);
                activePet.GrowPetAndTryMaturate(daysToMature);
            };
        }
    }
}