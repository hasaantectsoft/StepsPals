using System;
using System.Collections.Generic;
using UnityEngine;

namespace ScreenNavigationSystem
{
    [CreateAssetMenu(fileName = "ScreenAssetsSO", menuName = "SO/Assets/ScreenAssetsSO")]
    public class ScreenAssets : ScriptableObject
    {
        [SerializeField] private List<ScreenPresenter> screens = new();

        private Dictionary<Type, ScreenPresenter> _screensByType;

        public bool TryGetScreen(Type type, out ScreenPresenter screen)
        {
            if (_screensByType == null)
            {
                _screensByType = new Dictionary<Type, ScreenPresenter>();
                foreach (ScreenPresenter someScreenPresenter in screens)
                {
                    _screensByType.Add(someScreenPresenter.GetType(), someScreenPresenter);
                }
            }

            if (_screensByType.TryGetValue(type, out screen))
            {
                return true;
            }

            Debug.LogError($"SNS | Screen with type = {type.Name} was not found in ScreenAssets");
            return false;
        }

    #if UNITY_EDITOR
        public void UpdateScreenList(List<ScreenPresenter> screenPresenters)
        {
            screens.Clear();
            screens = screenPresenters;
            Debug.Log($"SNS | Found and added {screens.Count} screens.");
        }
    #endif
    }
}