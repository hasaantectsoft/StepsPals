using System;
using System.Collections.Generic;
using UnityEngine;

namespace Utils
{
    [Serializable]
    public class SerializedDictionary<TK, TV>
    {
        [field: SerializeField] public ValueByKey<TK, TV>[] Array { private set; get; }

        private Dictionary<TK, TV> _dictionary;

        public IReadOnlyDictionary<TK, TV> Dictionary
        {
            get
            {
                if (_dictionary != null)
                    return _dictionary;

                _dictionary = new Dictionary<TK, TV>();
                foreach ((TK key, TV value) in Array)
                {
                    _dictionary.Add(key, value);
                }

                return _dictionary;
            }
        }

        public TV this[TK key] => Dictionary[key];
    }
}