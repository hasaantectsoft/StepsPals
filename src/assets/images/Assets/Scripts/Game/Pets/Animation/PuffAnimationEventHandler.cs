using System;
using UnityEngine;

namespace Game.Pets.Animation
{
    public class PuffAnimationEventHandler : MonoBehaviour
    {
        public event Action AppearedBigCloud;

        public void OnBigCloudKey()
        {
            AppearedBigCloud?.Invoke();
        }
    }
}