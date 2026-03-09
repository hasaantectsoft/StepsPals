using System.Threading.Tasks;
using Analytics;
using Cysharp.Threading.Tasks;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using InApps;
using ScreenNavigationSystem;
using Screens.NoConnectionPopup;
using Screens.Shared.PetGrave;
using Services;
using Sounds;
using UniRx;
using UnityEngine;
using Zenject;

namespace Screens.DeathPopup
{
    public class DeathPopupPresenter : ScreenPresenter
    {
        private const InAppOfferType ReviveInAppOfferType = InAppOfferType.RevivePet;

        [SerializeField] private DeathPopupView view;

        private PlayersPetsDataProxy _playersPetsDataProxy;
        private InAppPurchasesController _inAppPurchasesController;
        private MonetizationDataProxy _monetizationDataProxy;
        private InternetConnectionService _internetConnectionService;
        private ScreensController _screensController;

        [Inject]
        public void Construct(PlayersPetsDataProxy playersPetsDataProxy,
            InAppPurchasesController inAppPurchasesController, MonetizationDataProxy monetizationDataProxy,
            InternetConnectionService internetConnectionService, ScreensController screensController)
        {
            _playersPetsDataProxy = playersPetsDataProxy;
            _inAppPurchasesController = inAppPurchasesController;
            _monetizationDataProxy = monetizationDataProxy;
            _internetConnectionService = internetConnectionService;
            _screensController = screensController;
        }

        private void Awake()
        {
            view.Initialize();
            view.ClickedReviveButton += () => OnReviveButtonClicked().Forget();
            view.ClickedStartOverButton += () =>
            {
                _playersPetsDataProxy.BuryDeadActivePet();
                CloseScreen(); 
                DevToDevManager.LogEvent(DevToDevKey.revive_attempt, (DevToDevKey.result, DevToDevKey.cancel.ToString()));
            };

            _inAppPurchasesController.FailedPurchase += OnPurchaseFailed;
            _monetizationDataProxy.OfferBought.Where(offerType => offerType == ReviveInAppOfferType).Subscribe(_ =>
            {
                view.ShowLoadingOverlay(false);
                ActivePetDataProxy activePet = _playersPetsDataProxy.ActivePet.Value;
                activePet?.RevivePet();

                DevToDevManager.LogEvent(DevToDevKey.revive_attempt,
                    (DevToDevKey.result, DevToDevKey.success.ToString()));

                CloseScreen();
            }).AddTo(this);

            OnShowCallback += OnShow;
        }
        
        private async UniTask OnReviveButtonClicked()
        {
            bool isConnected = await _internetConnectionService.TryShowNoInternetConnection();

            if (isConnected)
            {
                view.ShowLoadingOverlay(true);
                _inAppPurchasesController.BuyOffer(ReviveInAppOfferType);
            }
        }

        private void OnPurchaseFailed()
        {
            view.ShowLoadingOverlay(false);
        }

        private void OnShow(object data)
        {
            SoundsManager.PlaySound(AudioKey.DeathPopupSound);
            if (data is not PetGraveViewInfo info)
                return;

            view.Configure(info, _inAppPurchasesController.GetLocalizedProductPrice(ReviveInAppOfferType));
        }
    }
}