using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;
using UnityEngine;

namespace Editor
{
    /// <summary>
    /// Post-build processor to integrate StepPals widgets and watch app into Unity iOS build
    /// </summary>
    public class StepPalsPostBuildProcessor
    {
        private const string MAIN_APP_BUNDLE_ID = "com.benleavitt.steppals";
        private const string APP_GROUP_ID = "group.com.benleavitt.steppals.shared";
        private const string IOS_WIDGET_TARGET_NAME = "StepPalsPhoneWidget";
        private const string WATCH_APP_TARGET_NAME = "StepPalsWatchApp";
        private const string WATCH_WIDGET_TARGET_NAME = "StepPalsWatchWidget";
        
        [PostProcessBuild(999)]
        public static void OnPostProcessBuild(BuildTarget buildTarget, string pathToBuiltProject)
        {
            if (buildTarget != BuildTarget.iOS)
                return;
            
            Debug.Log("🚀 StepPals: Starting post-build processing...");
            
            try
            {
                string projectPath = PBXProject.GetPBXProjectPath(pathToBuiltProject);
                PBXProject project = new PBXProject();
                project.ReadFromFile(projectPath);
                
                // Get main target
#if UNITY_2020_3_OR_NEWER
                string mainTargetGuid = project.GetUnityMainTargetGuid();
#else
                string mainTargetGuid = project.TargetGuidByName(PBXProject.GetUnityTargetName());
#endif
                string unityFrameworkTargetGuid = project.GetUnityFrameworkTargetGuid();
                
                // Configure entitlements (includes AddCapability call)
                ConfigureMainEntitlements(project, mainTargetGuid, pathToBuiltProject);
                
                // Configure main app
                ConfigureMainApp(project, mainTargetGuid, pathToBuiltProject);
                
                // Add frameworks
                AddFrameworks(project, mainTargetGuid, unityFrameworkTargetGuid);
                
                // Configure Info.plist
                ConfigureInfoPlist(pathToBuiltProject);

                // Configure iOS Widget
                string phoneWidgetTargetGuid = ConfigureiOSWidget(project, mainTargetGuid, pathToBuiltProject);

                // Configure Watch App
                string watchAppTargetGuid = ConfigureWatchApp(project, mainTargetGuid, pathToBuiltProject);

                // Configure Watch OS Widget
                string watchWidgetTargetGuid = ConfigureWatchOSWidget(project, watchAppTargetGuid, pathToBuiltProject);

                // Copy Swift files
                string mainSourcesPhase = project.AddSourcesBuildPhase(mainTargetGuid);
                string phoneWidgetSourcesPhase = project.GetSourcesBuildPhaseByTarget(phoneWidgetTargetGuid);
                string watchAppSourcesPhase = project.GetSourcesBuildPhaseByTarget(watchAppTargetGuid);
                string watchWidgetSourcesPhase = project.GetSourcesBuildPhaseByTarget(watchWidgetTargetGuid);

                // Copy Swift files from Shared folder (now under .../StepPals/Shared)
                string sharedSource = Path.Combine(Application.dataPath, "StepPals", "Shared");
                string sharedDest = Path.Combine(pathToBuiltProject, "Shared");
                Directory.CreateDirectory(sharedDest);

                foreach (var swift in Directory.GetFiles(sharedSource, "*.swift", SearchOption.TopDirectoryOnly))
                {
                    // Copy each Swift file into build's Shared folder
                    string fileName = Path.GetFileName(swift);
                    string dest = Path.Combine(sharedDest, fileName);

                    File.Copy(swift, dest, true);

                    // Set up file path relative to build project (Shared/filename.swift)
                    string rel = Path.Combine("Shared", fileName).Replace('\\', '/'); // Use forward slashes for Xcode
                    string guid = project.AddFile(rel, rel, PBXSourceTree.Source);

                    project.AddFileToBuildSection(mainTargetGuid, mainSourcesPhase, guid);
                    project.AddFileToBuildSection(phoneWidgetTargetGuid, phoneWidgetSourcesPhase, guid);
                    project.AddFileToBuildSection(watchAppTargetGuid, watchAppSourcesPhase, guid);
                    project.AddFileToBuildSection(watchWidgetTargetGuid, watchWidgetSourcesPhase, guid);
                    
                    Debug.Log($"✅ StepPals: Added Swift file to build: {fileName} (from {swift})");
                }

                // Add WatchConnectivityManager.swift from the WatchApp folder to the watch widget target
                string watchConnectivityManagerPath = Path.Combine(WATCH_WIDGET_TARGET_NAME, "WatchConnectivityManager.swift");
                string watchConnectivityManagerSource = Path.Combine(pathToBuiltProject, WATCH_APP_TARGET_NAME, "WatchConnectivityManager.swift");
                string watchConnectivityManagerDest = Path.Combine(pathToBuiltProject, watchConnectivityManagerPath);
                
                // Remove widget/watch Swift files from UnityFramework (they cause @main conflicts)
                RemoveExtensionFilesFromUnityFramework(project, unityFrameworkTargetGuid);

                // // Configure UnityFramework
                // project.SetBuildProperty(unityFrameworkTargetGuid, "ARCHS", "$(ARCHS_STANDARD)");
                // project.SetBuildProperty(unityFrameworkTargetGuid, "SDKROOT", "iphoneos");
                // project.SetBuildProperty(unityFrameworkTargetGuid, "SUPPORTED_PLATFORMS", "iphoneos iphonesimulator");
                project.SetBuildProperty(unityFrameworkTargetGuid, "SKIP_INSTALL", "YES");
                // project.AddBuildProperty(unityFrameworkTargetGuid, "OTHER_LDFLAGS", "$(inherited) -weak_framework CoreMotion -weak-lSystem $(OTHER_LDFLAGS_FRAMEWORK) -Wl,-exported_symbols_list,Libraries/il2cpp-symbols.txt $CONFIGURATION_BUILD_DIR/il2cpp.a -ObjC");

                // Delete Data/Raw/StepPalsUnityBridge folder (cleanup)
                DeleteRawBridgeFolder(pathToBuiltProject);
                
                // Write changes
                project.WriteToFile(projectPath);
                
                Debug.Log("✅ StepPals: Post-build processing completed successfully!");
            }
            catch (System.Exception e)
            {
                Debug.LogError($"❌ StepPals: Post-build processing failed: {e.Message}");
                Debug.LogException(e);
            }
        }
                
        private static void ConfigureMainEntitlements(PBXProject project, string targetGuid, string buildPath)
        {
            Debug.Log("🔐 StepPals: Configuring entitlements...");
            
            string entitlementsPath = Path.Combine(buildPath, "StepPals.entitlements");
            
            // Create or read entitlements file
            PlistDocument entitlements = new PlistDocument();
            
            if (File.Exists(entitlementsPath))
            {
                entitlements.ReadFromFile(entitlementsPath);
            }
            
            PlistElementDict root = entitlements.root;
            
            // Add App Groups
            PlistElementArray appGroups = root.CreateArray("com.apple.security.application-groups");
            appGroups.AddString(APP_GROUP_ID);
            
            // Add HealthKit entitlement
            root.SetBoolean("com.apple.developer.healthkit", true);
            root.SetBoolean("com.apple.developer.healthkit.background-delivery", true);
            
            // Write entitlements
            Directory.CreateDirectory(Path.GetDirectoryName(entitlementsPath));
            entitlements.WriteToFile(entitlementsPath);
            
            // Add entitlements to project
            project.SetBuildProperty(targetGuid, "CODE_SIGN_ENTITLEMENTS", "StepPals.entitlements");
            
            // Add App Group capability (must be called after entitlements file is created)
            project.AddCapability(targetGuid, PBXCapabilityType.AppGroups, entitlementsPath);
            
            Debug.Log("✅ StepPals: Entitlements configured");
        }
        
        private static void ConfigureMainApp(PBXProject project, string targetGuid, string buildPath)
        {
            Debug.Log("📱 StepPals: Configuring main app...");

            project.SetBuildProperty(targetGuid, "ARCHS", "$(ARCHS_STANDARD)");
            project.SetBuildProperty(targetGuid, "SDKROOT", "iphoneos");
            project.SetBuildProperty(targetGuid, "SUPPORTED_PLATFORMS", "iphoneos iphonesimulator");
            project.SetBuildProperty(targetGuid, "CFBundleName", "${PRODUCT_NAME}");
            project.SetBuildProperty(targetGuid, "CFBundleDisplayName", "${PRODUCT_NAME}");
            project.SetBuildProperty(targetGuid, "PRODUCT_MODULE_NAME", "StepPals");
            project.SetBuildProperty(targetGuid, "MARKETING_VERSION", "1.0.11");
            project.SetBuildProperty(targetGuid, "CURRENT_PROJECT_VERSION", PlayerSettings.iOS.buildNumber);
            project.SetBuildProperty(targetGuid, "SWIFT_VERSION", "5.0");
            project.SetBuildProperty(targetGuid, "IPHONEOS_DEPLOYMENT_TARGET", "16.0");
            project.SetBuildProperty(targetGuid, "WATCHOS_DEPLOYMENT_TARGET", "9.0");
            project.SetBuildProperty(targetGuid, "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES", "YES");
            project.SetBuildProperty(targetGuid, "CLANG_ENABLE_MODULES", "YES");
            project.SetBuildProperty(targetGuid, "SKIP_INSTALL", "NO");
            
            Debug.Log("✅ StepPals: Main app configured");
        }
        
        private static void AddFrameworks(PBXProject project, string mainTargetGuid, string frameworkTargetGuid)
        {
            Debug.Log("📦 StepPals: Adding frameworks...");
            
            // Add HealthKit
            project.AddFrameworkToProject(frameworkTargetGuid, "HealthKit.framework", false);
            
            // Add WatchConnectivity
            project.AddFrameworkToProject(frameworkTargetGuid, "WatchConnectivity.framework", false);
            
            // Add BackgroundTasks (weak link - iOS 13+, needed for BGTaskScheduler)
            project.AddFrameworkToProject(mainTargetGuid, "BackgroundTasks.framework", true); // weak link
            project.AddFrameworkToProject(frameworkTargetGuid, "BackgroundTasks.framework", true); // weak link
            
            // Add WidgetKit to main app target (strong link for WidgetCenter API)
            // WidgetKit needs to be available at runtime for WidgetCenter to work
            project.AddFrameworkToProject(mainTargetGuid, "WidgetKit.framework", false); // strong link

            // Add WidgetKit (weak link for UnityFramework, but we need it available)
            project.AddFrameworkToProject(frameworkTargetGuid, "WidgetKit.framework", true); // weak link            
            
            // Add SwiftUI
            project.AddFrameworkToProject(frameworkTargetGuid, "SwiftUI.framework", true); // weak link
            
            Debug.Log("✅ StepPals: Frameworks added");
        }
        
        private static void ConfigureInfoPlist(string buildPath)
        {
            Debug.Log("ℹ️ StepPals: Configuring Info.plist...");
            
            string plistPath = Path.Combine(buildPath, "Info.plist");
            PlistDocument plist = new PlistDocument();
            plist.ReadFromFile(plistPath);
            
            PlistElementDict root = plist.root;

            root.SetString("WKAppBundleIdentifier", MAIN_APP_BUNDLE_ID + "." + WATCH_APP_TARGET_NAME);
            root.SetString("CFBundlePackageType", "APPL");

            // Add HealthKit usage description
            root.SetString("NSHealthShareUsageDescription", 
                "StepPals needs access to your step count to track your pet's health and update widgets.");
            
            root.SetString("NSHealthUpdateUsageDescription", 
                "StepPals needs to update health data for accurate step tracking.");
            
            // Note: UIRequiredDeviceCapabilities removed to avoid ITMS-90109 warning
            // HealthKit will still work via entitlements on supported devices
            if (root.values.TryGetValue("UIRequiredDeviceCapabilities", out PlistElement requiredCaps))
            {
                if (requiredCaps is PlistElementArray capsArray)
                {
                    var caps = new List<string>();
                    foreach (var cap in capsArray.values)
                    {
                        if (cap is PlistElementString s) caps.Add(s.value);
                    }

                    if (caps.Contains("healthkit"))
                    {
                        Debug.Log("ℹ️ StepPals: Removing 'healthkit' from UIRequiredDeviceCapabilities");
                        // Recreate array without healthkit
                        var newArray = root.CreateArray("UIRequiredDeviceCapabilities");
                        foreach (var cap in caps)
                        {
                            if (cap != "healthkit") newArray.AddString(cap);
                        }
                    }
                }
            }
            
            // Add background modes if needed
            PlistElementArray backgroundModes = root.CreateArray("UIBackgroundModes");
            backgroundModes.AddString("fetch");
            backgroundModes.AddString("processing");
            
            // Add BGTaskScheduler permitted identifiers when using background processing
            PlistElementArray bgTaskIds = root.CreateArray("BGTaskSchedulerPermittedIdentifiers");
            bgTaskIds.AddString("com.benleavitt.steppals.backgroundtask");

            root.SetBoolean("ITSAppUsesNonExemptEncryption", false);
            
            // Write back
            plist.WriteToFile(plistPath);
            
            Debug.Log("✅ StepPals: Info.plist configured");
        }

        // ==========================
        // iOS Widget
        // ==========================
        private static string ConfigureiOSWidget(PBXProject project, string mainTargetGuid, string buildPath)
        {
            string phoneWidgetTargetGuid = project.TargetGuidByName(IOS_WIDGET_TARGET_NAME);
            if (string.IsNullOrEmpty(phoneWidgetTargetGuid))
                phoneWidgetTargetGuid = project.AddTarget(IOS_WIDGET_TARGET_NAME, "appex", "com.apple.product-type.app-extension");

            string bundleId = MAIN_APP_BUNDLE_ID + "." + IOS_WIDGET_TARGET_NAME;
            string unitySource = Path.Combine(Application.dataPath, "StepPals", IOS_WIDGET_TARGET_NAME);
            string destFolder = Path.Combine(buildPath, IOS_WIDGET_TARGET_NAME);
            string entitlementsFile = IOS_WIDGET_TARGET_NAME + ".entitlements";

            Directory.CreateDirectory(destFolder);
            
            project.SetBuildProperty(phoneWidgetTargetGuid, "CFBundleName", "${PRODUCT_NAME}");
            project.SetBuildProperty(phoneWidgetTargetGuid, "CFBundleDisplayName", "${PRODUCT_NAME}");
            project.SetBuildProperty(phoneWidgetTargetGuid, "CFBundleExecutable", "${EXECUTABLE_NAME}");
            project.SetBuildProperty(phoneWidgetTargetGuid, "ARCHS", "$(ARCHS_STANDARD)");
            project.SetBuildProperty(phoneWidgetTargetGuid, "SDKROOT", "iphoneos");
            project.SetBuildProperty(phoneWidgetTargetGuid, "SUPPORTED_PLATFORMS", "iphoneos iphonesimulator");
            project.SetBuildProperty(phoneWidgetTargetGuid, "PRODUCT_BUNDLE_IDENTIFIER", bundleId);
            project.SetBuildProperty(phoneWidgetTargetGuid, "PRODUCT_NAME", "StepPals");
            project.SetBuildProperty(phoneWidgetTargetGuid, "PRODUCT_MODULE_NAME", IOS_WIDGET_TARGET_NAME);
            project.SetBuildProperty(phoneWidgetTargetGuid, "MARKETING_VERSION", "1.0.11");
            project.SetBuildProperty(phoneWidgetTargetGuid, "CURRENT_PROJECT_VERSION", PlayerSettings.iOS.buildNumber);
            project.SetBuildProperty(phoneWidgetTargetGuid, "TARGETED_DEVICE_FAMILY", "1");
            project.SetBuildProperty(phoneWidgetTargetGuid, "IPHONEOS_DEPLOYMENT_TARGET", "16.0");
            project.SetBuildProperty(phoneWidgetTargetGuid, "WATCHOS_DEPLOYMENT_TARGET", "9.0");
            project.SetBuildProperty(phoneWidgetTargetGuid, "SWIFT_VERSION", "5.0");
            project.SetBuildProperty(phoneWidgetTargetGuid, "SWIFT_OPTIMIZATION_LEVEL", "-Onone");
            project.SetBuildProperty(phoneWidgetTargetGuid, "SKIP_INSTALL", "YES");
            project.SetBuildProperty(phoneWidgetTargetGuid, "CODE_SIGN_STYLE", "Automatic");
            project.SetBuildProperty(phoneWidgetTargetGuid, "INFOPLIST_FILE", Path.Combine(IOS_WIDGET_TARGET_NAME, "Info.plist"));
            project.SetBuildProperty(phoneWidgetTargetGuid, "CODE_SIGN_ENTITLEMENTS", Path.Combine(IOS_WIDGET_TARGET_NAME, entitlementsFile));
            project.SetBuildProperty(phoneWidgetTargetGuid, "ASSETCATALOG_COMPILER_APPICON_NAME", "AppIcon");
            project.AddBuildProperty(phoneWidgetTargetGuid, "OTHER_LDFLAGS", "-framework SwiftUI -framework WidgetKit"); // Link SwiftUI + WidgetKit

            string teamId = PlayerSettings.iOS.appleDeveloperTeamID;
            if (!string.IsNullOrEmpty(teamId)) project.SetBuildProperty(phoneWidgetTargetGuid, "DEVELOPMENT_TEAM", teamId);

            // Embed source files and assets
            string srcPhase = project.AddSourcesBuildPhase(phoneWidgetTargetGuid);
            string resPhase = project.AddResourcesBuildPhase(phoneWidgetTargetGuid);

            // Copy Assets.xcassets
            string assetSrc = Path.Combine(unitySource, "Assets.xcassets");
            string assetDst = Path.Combine(destFolder, "Assets.xcassets");
            if (Directory.Exists(assetSrc))
            {
                CopyDirectory(assetSrc, assetDst);
                string rel = Path.Combine(IOS_WIDGET_TARGET_NAME, "Assets.xcassets");
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(phoneWidgetTargetGuid, resPhase, guid);
            }

            // Copy Info.plist
            string infoPlistSrc = Path.Combine(unitySource, "Info.plist");
            string infoPlistDst = Path.Combine(destFolder, "Info.plist");
            if (File.Exists(infoPlistSrc))
            {
                File.Copy(infoPlistSrc, infoPlistDst, true);
                string rel = Path.Combine(IOS_WIDGET_TARGET_NAME, "Info.plist");
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
            }

            // Copy entitlements
            string entitlementsSrc = Path.Combine(unitySource, entitlementsFile);
            string entitlementsDst = Path.Combine(destFolder, entitlementsFile);
            if (File.Exists(entitlementsSrc))
            {
                File.Copy(entitlementsSrc, entitlementsDst, true);
                string rel = Path.Combine(IOS_WIDGET_TARGET_NAME, entitlementsFile);
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
            }

            // Copy ttf files
            foreach (var ttf in Directory.GetFiles(unitySource, "*.ttf", SearchOption.AllDirectories))
            {
                // Get relative path to preserve directory structure
                string relative = Path.GetRelativePath(unitySource, ttf);
                string dest = Path.Combine(destFolder, relative);
                
                // Create directory if needed
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                
                File.Copy(ttf, dest, true);
                string rel = Path.Combine(IOS_WIDGET_TARGET_NAME, relative).Replace('\\', '/'); // Use forward slashes for Xcode
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(phoneWidgetTargetGuid, resPhase, guid);
            }

            // Copy Swift files
            foreach (var swift in Directory.GetFiles(unitySource, "*.swift", SearchOption.AllDirectories))
            {
                // Get relative path to preserve directory structure
                string relative = Path.GetRelativePath(unitySource, swift);
                string dest = Path.Combine(destFolder, relative);
                
                // Create directory if needed
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                
                File.Copy(swift, dest, true);
                string rel = Path.Combine(IOS_WIDGET_TARGET_NAME, relative).Replace('\\', '/'); // Use forward slashes for Xcode
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(phoneWidgetTargetGuid, srcPhase, guid);
            }

            Debug.Log($"[iOS Build Post-Processor] ✓ Configured iOS Widget: {IOS_WIDGET_TARGET_NAME}");

            // Add widget as target dependency
            project.AddTargetDependency(mainTargetGuid, phoneWidgetTargetGuid);

            // Embed in iPhone app
            EmbedExtension(project, mainTargetGuid, phoneWidgetTargetGuid, "Embed Foundation Extensions");

            return phoneWidgetTargetGuid;
        }

        // ==========================
        // Watch App
        // ==========================
        private static string ConfigureWatchApp(PBXProject project, string mainTargetGuid, string buildPath)
        {
            string watchAppTargetGuid = project.TargetGuidByName(WATCH_APP_TARGET_NAME);
            if (string.IsNullOrEmpty(watchAppTargetGuid))
                watchAppTargetGuid = project.AddTarget(WATCH_APP_TARGET_NAME, "app", "com.apple.product-type.application");

            string bundleId = MAIN_APP_BUNDLE_ID + "." + WATCH_APP_TARGET_NAME;
            string unitySource = Path.Combine(Application.dataPath, "StepPals", WATCH_APP_TARGET_NAME);
            string destFolder = Path.Combine(buildPath, WATCH_APP_TARGET_NAME);
            string entitlementsFile = WATCH_APP_TARGET_NAME + ".entitlements";

            Directory.CreateDirectory(destFolder);
            
            project.SetBuildProperty(watchAppTargetGuid, "CFBundleName", "${PRODUCT_NAME}");
            project.SetBuildProperty(watchAppTargetGuid, "CFBundleDisplayName", "${PRODUCT_NAME}");
            project.SetBuildProperty(watchAppTargetGuid, "CFBundleExecutable", "${EXECUTABLE_NAME}");
            project.SetBuildProperty(watchAppTargetGuid, "ARCHS", "$(ARCHS_STANDARD)");
            project.SetBuildProperty(watchAppTargetGuid, "SDKROOT", "watchos");
            project.SetBuildProperty(watchAppTargetGuid, "SUPPORTED_PLATFORMS", "watchos watchsimulator");
            project.SetBuildProperty(watchAppTargetGuid, "PRODUCT_BUNDLE_IDENTIFIER", bundleId);
            project.SetBuildProperty(watchAppTargetGuid, "PRODUCT_NAME", "StepPals");
            project.SetBuildProperty(watchAppTargetGuid, "PRODUCT_MODULE_NAME", WATCH_APP_TARGET_NAME);
            project.SetBuildProperty(watchAppTargetGuid, "MARKETING_VERSION", "1.0.11");
            project.SetBuildProperty(watchAppTargetGuid, "CURRENT_PROJECT_VERSION", PlayerSettings.iOS.buildNumber);
            project.SetBuildProperty(watchAppTargetGuid, "TARGETED_DEVICE_FAMILY", "4");
            project.SetBuildProperty(watchAppTargetGuid, "IPHONEOS_DEPLOYMENT_TARGET", "16.0");
            project.SetBuildProperty(watchAppTargetGuid, "WATCHOS_DEPLOYMENT_TARGET", "9.0");
            project.SetBuildProperty(watchAppTargetGuid, "SWIFT_VERSION", "5.0");
            project.SetBuildProperty(watchAppTargetGuid, "SWIFT_OPTIMIZATION_LEVEL", "-Onone");
            project.SetBuildProperty(watchAppTargetGuid, "SKIP_INSTALL", "YES");
            project.SetBuildProperty(watchAppTargetGuid, "CODE_SIGN_STYLE", "Automatic");
            project.SetBuildProperty(watchAppTargetGuid, "INFOPLIST_FILE", Path.Combine(WATCH_APP_TARGET_NAME, "Info.plist"));
            project.SetBuildProperty(watchAppTargetGuid, "CODE_SIGN_ENTITLEMENTS", Path.Combine(WATCH_APP_TARGET_NAME, entitlementsFile));
            project.SetBuildProperty(watchAppTargetGuid, "ASSETCATALOG_COMPILER_APPICON_NAME", "AppIcon");
            project.AddBuildProperty(watchAppTargetGuid, "OTHER_LDFLAGS", "-framework SwiftUI"); // Link SwiftUI

            string teamId = PlayerSettings.iOS.appleDeveloperTeamID;
            if (!string.IsNullOrEmpty(teamId)) project.SetBuildProperty(watchAppTargetGuid, "DEVELOPMENT_TEAM", teamId);

            // Embed source files and assets
            string srcPhase = project.AddSourcesBuildPhase(watchAppTargetGuid);
            string resPhase = project.AddResourcesBuildPhase(watchAppTargetGuid);

            // Copy Assets.xcassets
            string assetSrc = Path.Combine(unitySource, "Assets.xcassets");
            string assetDst = Path.Combine(destFolder, "Assets.xcassets");
            if (Directory.Exists(assetSrc))
            {
                CopyDirectory(assetSrc, assetDst);
                string rel = Path.Combine(WATCH_APP_TARGET_NAME, "Assets.xcassets");
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(watchAppTargetGuid, resPhase, guid);
            }

            // Copy Info.plist
            string infoPlistSrc = Path.Combine(unitySource, "Info.plist");
            string infoPlistDst = Path.Combine(destFolder, "Info.plist");
            if (File.Exists(infoPlistSrc))
            {
                File.Copy(infoPlistSrc, infoPlistDst, true);
                string rel = Path.Combine(WATCH_APP_TARGET_NAME, "Info.plist");
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
            }

            // Copy entitlements
            string entitlementsSrc = Path.Combine(unitySource, entitlementsFile);
            string entitlementsDst = Path.Combine(destFolder, entitlementsFile);
            if (File.Exists(entitlementsSrc))
            {
                File.Copy(entitlementsSrc, entitlementsDst, true);
                string rel = Path.Combine(WATCH_APP_TARGET_NAME, entitlementsFile);
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
            }

            // Copy ttf files
            foreach (var ttf in Directory.GetFiles(unitySource, "*.ttf", SearchOption.AllDirectories))
            {
                // Get relative path to preserve directory structure
                string relative = Path.GetRelativePath(unitySource, ttf);
                string dest = Path.Combine(destFolder, relative);
                
                // Create directory if needed
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                
                File.Copy(ttf, dest, true);
                string rel = Path.Combine(WATCH_APP_TARGET_NAME, relative).Replace('\\', '/'); // Use forward slashes for Xcode
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(watchAppTargetGuid, resPhase, guid);
            }

            // Copy Swift files
            foreach (var swift in Directory.GetFiles(unitySource, "*.swift", SearchOption.AllDirectories))
            {
                // Get relative path to preserve directory structure
                string relative = Path.GetRelativePath(unitySource, swift);
                string dest = Path.Combine(destFolder, relative);
                
                // Create directory if needed
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                
                File.Copy(swift, dest, true);
                string rel = Path.Combine(WATCH_APP_TARGET_NAME, relative).Replace('\\', '/'); // Use forward slashes for Xcode
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(watchAppTargetGuid, srcPhase, guid);
            }

            Debug.Log($"[iOS Build Post-Processor] ✓ Configured Watch App: {WATCH_APP_TARGET_NAME}");

            // Add watch app as target dependency
            project.AddTargetDependency(mainTargetGuid, watchAppTargetGuid);

            // Embed in main app - Watch apps use Products Directory (16) with Watch subpath
            string embedPhase = project.AddCopyFilesBuildPhase(mainTargetGuid, "Embed Watch Content", "$(CONTENTS_FOLDER_PATH)/Watch", "16");
            string productRef = project.GetTargetProductFileRef(watchAppTargetGuid);
            if (!string.IsNullOrEmpty(productRef))
                project.AddFileToBuildSection(mainTargetGuid, embedPhase, productRef);

            return watchAppTargetGuid;
        }

        // ==========================
        // WatchOS Widget
        // ==========================
        private static string ConfigureWatchOSWidget(PBXProject project, string watchAppTargetGuid, string buildPath)
        {
            string watchWidgetTargetGuid = project.TargetGuidByName(WATCH_WIDGET_TARGET_NAME);
            if (string.IsNullOrEmpty(watchWidgetTargetGuid))
                watchWidgetTargetGuid = project.AddTarget(WATCH_WIDGET_TARGET_NAME, "appex", "com.apple.product-type.app-extension");

            string bundleId = MAIN_APP_BUNDLE_ID + "." + WATCH_APP_TARGET_NAME + "." + WATCH_WIDGET_TARGET_NAME;
            string unitySource = Path.Combine(Application.dataPath, "StepPals", WATCH_WIDGET_TARGET_NAME);
            string destFolder = Path.Combine(buildPath, WATCH_WIDGET_TARGET_NAME);
            string entitlementsFile = WATCH_WIDGET_TARGET_NAME + ".entitlements";

            Directory.CreateDirectory(destFolder);
            
            project.SetBuildProperty(watchWidgetTargetGuid, "CFBundleName", "${PRODUCT_NAME}");
            project.SetBuildProperty(watchWidgetTargetGuid, "CFBundleDisplayName", "${PRODUCT_NAME}");
            project.SetBuildProperty(watchWidgetTargetGuid, "CFBundleExecutable", "${EXECUTABLE_NAME}");
            project.SetBuildProperty(watchWidgetTargetGuid, "ARCHS", "$(ARCHS_STANDARD)");
            project.SetBuildProperty(watchWidgetTargetGuid, "SDKROOT", "watchos");
            project.SetBuildProperty(watchWidgetTargetGuid, "SUPPORTED_PLATFORMS", "watchos watchsimulator");
            project.SetBuildProperty(watchWidgetTargetGuid, "PRODUCT_BUNDLE_IDENTIFIER", bundleId);
            project.SetBuildProperty(watchWidgetTargetGuid, "PRODUCT_NAME", "StepPals");
            project.SetBuildProperty(watchWidgetTargetGuid, "PRODUCT_MODULE_NAME", WATCH_WIDGET_TARGET_NAME);
            project.SetBuildProperty(watchWidgetTargetGuid, "MARKETING_VERSION", "1.0.11");
            project.SetBuildProperty(watchWidgetTargetGuid, "CURRENT_PROJECT_VERSION", PlayerSettings.iOS.buildNumber);
            project.SetBuildProperty(watchWidgetTargetGuid, "TARGETED_DEVICE_FAMILY", "4");
            project.SetBuildProperty(watchWidgetTargetGuid, "IPHONEOS_DEPLOYMENT_TARGET", "16.0");
            project.SetBuildProperty(watchWidgetTargetGuid, "WATCHOS_DEPLOYMENT_TARGET", "9.0");
            project.SetBuildProperty(watchWidgetTargetGuid, "SWIFT_VERSION", "5.0");
            project.SetBuildProperty(watchWidgetTargetGuid, "SWIFT_OPTIMIZATION_LEVEL", "-Onone");
            project.SetBuildProperty(watchWidgetTargetGuid, "SKIP_INSTALL", "YES");
            project.SetBuildProperty(watchWidgetTargetGuid, "CODE_SIGN_STYLE", "Automatic");
            project.SetBuildProperty(watchWidgetTargetGuid, "INFOPLIST_FILE", Path.Combine(WATCH_WIDGET_TARGET_NAME, "Info.plist"));
            project.SetBuildProperty(watchWidgetTargetGuid, "CODE_SIGN_ENTITLEMENTS", Path.Combine(WATCH_WIDGET_TARGET_NAME, entitlementsFile));
            project.SetBuildProperty(watchWidgetTargetGuid, "ASSETCATALOG_COMPILER_APPICON_NAME", "AppIcon");
            project.AddBuildProperty(watchWidgetTargetGuid, "OTHER_LDFLAGS", "-framework SwiftUI -framework WidgetKit"); // Link SwiftUI + WidgetKit

            string teamId = PlayerSettings.iOS.appleDeveloperTeamID;
            if (!string.IsNullOrEmpty(teamId)) project.SetBuildProperty(watchWidgetTargetGuid, "DEVELOPMENT_TEAM", teamId);

            // Embed source files and assets
            string srcPhase = project.AddSourcesBuildPhase(watchWidgetTargetGuid);
            string resPhase = project.AddResourcesBuildPhase(watchWidgetTargetGuid);

            // Copy Assets.xcassets
            string assetSrc = Path.Combine(unitySource, "Assets.xcassets");
            string assetDst = Path.Combine(destFolder, "Assets.xcassets");
            if (Directory.Exists(assetSrc))
            {
                CopyDirectory(assetSrc, assetDst);
                string rel = Path.Combine(WATCH_WIDGET_TARGET_NAME, "Assets.xcassets");
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(watchWidgetTargetGuid, resPhase, guid);
            }

            // Copy Info.plist
            string infoPlistSrc = Path.Combine(unitySource, "Info.plist");
            string infoPlistDst = Path.Combine(destFolder, "Info.plist");
            if (File.Exists(infoPlistSrc))
            {
                File.Copy(infoPlistSrc, infoPlistDst, true);
                string rel = Path.Combine(WATCH_WIDGET_TARGET_NAME, "Info.plist");
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
            }

            // Copy entitlements
            string entitlementsSrc = Path.Combine(unitySource, entitlementsFile);
            string entitlementsDst = Path.Combine(destFolder, entitlementsFile);
            if (File.Exists(entitlementsSrc))
            {
                File.Copy(entitlementsSrc, entitlementsDst, true);
                string rel = Path.Combine(WATCH_WIDGET_TARGET_NAME, entitlementsFile);
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
            }

            // Copy ttf files
            foreach (var ttf in Directory.GetFiles(unitySource, "*.ttf", SearchOption.AllDirectories))
            {
                // Get relative path to preserve directory structure
                string relative = Path.GetRelativePath(unitySource, ttf);
                string dest = Path.Combine(destFolder, relative);
                
                // Create directory if needed
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                
                File.Copy(ttf, dest, true);
                string rel = Path.Combine(WATCH_WIDGET_TARGET_NAME, relative).Replace('\\', '/'); // Use forward slashes for Xcode
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(watchWidgetTargetGuid, resPhase, guid);
            }

            // Copy Swift files
            foreach (var swift in Directory.GetFiles(unitySource, "*.swift", SearchOption.AllDirectories))
            {
                // Get relative path to preserve directory structure
                string relative = Path.GetRelativePath(unitySource, swift);
                string dest = Path.Combine(destFolder, relative);
                
                // Create directory if needed
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                
                File.Copy(swift, dest, true);
                string rel = Path.Combine(WATCH_WIDGET_TARGET_NAME, relative).Replace('\\', '/'); // Use forward slashes for Xcode
                string guid = project.AddFile(rel, rel, PBXSourceTree.Source);
                project.AddFileToBuildSection(watchWidgetTargetGuid, srcPhase, guid);
            }

            Debug.Log($"[iOS Build Post-Processor] ✓ Configured WatchOS Widget: {WATCH_WIDGET_TARGET_NAME}");

            // Add widget as target dependency
            project.AddTargetDependency(watchAppTargetGuid, watchWidgetTargetGuid);

            // Embed in iPhone app
            EmbedExtension(project, watchAppTargetGuid, watchWidgetTargetGuid, "Embed Foundation Extensions");

            return watchWidgetTargetGuid;
        }

        private static void EmbedExtension(PBXProject project, string hostTarget, string childTarget, string phaseName)
        {
            string embedPhase = project.AddCopyFilesBuildPhase(hostTarget, phaseName, "", "13");
            string productRef = project.GetTargetProductFileRef(childTarget);
            if (!string.IsNullOrEmpty(productRef))
                project.AddFileToBuildSection(hostTarget, embedPhase, productRef);
        }

        private static void CopyDirectory(string sourceDir, string destDir)
        {
            Directory.CreateDirectory(destDir);
            foreach (string file in Directory.GetFiles(sourceDir, "*", SearchOption.AllDirectories))
            {
                string relative = file.Substring(sourceDir.Length + 1);
                string dest = Path.Combine(destDir, relative);
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                File.Copy(file, dest, true);
            }
        }
        
        private static void RemoveExtensionFilesFromUnityFramework(PBXProject project, string frameworkTargetGuid)
        {
            Debug.Log("🔧 StepPals: Removing extension Swift files from UnityFramework...");
            
            // Swift files with @main attribute that should NOT be in UnityFramework
            string[] problematicFiles = new string[]
            {
                "Libraries/StepPals/StepPalsWatchApp/StepPalsWatchApp.swift",
                "Libraries/StepPals/StepPalsPhoneWidget/StepPalsPhoneWidget.swift",
                "Libraries/StepPals/StepPalsWatchWidget/StepPalsWatchWidget.swift"
            };
            
            int removedCount = 0;
            
            foreach (string filePath in problematicFiles)
            {
                // Find the file GUID in the project
                string fileGuid = project.FindFileGuidByProjectPath(filePath);
                
                if (!string.IsNullOrEmpty(fileGuid))
                {
                    // Remove from UnityFramework compile sources
                    project.RemoveFileFromBuild(frameworkTargetGuid, fileGuid);
                    removedCount++;
                    Debug.Log($"  ✅ Removed {filePath} from UnityFramework compile sources");
                }
            }
            
            if (removedCount > 0)
            {
                Debug.Log($"✅ StepPals: Removed {removedCount} extension files from UnityFramework");
                Debug.Log("   Note: These files should only be in their respective widget/watch app targets");
            }
            else
            {
                Debug.Log("ℹ️ StepPals: No extension files found in UnityFramework (this is OK)");
            }
        }

        private static void DeleteRawBridgeFolder(string buildPath)
        {
            string bridgePath = Path.Combine(buildPath, "Data", "Raw", "StepPalsUnityBridge");
            if (Directory.Exists(bridgePath))
            {
                try
                {
                    Directory.Delete(bridgePath, true);
                    Debug.Log($"✅ StepPals: Deleted Data/Raw/StepPalsUnityBridge folder");
                }
                catch (System.Exception e)
                {
                    Debug.LogWarning($"⚠️ StepPals: Failed to delete Data/Raw/StepPalsUnityBridge: {e.Message}");
                }
            }
        }
    }
}

