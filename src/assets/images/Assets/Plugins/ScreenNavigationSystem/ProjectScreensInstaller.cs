using System;
using UnityEngine;
using Zenject;
#if SNS_WITH_UNIRX
    using UniRx;
#endif

namespace ScreenNavigationSystem
{
    [RequireComponent(typeof(Canvas))]
    public class ProjectScreensInstaller : MonoBehaviour
    {
        protected ScreensController ScreensController;

        private Transform _dCanvasTransform;
        private DiContainer _diContainer;
        private ScreenAssets _screenAssets;

        [Inject]
        public void Construct(ScreenAssets screenAssets, DiContainer diContainer, ScreensController screensController)
        {
            _diContainer = diContainer;
            _dCanvasTransform = GetComponent<Canvas>().transform;
            _screenAssets = screenAssets;
            ScreensController = screensController;
        }

        public void InstantiateScreen(Type sType, Action<ScreenPresenter> onSuccess)
        {
            if (_screenAssets.TryGetScreen(sType, out ScreenPresenter screen))
            {
                GameObject newScreen = _diContainer.InstantiatePrefab(screen, _dCanvasTransform);
                ScreenPresenter screenPresenter = newScreen.GetComponent<ScreenPresenter>();
            #if SNS_LOGS
                Debug.Log($"SNS | Setup {sType.Name}");
            #endif
                newScreen.name = sType.Name;

                if (screenPresenter.ShouldDeleteAfterHide)
                {
                #if SNS_WITH_UNIRX
                    screenPresenter.OnHideCallback.Subscribe(_ => { DestroyScreen(screenPresenter); }).AddTo(this);
                #else
                    screenPresenter.OnHideCallback += () => { DestroyScreen(screenPresenter); };
                #endif
                }

                onSuccess.Invoke(screenPresenter);
            }
        }

        public void DestroyScreen(ScreenPresenter screenPresenter)
        {
            Destroy(screenPresenter.gameObject);
        }
    }
}