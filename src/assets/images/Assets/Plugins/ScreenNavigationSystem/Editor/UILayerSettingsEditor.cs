using UnityEditor;
using UnityEngine;

namespace ScreenNavigationSystem.Editor
{
    [CustomEditor(typeof(UILayerSettings))]
    public class UILayerSettingsEditor : UnityEditor.Editor
    {
        private SerializedProperty layerSortingOrders;
        private SerializedProperty showAnimationOrderShift;
        private SerializedProperty hideAnimationOrderShift;
        private SerializedProperty sortingLayerName;

        private void OnEnable()
        {
            layerSortingOrders = serializedObject.FindProperty("layerSortingOrders");
            showAnimationOrderShift = serializedObject.FindProperty("<ShowAnimationOrderShift>k__BackingField");
            hideAnimationOrderShift = serializedObject.FindProperty("<HideAnimationOrderShift>k__BackingField");
            sortingLayerName = serializedObject.FindProperty("<SortingLayerName>k__BackingField");
        }

        public override void OnInspectorGUI()
        {
            serializedObject.Update();

            EditorGUILayout.LabelField("Layer Sorting Orders", EditorStyles.boldLabel);
            for (int i = 0; i < layerSortingOrders.arraySize; i++)
            {
                SerializedProperty element = layerSortingOrders.GetArrayElementAtIndex(i);
                SerializedProperty layerName = element.FindPropertyRelative("<LayerName>k__BackingField");
                SerializedProperty sortingOrder = element.FindPropertyRelative("<SortingOrder>k__BackingField");

                EditorGUILayout.BeginHorizontal();
                if (i > 0)
                {
                    EditorGUILayout.LabelField($"Layer {i + 1}", GUILayout.Width(80));
                    sortingOrder.intValue = EditorGUILayout.IntField(sortingOrder.intValue, GUILayout.Width(50));
                    layerName.stringValue = EditorGUILayout.TextField(layerName.stringValue, GUILayout.Width(80),
                        GUILayout.ExpandWidth(true));
                    if (i > 1)
                    {
                        if (GUILayout.Button("X", GUILayout.Width(20)))
                        {
                            layerSortingOrders.DeleteArrayElementAtIndex(i);
                        }
                    }
                }
                else
                {
                    EditorGUILayout.LabelField($"Layer {i + 1}", GUILayout.Width(80));
                    sortingOrder.intValue = EditorGUILayout.IntField(sortingOrder.intValue, GUILayout.Width(50));
                    EditorGUILayout.LabelField(layerName.stringValue, GUILayout.Width(80), GUILayout.ExpandWidth(true));
                }

                EditorGUILayout.EndHorizontal();
            }

            if (GUILayout.Button("Add Sorting Layer"))
            {
                layerSortingOrders.InsertArrayElementAtIndex(layerSortingOrders.arraySize);
            }

            EditorGUILayout.Space();

            showAnimationOrderShift.intValue =
                EditorGUILayout.IntField("Show Animation Order Shift", showAnimationOrderShift.intValue);
            hideAnimationOrderShift.intValue =
                EditorGUILayout.IntField("Hide Animation Order Shift", hideAnimationOrderShift.intValue);

            EditorGUILayout.Space();

            sortingLayerName.stringValue =
                EditorGUILayout.TextField("Sorting Layer Name", sortingLayerName.stringValue);

            EditorGUILayout.Space();

            if (GUILayout.Button("Save Changes"))
            {
                serializedObject.ApplyModifiedProperties();
                EditorUtility.SetDirty(target);
                AssetDatabase.SaveAssets();
            }

            serializedObject.ApplyModifiedProperties();
        }
    }
}