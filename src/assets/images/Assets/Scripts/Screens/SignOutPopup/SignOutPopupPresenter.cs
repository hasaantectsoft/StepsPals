using Authentication;
using Infrastructure.GameStateMachine;
using Infrastructure.GameStateMachine.GameStates;
using ScreenNavigationSystem;
using UnityEngine;
using Zenject;

namespace Screens.SignOutPopup
{
    public class SignOutPopupPresenter : ScreenPresenter
    {
        [SerializeField] private SignOutPopupView view;

        private GameStateMachine _gameStateMachine;
        private IAuthenticationManager _authenticationManager;

        [Inject]
        private void Construct(GameStateMachine gameStateMachine, IAuthenticationManager authenticationManager)
        {
            _gameStateMachine = gameStateMachine;
            _authenticationManager = authenticationManager;
        }

        private void Awake()
        {
            view.Initialize();

            view.ClickedButton += signOut =>
            {
                if (signOut)
                {
                    OnSignOut();
                }
                else
                {
                    CloseScreen();
                }
            };
        }

        private void OnSignOut()
        {
            _authenticationManager.UnlinkAccount(delegate
            {
                view.SetOverlayActive(false);
                Debug.Log("Unlink Account Successfully");
                _gameStateMachine.Enter<BootstrapState>();
            }, () => { view.SetOverlayActive(false); });
        }
    }
}