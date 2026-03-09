using Assets;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using ScreenNavigationSystem;
using Sounds;
using UnityEngine;
using Zenject;

namespace Screens.ResultPopup
{
    public class ResultPopupPresenter : ScreenPresenter
    {
        [SerializeField] private ResultPopupView view;

        private AssetsProvider _assetsProvider;
        private PlayersPetsDataProxy _playersPetsDataProxy;

        [Inject]
        public void Construct(AssetsProvider assetsProvider, PlayersPetsDataProxy playersPetsDataProxy)
        {
            _assetsProvider = assetsProvider;
            _playersPetsDataProxy = playersPetsDataProxy;
        }

        private void Awake()
        {
            view.Initialize(_assetsProvider);

            OnShowCallback += OnShow;
            view.ClickedCloseButton += () =>
            {
                view.PlayPawAnimation();
                CloseScreen();
            };
        }

        private void OnShow(object data)
        {
            if (data is not ResultPopupInfo info ||
                _playersPetsDataProxy.ActivePet.Value.Condition.Value == ConditionState.Dead)
            {
                CloseScreen();
                return;
            }

            if (info.League != LeagueType.Unranked)
            {
                SoundsManager.PlaySound(AudioKey.ResultPopupAppearing);
            }

            view.Configure(info);
        }
    }
}