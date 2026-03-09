using System;
using System.Text;
using AppleAuth;
using AppleAuth.Enums;
using AppleAuth.Interfaces;
using AppleAuth.Native;
using Playfab;
using UniRx;
using UnityEngine;
using Utils;

namespace Authentication
{
    public class AppleAuthenticationManager : IAuthenticationManager
    {
        private readonly CompositeDisposable _compositeDisposable = new();
        private readonly IApiInterface _apiInterface;
        private IAppleAuthManager _appleAuthManager;

        public AppleAuthenticationManager(IApiInterface apiInterface)
        {
            _apiInterface = apiInterface;
            Initialize();
        }

        private void Initialize()
        {
            Debug.Log("Initialize Apple Auth Manager");
            if (AppleAuthManager.IsCurrentPlatformSupported)
            {
                PayloadDeserializer deserializer = new();
                _appleAuthManager = new AppleAuthManager(deserializer);
            }

            _compositeDisposable.Clear();
            Observable.EveryUpdate().Subscribe(_ => Update()).AddTo(_compositeDisposable);
        }

        private void Update()
        {
            _appleAuthManager?.Update();
        }

        public void SignInAccount(Action onSuccess, Action onError = null)
        {
            Debug.Log("SignInAccount");
            GetAuthenticationId(token =>
            {
                _apiInterface.SignInWithApple(token, () =>
                {
                    PlayerPrefsHelper.IsLinkedSocial = true;
                    onSuccess?.Invoke();
                }, () => LinkWithPrefab(token, onSuccess, onError));
            }, () => { onError?.Invoke(); });
        }

        public void LinkAccount(Action onSuccess, Action onError = null)
        {
            Debug.Log("LinkAccount");
            GetAuthenticationId(token => LinkWithPrefab(token, onSuccess, onError), () => onError?.Invoke());
        }

        private void LinkWithPrefab(string token, Action onSuccess, Action onError)
        {
            _apiInterface.LinkApple(token, delegate
            {
                PlayerPrefsHelper.IsLinkedSocial = true;
                onSuccess?.Invoke();
            }, onError);
        }

        public void UnlinkAccount(Action onSuccess, Action onError = null)
        {
            Debug.Log("UnlinkAccount");
            _apiInterface.UnlinkApple(delegate
            {
                PlayerPrefsHelper.IsLinkedSocial = false;
                onSuccess?.Invoke();
            }, onError);
        }

        private void GetAuthenticationId(Action<string> onSuccess, Action onError = null)
        {
            Debug.Log("Getting Authentication Id");
            Login(onSuccess, onError);
        }

        private void Login(Action<string> onSuccess, Action onError = null)
        {
            if (_appleAuthManager == null)
            {
                Initialize();
            }

            AppleAuthLoginArgs loginArgs = new(LoginOptions.None);

            _appleAuthManager?.LoginWithAppleId(loginArgs, credential =>
            {
                if (credential is IAppleIDCredential appleIdCredential)
                {
                    string identityToken = Encoding.UTF8.GetString(appleIdCredential.IdentityToken, 0,
                        appleIdCredential.IdentityToken.Length);
                    Debug.Log($"identityToken = {identityToken}");
                    onSuccess?.Invoke(identityToken);
                }
                else
                {
                    Debug.Log("Sign-in with Apple error. Message: appleIDCredential is null");
                    onError?.Invoke();
                }
            }, error =>
            {
                Debug.LogError(error);
                onError?.Invoke();
            });
        }
    }
}