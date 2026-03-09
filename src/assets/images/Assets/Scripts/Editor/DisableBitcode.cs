#if UNITY_IOS
using UnityEditor;
using UnityEditor.iOS.Xcode;
using UnityEditor.Callbacks;

public static class DisableBitcode
{
    [PostProcessBuildAttribute(999)]
    public static void OnPostProcessBuild(BuildTarget buildTarget, string pathToBuildProject)
    {
        if (buildTarget != BuildTarget.iOS) return;
        string projectPath = pathToBuildProject + "/Unity-iPhone.xcodeproj/project.pbxproj";
        PBXProject pbxProject = new PBXProject();
        pbxProject.ReadFromFile(projectPath);
        //Disabling Bitcode on all targets
        //Main
        string target = pbxProject.GetUnityMainTargetGuid();
        pbxProject.SetBuildProperty(target, "ENABLE_BITCODE", "NO");
        //Unity Tests
        target = pbxProject.TargetGuidByName(PBXProject.GetUnityTestTargetName());
        pbxProject.SetBuildProperty(target, "ENABLE_BITCODE", "NO");
        //Unity Framework
        target = pbxProject.GetUnityFrameworkTargetGuid();
        pbxProject.SetBuildProperty(target, "ENABLE_BITCODE", "NO");
        pbxProject.SetBuildProperty(target, "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES", "NO");
        pbxProject.WriteToFile(projectPath);
    }
}
#endif