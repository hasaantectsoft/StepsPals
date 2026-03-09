using SceneManagement;
using ScreenNavigationSystem;
using UniRx;
using Zenject;

namespace Screens.LoadingScreen
{
    public class LoadingScreenPresenter : ScreenPresenter
    {
        private LoadingScreenView _view;
        private SceneLoader _sceneLoader;
        private CompositeDisposable _onShowDisposables = new();

        [Inject]
        public void Construct(SceneLoader sceneLoader)
        {
            _sceneLoader = sceneLoader;
        }

        private void Awake()
        {
            _view = GetComponent<LoadingScreenView>();

            OnShowCallback += _ =>
            {
                _sceneLoader.LoadingProgress.Subscribe(progress => { _view.SetLoadingProgress(progress, false); })
                    .AddTo(_onShowDisposables);
                _view.SetLoadingProgress(0f, false);
            };

            OnHideCallback += delegate
            {
                _onShowDisposables.Dispose();
                _onShowDisposables = new CompositeDisposable();
            };
        }
    }
}