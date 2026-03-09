using Game.HomeRoom;
using Game.Pets;
using Managers;
using ScreenNavigationSystem;
using Screens.HomeScreen;
using Tutorials;
using Zenject;

namespace Installers
{
    public class MainSceneInstaller : MonoInstaller
    {
        public override void InstallBindings()
        {
            Container.Bind<SceneScreensInstaller>().FromComponentInHierarchy().AsSingle().NonLazy();
            Container.Bind<PermissionsManager>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<TutorialsController>().AsSingle().NonLazy();

            BindHomeRoom();
            BindPet();
        }

        private void BindHomeRoom()
        {
            Container.Bind<HomeRoomPresenter>().FromComponentInHierarchy().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<HomeRoomController>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<HomeScreenPresenter>().FromComponentInHierarchy().AsSingle();
        }

        private void BindPet()
        {
            Container.BindInterfacesAndSelfTo<PetController>().AsSingle().NonLazy();
            Container.BindInterfacesAndSelfTo<PetPresenter>().FromComponentInHierarchy().AsSingle();
        }
    }
}