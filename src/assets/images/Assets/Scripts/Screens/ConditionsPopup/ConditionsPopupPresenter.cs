using Cysharp.Threading.Tasks;
using ScreenNavigationSystem;
using Sounds;
using UnityEngine;

namespace Screens.ConditionsPopup
{
    public class ConditionsPopupPresenter : ScreenPresenter
    {
        [SerializeField] private ConditionsPopupView view;

        private void Awake()
        {
            view.Initialize();
            view.ClickedCloseButton += () => { OnClose().Forget(); };

            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            if (data is not ConditionsPopupViewInfo info)
                return;

            SoundsManager.PlaySound(AudioKey.SickPopupSound);
            view.Configure(info.Condition, info.PetName);
        }

        private async UniTask OnClose()
        {
            await view.PlayPawAnimation();
            CloseScreen();
        }
    }
}