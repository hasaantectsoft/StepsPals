using Cysharp.Threading.Tasks;
using ScreenNavigationSystem;
using Sounds;
using UnityEngine;

namespace Screens.GreatJobPopup
{
    public class GreatJobPopupPresenter : ScreenPresenter
    {
        [SerializeField] private GreatJobPopupView view;

        private void Awake()
        {
            view.Initialize();
            view.ClickedCloseButton += () => { OnClose().Forget(); };

            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            SoundsManager.PlaySound(AudioKey.GreatJobPopupSound);
        }

        private async UniTask OnClose()
        {
            await view.PlayPawAnimation();
            CloseScreen();
        }
    }
}