using UnityEditor;
using UnityEngine;

namespace ScreenNavigationSystem.Editor
{
    [CustomEditor(typeof(UILayerConfigurator))]
    public class UILayerConfiguratorEditor : UnityEditor.Editor
    {
        private SerializedProperty layer;

        private void OnEnable()
        {
            layer = serializedObject.FindProperty("layer");
        }

        public override void OnInspectorGUI()
        {
            serializedObject.Update();

            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField("Sorting Layer", GUILayout.Width(80), GUILayout.ExpandWidth(true));
            layer.intValue = EditorGUILayout.Popup(layer.intValue, UILayerSettings.GetLayerNames(), GUILayout.Width(80),
                GUILayout.ExpandWidth(true));
            EditorGUILayout.EndHorizontal();

            serializedObject.ApplyModifiedProperties();
        }
    }
}