using System;
using UnityEngine;

namespace Utils
{
    [Serializable]
    public class IntegerRange
    {
        [field: SerializeField] public int Min { get; private set; }
        [field: SerializeField] public int Max { get; private set; }

        public IntegerRange()
        {
            Min = 0;
            Max = 0;
        }

        public IntegerRange(int minValue, int maxValue)
        {
            Min = minValue;
            Max = maxValue;
        }
    }
}