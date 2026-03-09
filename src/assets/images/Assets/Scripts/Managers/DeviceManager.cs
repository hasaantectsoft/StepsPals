using System;
using Balaso;
using UnityEngine;
using Random = UnityEngine.Random;
#if UNITY_IOS
using UnityEngine.iOS;
#endif

namespace Managers
{
    public class DeviceIdManager
    {
        public void GetOrCreateDeviceId(Action<string> callback)
        {
            if (Application.platform == RuntimePlatform.IPhonePlayer)
            {
                AppTrackingTransparency.OnAuthorizationRequestDone += AppTransparencyRequestDone;
                AppTrackingTransparency.RequestTrackingAuthorization();
            }
            else
            {
                if (SystemInfo.deviceUniqueIdentifier != SystemInfo.unsupportedIdentifier)
                {
                    callback?.Invoke(SystemInfo.deviceUniqueIdentifier + (Application.isEditor ? "edit" : ""));
                }
                else
                {
                    LoginByLocalDeviceID();
                }
            }

            void AppTransparencyRequestDone(AppTrackingTransparency.AuthorizationStatus authorizationStatus)
            {
            #if UNITY_IOS
                AppTrackingTransparency.OnAuthorizationRequestDone -= AppTransparencyRequestDone;
                if (Device.advertisingIdentifier == "00000000-0000-0000-0000-000000000000")
                {
                    LoginByLocalDeviceID();
                }
                else
                {
                    callback?.Invoke(Device.advertisingIdentifier);
                }
            #endif
            }

            void LoginByLocalDeviceID()
            {
                if (!PlayerPrefs.HasKey("LocalDeviceID"))
                {
                    string device = "local_id_";
                    for (int i = 0; i < 20; i++)
                    {
                        device += Random.Range(0, 10);
                    }

                    PlayerPrefs.SetString("LocalDeviceID", device);
                }

                callback?.Invoke(PlayerPrefs.GetString("LocalDeviceID"));
            }
        }
    }
}