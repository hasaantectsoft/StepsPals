using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;
using Debug = UnityEngine.Debug;

namespace Builder_TestMode
{
    public class Builder : IPreprocessBuildWithReport, IPostprocessBuildWithReport
    {
        private const string TestModePath = "Builder/Test Mode";
        private const string RunOnDevicePath = "Builder/Auto Run On Device";
        private const string EnvironmentPath = "Builder/";
        private const string LocalHostPath = EnvironmentPath + "LocalHost";
        private const string DevPath = EnvironmentPath + "Dev";
        private const string StagePath = EnvironmentPath + "Stage";
        private const string ProdPath = EnvironmentPath + "Prod";

        private static string _buildPath;
        private static AndroidBuildResult _fileType;
        private static bool _withObb;

        private static bool IsTestMode
        {
            get => BuildSettingsSO.SettingsSO.BuildSettings.isTestMode;
            set
            {
                BuildSettingsSO.SettingsSO.BuildSettings.isTestMode = value;
                EditorUtility.SetDirty(BuildSettingsSO.SettingsSO);
                AssetDatabase.SaveAssets();
            }
        }
        
        private static bool RunOnDevice
        {
            get => EditorPrefs.GetBool(RunOnDevicePath, false);
            set => EditorPrefs.SetBool(RunOnDevicePath, value);
        }

        private static EnvironmentType Environment
        {
            get => BuildSettingsSO.SettingsSO.BuildSettings.environment;
            set
            {
                BuildSettingsSO.SettingsSO.BuildSettings.environment = value;
                EditorUtility.SetDirty(BuildSettingsSO.SettingsSO);
                AssetDatabase.SaveAssets();
            }
        }

        [MenuItem(TestModePath, priority = 1)]
        private static void TestMode() {
            IsTestMode = !IsTestMode;
        }

        [MenuItem(TestModePath, true)]
        private static bool TestModeValidate() {
            Menu.SetChecked(TestModePath, IsTestMode);
            return true;
        }
        
        [MenuItem(LocalHostPath, priority = 50)]
        public static void LocalHostEnvironment()
        {
            Environment = EnvironmentType.LocalHost;
        }
        
        [MenuItem(LocalHostPath, true)]
        private static bool LocalHostEnvironmentValidate() {
            Menu.SetChecked(LocalHostPath, Environment == EnvironmentType.LocalHost);
            return true;
        }
        
        [MenuItem(DevPath, priority = 51)]
        public static void DevEnvironment()
        {
            Environment = EnvironmentType.Dev;
        }
        
        [MenuItem(DevPath, true)]
        private static bool DevEnvironmentValidate() {
            Menu.SetChecked(DevPath, Environment == EnvironmentType.Dev);
            return true;
        }
        
        [MenuItem(StagePath, priority = 52)]
        public static void StageEnvironment()
        {
            Environment = EnvironmentType.Stage;
        }
        
        [MenuItem(StagePath, true)]
        private static bool StageEnvironmentValidate() {
            Menu.SetChecked(StagePath, Environment == EnvironmentType.Stage);
            return true;
        }
        
        [MenuItem(ProdPath, priority = 53)]
        public static void ProdEnvironment()
        {
            Environment = EnvironmentType.Prod;
        }
        
        [MenuItem(ProdPath, true)]
        private static bool ProdEnvironmentValidate() {
            Menu.SetChecked(ProdPath, Environment == EnvironmentType.Prod);
            return true;
        }
        
        [MenuItem(RunOnDevicePath, priority = 99)]
        private static void AutoRunOnDevice() {
            RunOnDevice = !RunOnDevice;
        }

        [MenuItem(RunOnDevicePath, true)]
        private static bool AutoRunOnDeviceValidate() {
            Menu.SetChecked(RunOnDevicePath, RunOnDevice);
            return true;
        }
        
        [MenuItem("Builder/Build Android (apk)")]
        public static void BuildAndroidApr()
        {
            _fileType = AndroidBuildResult.apk;
            _withObb = false;
            BuildAndroid();
        }

        [MenuItem("Builder/Build Android (aab)")]
        public static void BuildAndroidAab()
        {
            _fileType = AndroidBuildResult.aab;
            _withObb = false;
            BuildAndroid();
        }
        
        [MenuItem("Builder/Build Android (apk + obb)")]
        public static void BuildAndroidApkPlusObb()
        {
            _fileType = AndroidBuildResult.apk;
            _withObb = true;
            BuildAndroid();
        }
        
        [MenuItem("Builder/Build Android (aab + obb)")]
        public static void BuildAndroidAabPlusObb()
        {
            _fileType = AndroidBuildResult.aab;
            _withObb = true;
            BuildAndroid();
        }

        private static void BuildAndroid()
        {
            BuildReport report = BuildPipeline.BuildPlayer(PrepareBuildOptions());
            if (report.summary.result != BuildResult.Succeeded)
            {
                throw new Exception("Build failed with result: " + report.summary.result);
            }
        }

        private static BuildPlayerOptions PrepareBuildOptions()
        {
            BuildSettings buildSettings = BuildSettingsSO.SettingsSO.BuildSettings;
            if (string.IsNullOrEmpty(buildSettings.BuildPath) 
               || string.IsNullOrEmpty(buildSettings.KeystoreFilePath)
               || string.IsNullOrEmpty(buildSettings.KeystorePassword)
               || string.IsNullOrEmpty(buildSettings.KeyAliasName)
               || string.IsNullOrEmpty(buildSettings.KeyAliasPassword))
            {
                Debug.LogError("Some of Build Settings field is empty! Please check BuildSettingsSO file in Resources folder.");
            }
            
            PlayerSettings.Android.keystoreName = buildSettings.KeystoreFilePath;
            PlayerSettings.Android.keystorePass = buildSettings.KeystorePassword;
            PlayerSettings.Android.keyaliasName = buildSettings.KeyAliasName;
            PlayerSettings.Android.keyaliasPass = buildSettings.KeyAliasPassword;
            EditorUserBuildSettings.buildAppBundle = _fileType == AndroidBuildResult.aab;
            PlayerSettings.Android.splitApplicationBinary = _withObb;
            
            string projectName;
            if (string.IsNullOrEmpty(buildSettings.ShortProjectName))
            {
                Regex rg = new Regex(@"\p{Lu}");
                MatchCollection matchCollection = rg.Matches(Application.productName);
                projectName = "";
                foreach (var some in matchCollection.ToArray())
                {
                    projectName += some.ToString();
                }

                if (string.IsNullOrEmpty(projectName)) projectName = "NoName";
            }
            else
            {
                projectName = buildSettings.ShortProjectName;
            }
            
            _buildPath = buildSettings.BuildPath + projectName;
            BuildPlayerOptions playerOptions = new BuildPlayerOptions
            {
                target = BuildTarget.Android,
                locationPathName = $"{_buildPath}.{_fileType}",
                scenes = GetActiveScenesForBuild().ToArray(),
                options = (RunOnDevice ? BuildOptions.WaitForPlayerConnection | BuildOptions.AutoRunPlayer : BuildOptions.None) |
                          (IsTestMode ? BuildOptions.CompressWithLz4 : BuildOptions.CompressWithLz4HC)
                
            };
            
            return playerOptions;
        }

        private static string VersionInfo =>
            $"_{Application.version}({PlayerSettings.Android.bundleVersionCode})_{BuildSettingsSO.SettingsSO.BuildSettings.environment}{(BuildSettingsSO.SettingsSO.BuildSettings.isTestMode ? "_Test" : "")}_{CommitShortHash()}";
        
        private static string CommitShortHash()
        {
            string result = RunGitCommand("rev-parse --short --verify HEAD");
            result = string.Join("", result.Split(default(string[]), StringSplitOptions.RemoveEmptyEntries));
            return result;
        }
        
        private static string RunGitCommand(string gitCommand)
        {
            ProcessStartInfo processInfo = new("git", @gitCommand)
            {
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

            Process process = new()
            {
                StartInfo = processInfo
            };

            try
            {
                process.Start();
            }
            catch (Exception error)
            {
                Debug.LogError(
                    $"Git is not set-up correctly, required to be on PATH, and to be a git project. Error: {error.Message}");
            }

            string output = process.StandardOutput.ReadToEnd();
            string errorOutput = process.StandardError.ReadToEnd();

            process.WaitForExit();
            process.Close();

            if (output.Contains("fatal") || output is "")
            {
                Debug.LogError("Command: git " + @gitCommand + " Failed\n" + output + errorOutput);
            }

            if (errorOutput != "")
            {
                Debug.LogError("Git Error: " + errorOutput);
            }

            return output;
        }

        private static List<string> GetActiveScenesForBuild()
        {
            List<string> scenes = new List<string>();
            foreach (EditorBuildSettingsScene scene in EditorBuildSettings.scenes)
            {
                if (scene.enabled)
                    scenes.Add(scene.path);
            }

            return scenes;
        }
        
        public int callbackOrder { get; }

        public void OnPreprocessBuild(BuildReport report)
        {
            BuildTarget platform = report.summary.platform;
            int buildNumber = platform == BuildTarget.Android
                ? PlayerSettings.Android.bundleVersionCode
                : int.Parse(PlayerSettings.iOS.buildNumber);
            
            FirebaseAndBuildNumberCheck();
            string version = $"{Application.version}({buildNumber})";
            DisplayBuildVersionDialog();
            SetBuildInfoInBuild();
            
            
            void FirebaseAndBuildNumberCheck()
            {
                string firebaseFolderPath = Application.dataPath + "/Firebase/Plugins/";
                if (File.Exists(firebaseFolderPath + "Firebase.App.dll"))
                {
                    if (!File.Exists(firebaseFolderPath + "Firebase.Crashlytics.dll"))
                    {
                        throw new BuildFailedException(
                            "You have integrated the Firebase plugin, but the Crashlytics is not found. You must add it to the project!");
                    }
                
                    if (IsTestMode && buildNumber % 2f == 0)
                    {
                        throw new BuildFailedException(
                            $"Build number = {buildNumber}. You cannot create a test build with an even build number if your project has crashlitics!");
                    }

                    if (!IsTestMode && buildNumber % 2f != 0)
                    {
                        throw new BuildFailedException(
                            $"Build number = {buildNumber}. You cannot create a release build with an odd build number if your project has crashlitics!");
                    }
                }
            }
            
            void DisplayBuildVersionDialog()
            {
                string buildType = IsTestMode ? "TEST" : "RELEASE";
                if (!EditorUtility.DisplayDialog($"{buildType} build with {Environment} env." +
                                                 (platform == BuildTarget.Android ? $"({_fileType}{(_withObb ? " + obb" : "")})" : ""),
                        $"Are you sure you want to create {buildType} build with {Environment} environment and version {version}?", "Yes", "No"))
                {
                    throw new BuildFailedException("Build was canceled by the user.");
                }
            }

            void SetBuildInfoInBuild()
            {
                BuildSettings buildSettings = BuildSettingsSO.SettingsSO.BuildSettings;
                buildSettings.commitShortHash = CommitShortHash();
                buildSettings.versionInfo = version;
                buildSettings.buildTime = DateTime.UtcNow.ToString("dd.MM.yy HH:mm:ss");
            }
        }
        
        public void OnPostprocessBuild(BuildReport report)
        {
            if (report.summary.platform != BuildTarget.Android) return;
            string originalBuildPath = $"{_buildPath}.{_fileType}";
            string newBuildPath = $"{_buildPath}{VersionInfo}.{_fileType}";

            CopyAndRenameFile(originalBuildPath, newBuildPath);
            if(_withObb) CopyAndRenameFile($"{_buildPath}.main.obb", $"{_buildPath}{VersionInfo}.main.obb");
            Debug.Log($"Build {newBuildPath} succeeded");
            
            string file = new DirectoryInfo(newBuildPath).FullName;
            EditorUtility.RevealInFinder(file);
        }

        private void CopyAndRenameFile(string originalBuildPath, string newBuildPath)
        {
            if (!File.Exists(originalBuildPath)) return;
            if (File.Exists(newBuildPath)) File.Delete(newBuildPath);
            File.Copy(originalBuildPath, newBuildPath);
        }
    }

    public enum AndroidBuildResult
    {
        apk,
        aab
    }
}