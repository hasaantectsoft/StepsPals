#if UNITY_IOS
    using System.IO;
    using UnityEditor;
    using UnityEditor.Callbacks;
    using UnityEditor.iOS.Xcode;

    namespace Editor
    {
        public class AddCapabilitiesPostProcess
        {
            private const string HealthShareUsageDescription = "StepPals uses HealthKit to track your steps.";
            private const string HealthUpdateUsageDescription = "StepPals updates health data to track your steps.";
            private const string ClinicalUsageDescription = "StepPals only requests clinical data that we need.";

            [PostProcessBuild]
            public static void OnPostProcessBuild(BuildTarget buildTarget, string buildPath)
            {
                if (buildTarget != BuildTarget.iOS) return;
                var projectPath = PBXProject.GetPBXProjectPath(buildPath);
                ChangeXcodePlist(buildPath);
                PBXProject pbxProject = new PBXProject();
                pbxProject.ReadFromString(File.ReadAllText(projectPath));
                string targetGuid = pbxProject.GetUnityMainTargetGuid();
                pbxProject.AddFrameworkToProject(targetGuid, "UserNotifications.framework", false);
                File.WriteAllText(projectPath, pbxProject.WriteToString());
                var capManager = new ProjectCapabilityManager(projectPath, "ios.entitlements", "Unity-iPhone");
                capManager.AddHealthKit();
                capManager.AddSignInWithApple();
                capManager.WriteToFile();
            }

            private static void ChangeXcodePlist(string pathToBuiltProject)
            {
                // Get plist
                string plistPath = Path.Combine(pathToBuiltProject, "Info.plist");
                PlistDocument plist = new();
                plist.ReadFromString(File.ReadAllText(plistPath));
                // Get root
                PlistElementDict rootDict = plist.root;
                rootDict.SetString("NSHealthShareUsageDescription", HealthShareUsageDescription);
                rootDict.SetString("NSHealthUpdateUsageDescription", HealthUpdateUsageDescription);
                rootDict.SetString("NSHealthClinicalHealthRecordsShareUsageDescription", ClinicalUsageDescription);
                // Write to file
                File.WriteAllText(plistPath, plist.WriteToString());
            }
        }
    }
#endif