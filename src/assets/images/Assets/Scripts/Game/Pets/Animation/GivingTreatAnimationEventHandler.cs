using System;
using UnityEngine;

namespace Game.Pets.Animation
{
    public class GivingTreatAnimationEventHandler : MonoBehaviour
    {
        public event Action TreatBitten;

        public void OnTreatBite()
        {
            TreatBitten?.Invoke();
        }
    }
}