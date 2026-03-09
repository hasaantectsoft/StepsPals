using System;
using UnityEngine;

namespace Builder_TestMode
{
    [Serializable]
    public class BuildSettings
    {
        [HideInInspector] public bool isTestMode;
        [HideInInspector] public EnvironmentType environment;
        [HideInInspector] public string versionInfo;
        [HideInInspector] public string commitShortHash;
        [HideInInspector] public string buildTime;

        [Tooltip("The build file will be signed with this name. If it is null or empty, then the build will be signed in capital letters from the project name.")]
        [field: SerializeField] public string ShortProjectName { private set; get; }

        [field: Header("Android Build Settings")]
        [Tooltip("Example: android_keystore/release.keystore")]
        [field: SerializeField] public string KeystoreFilePath { private set; get; }
        [field: SerializeField] public string KeystorePassword { private set; get; }
        [field: SerializeField] public string KeyAliasName { private set; get; }
        [field: SerializeField] public string KeyAliasPassword { private set; get; }

        [Tooltip("Path where the build will be saved. Example: Builds/Android/")]
        [field: SerializeField] public string BuildPath { private set; get; }
    }
}