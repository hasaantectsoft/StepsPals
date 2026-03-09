using System;

namespace Authentication
{
    public class EditorAuthenticationManager : IAuthenticationManager
    {
        public void GetAuthenticationId(Action<string> onAuthenticateUser, Action onError = null)
        {
            throw new NotImplementedException();
        }

        public void SignInAccount(Action onSuccess, Action onError = null)
        {
            onSuccess?.Invoke();
        }

        public void LinkAccount(Action onSuccess, Action onError = null)
        {
            throw new NotImplementedException();
        }

        public void UnlinkAccount(Action onSuccess, Action onError = null)
        {
            throw new NotImplementedException();
        }
    }
}