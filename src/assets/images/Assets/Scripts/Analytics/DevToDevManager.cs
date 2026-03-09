using System;
using System.Linq;
using Cysharp.Threading.Tasks;
using DevToDev.Analytics;
using DTDEditor;
using ScreenNavigationSystem;
using Services;
using UnityEngine;
using Zenject;

namespace Analytics
{
    public class DevToDevManager : MonoBehaviour
    {
        [SerializeField] private DTDLogLevel logLevel;
        [SerializeField] private DTDCredentials[] credentials;
        [SerializeField] private bool isAnalyticsEnabled = true;

        private static bool _isAnalyticsEnabled = false;

        private static InternetConnectionService _internetConnectionService;
        private static ScreensController _screensController;

        [Inject]
        public void Construct(InternetConnectionService internetConnectionService, ScreensController screensController)
        {
            _internetConnectionService = internetConnectionService;
            _screensController = screensController;
        }

        private void Start()
        {
            _isAnalyticsEnabled = isAnalyticsEnabled;
            if (!isAnalyticsEnabled)
            {
                return;
            }

        #if UNITY_ANDROID
            InitializeAnalytics(DTDPlatform.Android);
        #elif UNITY_IOS
            InitializeAnalytics(DTDPlatform.IOS);
        #elif UNITY_METRO || UNITY_WSA
			InitializeAnalytics(DTDPlatform.UWP);
        #elif UNITY_STANDALONE_OSX
			InitializeAnalytics(DTDPlatform.MacOS);
        #elif UNITY_STANDALONE_WIN
			InitializeAnalytics(DTDPlatform.WindowsStandalone);
        #endif
        }

        public static void LogEvent(DevToDevKey key)
        {
            if (!_isAnalyticsEnabled) return;
            TrySendEventWithInternetConnectionCheck(key).Forget();
        }

        private static void LogEvent(string key)
        {
            Debug.Log("LogEvent: " + key);
            DTDAnalytics.CustomEvent(key);
        }

        public static void LogEvent(DevToDevKey key, params ValueTuple<DevToDevKey, object>[] values)
        {
            if (!_isAnalyticsEnabled) return;
            TrySendEventWithInternetConnectionCheck(key, values).Forget();
        }

        private static void LogEvent(string key, params ValueTuple<string, object>[] values)
        {
            Debug.Log("LogEvent: " + key + " : " + string.Join(", ", values));
            DTDCustomEventParameters customEventParams = new();
            foreach ((string, object) entry in values)
            {
                switch (entry.Item2)
                {
                    case int i:
                        customEventParams.Add(entry.Item1, i);
                        break;
                    case double d:
                        customEventParams.Add(entry.Item1, d);
                        break;
                    default:
                        customEventParams.Add(entry.Item1, entry.Item2.ToString());
                        break;
                }
            }

            DTDAnalytics.CustomEvent(key, customEventParams);
        }

        private void InitializeAnalytics(DTDPlatform platform)
        {
            DTDCredentials targetCredential = credentials.FirstOrDefault(item => item.platform == platform);
            if (targetCredential != null)
            {
                DTDAnalyticsConfiguration config = new() { LogLevel = logLevel, };
                DTDAnalytics.Initialize(targetCredential.key, config);
            }
        }

        private static async UniTask TrySendEventWithInternetConnectionCheck(DevToDevKey key,
            params ValueTuple<DevToDevKey, object>[] values)
        {
            bool isConnected = await _internetConnectionService.TryShowNoInternetConnection();

            if (!isConnected)
            {
                Debug.LogWarning("No internet connection. Event not sent: " + key);
                return;
            }

            if (values == null || values.Length == 0)
            {
                LogEvent(key.ToString());
            }
            else
            {
                LogEvent(key.ToString(),
                    values.Select(tuple => new ValueTuple<string, object>(tuple.Item1.ToString(), tuple.Item2))
                        .ToArray());
            }
        }
    }
}