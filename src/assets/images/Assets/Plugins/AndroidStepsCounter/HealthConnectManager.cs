using System;
using UnityEngine;
using UnityEngine.Android;

public class HealthConnectManager : MonoBehaviour
{
    private static HealthConnectManager _instance;

    public static event Action<long> OnStepCountReceived;
    public static event Action<bool> OnPermissionResult;

    private AndroidJavaObject pluginInstance;
    private AndroidJavaClass unityClass;
    private static AndroidJavaObject _currentActivity;

    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            name = "HealthConnectManager";
            InitializePlugin();
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void InitializePlugin()
    {
        if (Application.platform != RuntimePlatform.Android) return;

        try
        {
            unityClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _currentActivity = unityClass.GetStatic<AndroidJavaObject>("currentActivity");

            AndroidJavaClass bridgeClass = new AndroidJavaClass("com.bshark.stepscounter.HealthConnectUnityBridge");
            bridgeClass.CallStatic("initialize", _currentActivity);
            pluginInstance = bridgeClass;
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to initialize Health Connect plugin: {e.Message}");
        }
    }

    public static void RequestPermissions()
    {
        if (Application.platform != RuntimePlatform.Android) return;

        try
        {
            _instance.pluginInstance.CallStatic("requestPermissions");
        }
        catch (Exception e)
        {
            Debug.LogError($"Permission request failed: {e.Message}");
        }
    }

    public static void StartStepCounterService()
    {
        if (Application.platform != RuntimePlatform.Android) return;
        if (!Permission.HasUserAuthorizedPermission("android.permission.ACTIVITY_RECOGNITION"))
        {
            var callbacks = new PermissionCallbacks();
            callbacks.PermissionGranted += OnPermissionGranted;

            Permission.RequestUserPermission("android.permission.ACTIVITY_RECOGNITION", callbacks);
        }
        else
        {
            StartService();
        }

        return;

        void OnPermissionGranted(string obj)
        {
            StartService();
        }

        void StartService()
        {
            try
            {
                if (_currentActivity == null)
                    throw new NullReferenceException("_currentActivity is null");

                _instance.pluginInstance.CallStatic("startStepCounterService", _currentActivity);
            }
            catch (Exception e)
            {
                Debug.LogError($"Start step counter service failed: {e.Message}");
            }
        }
    }

    public static void GetTodayStepCount()
    {
        if (Application.platform != RuntimePlatform.Android) return;

        try
        {
            _instance.pluginInstance.CallStatic("getTodayStepCount");
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to get step count: {e.Message}");
        }
    }

    public static void GetStepCountForDateRange(DateTimeOffset startDate, DateTimeOffset endDate)
    {
        if (Application.platform != RuntimePlatform.Android) return;

        try
        {
            DateTimeOffset startUtc = startDate.ToUniversalTime();
            DateTimeOffset endUtc = endDate.ToUniversalTime();

            long startTimestamp = startUtc.ToUnixTimeMilliseconds();
            long endTimestamp = endUtc.ToUnixTimeMilliseconds();

            _instance.pluginInstance.CallStatic("getStepCountForDateRange", startTimestamp, endTimestamp);
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to get step count for date range: {e.Message}");
        }
    }

    // Called from Android native code
    private void OnStepCountReceivedNative(string stepCountStr)
    {
        if (long.TryParse(stepCountStr, out long stepCount))
        {
            OnStepCountReceived?.Invoke(stepCount);
        }
    }

    // Called from Android native code
    private void OnErrorNative(string error)
    {
        Debug.LogError(error);
    }

    // Called from Android native code
    private void OnPermissionResultNative(string grantedStr)
    {
        if (bool.TryParse(grantedStr, out bool granted))
        {
            OnPermissionResult?.Invoke(granted);
        }
    }
}