using Cysharp.Threading.Tasks;
using ScreenNavigationSystem;
using UnityEngine;

namespace Screens.WelcomePopup
{
    public class WelcomePopupPresenter : ScreenPresenter
    {
        [SerializeField] WelcomePopupView view;

        private void Awake()
        {
            view.Initialize();

            view.ClickedCloseButton += () => { OnClose().Forget(); };
            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            if (data is not bool isFreeTrial)
                return;

            view.Configure(isFreeTrial);
        }

        private async UniTask OnClose()
        {
            await view.PlayPawAnimation();
            CloseScreen();
        }
    }
}