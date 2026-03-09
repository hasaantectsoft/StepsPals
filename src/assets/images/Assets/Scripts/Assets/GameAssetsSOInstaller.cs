using Assets.SpriteAssets;
using ScreenNavigationSystem;
using Sounds;
using UnityEngine;
using Zenject;

namespace Assets
{
    [CreateAssetMenu(fileName = "GameAssetsSO", menuName = "SO/GameAssets/GameAssetsSO")]
    public class GameAssetsSOInstaller : ScriptableObjectInstaller<GameAssetsSOInstaller>
    {
        [SerializeField] private ScreenAssets screenAssetsSo;
        [SerializeField] private SpriteAssetsSO spriteAssetsSo;
        [SerializeField] private PrefabAssetsSO prefabAssetsSo;
        [SerializeField] private AudioAssetsSO audioAssetsSo;

        public override void InstallBindings()
        {
            Container.BindInstance(screenAssetsSo);
            Container.BindInstance(spriteAssetsSo);
            Container.BindInstance(prefabAssetsSo);
            Container.BindInstance(audioAssetsSo);
        }
    }
}