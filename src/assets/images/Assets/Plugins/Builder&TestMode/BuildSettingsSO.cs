using UnityEditor;
using UnityEngine;

namespace Builder_TestMode
{
    public class BuildSettingsSO : ScriptableObject
    {
        [field: SerializeField] public BuildSettings BuildSettings { get; private set; }
        
        private static BuildSettingsSO _settingsSO;
        public static BuildSettingsSO SettingsSO
        {
            get
            {
                if (_settingsSO == null)
                {
                    _settingsSO = Resources.Load<BuildSettingsSO>("BuildSettingsSO");
#if UNITY_EDITOR
                    if (_settingsSO == null)
                    {
                        _settingsSO = CreateInstance<BuildSettingsSO>();
                        if (!AssetDatabase.IsValidFolder("Assets/Resources"))
                        {
                            AssetDatabase.CreateFolder("Assets", "Resources");
                        }
                        AssetDatabase.CreateAsset(_settingsSO, "Assets/Resources/BuildSettingsSO.asset");
                        AssetDatabase.SaveAssets();
                    }
#endif
                }
                return _settingsSO;
            }
        }

        public static bool IsTestMode => SettingsSO.BuildSettings.isTestMode;
        public static EnvironmentType Environment => SettingsSO.BuildSettings.environment;
    }
}
