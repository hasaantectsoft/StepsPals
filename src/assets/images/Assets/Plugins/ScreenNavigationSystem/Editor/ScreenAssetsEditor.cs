using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

namespace ScreenNavigationSystem.Editor
{
    [CustomEditor(typeof(ScreenAssets))]
    public class ScreenAssetsEditor : UnityEditor.Editor
    {
        public override void OnInspectorGUI()
        {
            if (GUILayout.Button("Find All Screens with ScreenPresenters"))
            {
                FillScreenPresentersList();
            }

            DrawDefaultInspector();
        }

        private void FillScreenPresentersList()
        {
            ScreenAssets screenAssets = (ScreenAssets)target;

            string[] allPrefabs = AssetDatabase.FindAssets("t:Prefab");

            List<ScreenPresenter> screenPresenters = new();

            foreach (string guid in allPrefabs)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);

                if (prefab != null)
                {
                    if (prefab.TryGetComponent(out ScreenPresenter presenter))
                    {
                        screenPresenters.Add(presenter);
                    }
                }
            }

            screenAssets.UpdateScreenList(screenPresenters);
            EditorUtility.SetDirty(screenAssets);
            AssetDatabase.SaveAssets();
        }
    }
}