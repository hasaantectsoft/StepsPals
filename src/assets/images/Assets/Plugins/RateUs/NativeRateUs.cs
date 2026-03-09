using UnityEngine;

namespace Plugins.RateUs
{
    public class NativeRateUs : MonoBehaviour
    {
        private static NativeRateUs _instance;
    
        public static NativeRateUs Instance
        {
            get
            {
                if (_instance == null)
                {
                    GameObject go = new GameObject("NativeRateUs");
                    _instance = go.AddComponent<NativeRateUs>();
                    DontDestroyOnLoad(go);
                }
                return _instance;
            }
        }

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }

        /// <summary>
        /// Opens the native rate dialog
        /// </summary>
        public void RateApp()
        {
        #if UNITY_IOS && !UNITY_EDITOR
        RateApp_iOS();
        #elif UNITY_ANDROID && !UNITY_EDITOR
        RateApp_Android();
        #else
            Debug.Log("Rate app called - Editor mode");
        #endif
        }

        /// <summary>
        /// Opens the app store page directly
        /// </summary>
        /// <param name="appId">iOS: App ID (numbers only), Android: package name</param>
        public void OpenStorePage(string appId)
        {
        #if UNITY_IOS && !UNITY_EDITOR
        Application.OpenURL($"itms-apps://itunes.apple.com/app/id{appId}?action=write-review");
        #elif UNITY_ANDROID && !UNITY_EDITOR
        Application.OpenURL($"market://details?id={appId}");
        #else
            Debug.Log($"Open store page called - Editor mode. App ID: {appId}");
        #endif
        }

    #if UNITY_IOS && !UNITY_EDITOR
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void RateApp_iOS();
    #endif

    #if UNITY_ANDROID && !UNITY_EDITOR
    private void RateApp_Android()
    {
        try
        {
            AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            AndroidJavaObject context = currentActivity.Call<AndroidJavaObject>("getApplicationContext");
            
            AndroidJavaClass rateUsClass = new AndroidJavaClass("com.bshark.rateusplugin.RateUsPlugin");
            rateUsClass.CallStatic("showRateDialog", currentActivity);
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Android Rate Us Error: {e.Message}");
            // Fallback to store page
            string packageName = Application.identifier;
            Application.OpenURL($"market://details?id={packageName}");
        }
    }
    #endif
    }
}