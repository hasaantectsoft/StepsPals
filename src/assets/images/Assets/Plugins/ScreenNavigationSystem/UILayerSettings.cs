using System;
using UnityEditor;
using UnityEngine;

namespace ScreenNavigationSystem
{
    [CreateAssetMenu(fileName = "UILayerSettingsSO", menuName = "SO/Settings/UILayerSettingsSO")]
    public class UILayerSettings : ScriptableObject
    {
        [field: SerializeField] public int ShowAnimationOrderShift { get; private set; } = 30;
        [field: SerializeField] public int HideAnimationOrderShift { get; private set; } = 25;
        [field: SerializeField] public string SortingLayerName { get; private set; } = "UI";

        [SerializeField] private LayerSortingOrder[] layerSortingOrders =
        {
            new("Root", 0),
            new("Others", 100),
            new("Popups", 200),
            new("Loading", 300),
            new("Toasts", 400)
        };

        private static UILayerSettings _layerSettings;

        public static UILayerSettings LayerSettings
        {
            get
            {
                if (_layerSettings == null)
                {
                    _layerSettings = Resources.Load<UILayerSettings>("UILayerSettingsSO");
                #if UNITY_EDITOR
                    if (_layerSettings == null)
                    {
                        _layerSettings = CreateInstance<UILayerSettings>();
                        AssetDatabase.CreateAsset(_layerSettings, "Assets/Resources/UILayerSettingsSO.asset");
                        AssetDatabase.SaveAssets();
                    }
                #endif
                }

                return _layerSettings;
            }
        }

        public int GetSortingOrderByLayer(int orderLayer)
        {
            if (layerSortingOrders.Length > orderLayer)
            {
                return layerSortingOrders[orderLayer].SortingOrder;
            }

            Debug.LogErrorFormat("Unknown order layer: {0}. Check your settings in UILayerSettings SO!", orderLayer);
            return 0;
        }

        public static string[] GetLayerNames()
        {
            string[] sortingLayerNames = new string[LayerSettings.layerSortingOrders.Length];
            for (int i = 0; i < LayerSettings.layerSortingOrders.Length; i++)
            {
                sortingLayerNames[i] = LayerSettings.layerSortingOrders[i].LayerName;
            }

            return sortingLayerNames;
        }
    }

    [Serializable]
    public class LayerSortingOrder
    {
        [field: SerializeField] public string LayerName { get; private set; }
        [field: SerializeField] public int SortingOrder { get; private set; }

        public LayerSortingOrder(string layerName, int sortingOrder)
        {
            LayerName = layerName;
            SortingOrder = sortingOrder;
        }
    }
}