using System;
using Utils;

namespace Authentication
{
    public interface IAuthenticationManager
    {
        public bool IsLinkedSocial => PlayerPrefsHelper.IsLinkedSocial;
        public void SignInAccount(Action onSuccess, Action onError = null);
        public void UnlinkAccount(Action onSuccess, Action onError = null);
        void LinkAccount(Action onSuccess, Action onError);
    }
}