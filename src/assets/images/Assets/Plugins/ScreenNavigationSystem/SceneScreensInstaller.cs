namespace ScreenNavigationSystem
{
    public class SceneScreensInstaller : ProjectScreensInstaller
    {
        private void Awake()
        {
            ScreensController.SetSceneScreensInstaller(this);
        }
    }
}