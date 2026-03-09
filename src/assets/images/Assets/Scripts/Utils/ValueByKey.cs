using System;
using UnityEngine;

namespace Utils
{
    [Serializable]
    public class ValueByKey<TK, TV>
    {
        [field: SerializeField] public TK Key { private set; get; }
        [field: SerializeField] public TV Value { private set; get; }

        public void Deconstruct(out TK key, out TV value)
        {
            key = Key;
            value = Value;
        }
    }
}