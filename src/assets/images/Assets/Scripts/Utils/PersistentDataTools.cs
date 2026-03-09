#if UNITY_EDITOR
    using System.IO;
    using UnityEditor;
    using UnityEngine;

    namespace Utils
    {
        public static class PersistentDataTools
        {
            [MenuItem("Tools/Clear Persistent Data %#d")]
            public static void ClearPersistentData()
            {
                string path = Application.persistentDataPath;

                if (Directory.Exists(path))
                {
                    foreach (string file in Directory.GetFiles(path))
                    {
                        File.Delete(file);
                    }

                    foreach (string dir in Directory.GetDirectories(path))
                    {
                        Directory.Delete(dir, true);
                    }

                    Debug.Log("Cleared persistent data at: " + path);
                }
                else
                {
                    Debug.LogWarning("Persistent data path does not exist: " + path);
                }
            }
        }
    }
#endif