using System;
using Cysharp.Threading.Tasks;
#if UNITY_ANDROID
using GooglePlayGames;
using GooglePlayGames.BasicApi;
#endif
using Playfab;
using Unity.Services.Core;
using UnityEngine;
using Utils;

namespace Authentication
{
    public class AndroidAuthenticationManager : IAuthenticationManager
    {
        private readonly IApiInterface _apiInterface;

        public AndroidAuthenticationManager(IApiInterface apiInterface)
        {
            _apiInterface = apiInterface;
            Initialize().Forget();
        }

        public void SignInAccount(Action onSuccess, Action onError = null)
        {
            LoginToGooglePlay(delegate(string token)
            {
                _apiInterface.LoginWithGooglePlay(token, () =>
                {
                    PlayerPrefsHelper.IsLinkedSocial = true;
                    onSuccess?.Invoke();
                }, onError);
            }, delegate { onError?.Invoke(); });
        }

        public void LinkAccount(Action onSuccess, Action onError = null)
        {
            LoginToGooglePlay(delegate(string token)
            {
                _apiInterface.LinkGooglePlayAccount(token, delegate
                {
                    PlayerPrefsHelper.IsLinkedSocial = true;
                    onSuccess?.Invoke();
                }, onError);
            }, delegate { onError?.Invoke(); });
        }

        public void UnlinkAccount(Action onSuccess, Action onError = null)
        {
            _apiInterface.UnlinkGooglePlayAccount(delegate
            {
                PlayerPrefsHelper.IsLinkedSocial = false;
                onSuccess?.Invoke();
            }, onError);
        }

        private void LoginToGooglePlay(Action<string> onSuccess, Action onError)
        {
        #if UNITY_ANDROID
            PlayGamesPlatform.Instance.Authenticate(success =>
            {
                if (success == SignInStatus.Success)
                {
                    Debug.Log("Login with Google Play games successful.");

                    PlayGamesPlatform.Instance.RequestServerSideAccess(true, code =>
                    {
                        if (code == "1000")
                        {
                            Debug.Log("Error: Authorization code is 1000");
                            onError?.Invoke();
                            return;
                        }

                        Debug.Log("Authorization code: " + code);
                        onSuccess?.Invoke(code);
                    });
                }
                else
                {
                    Debug.LogError("Login Unsuccessful " + success);
                    onError?.Invoke();
                }
            });
            return;
        #endif
            onError?.Invoke();
        }

        private async UniTask Initialize()
        {
            await UnityServices.InitializeAsync();
        #if UNITY_ANDROID
            PlayGamesPlatform.DebugLogEnabled = true;
            PlayGamesPlatform.Activate();
        #endif
            Debug.Log("Initialized AndroidAuthenticationManager");
        }
    }
}