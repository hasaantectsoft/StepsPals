using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Pool;

namespace Utils
{
    public class GameObjectPool<T> where T : MonoBehaviour
    {
        private readonly ObjectPool<T> _pool;
        private readonly T _prototype;
        private readonly Transform _root;

        public GameObjectPool(int initialSize, T prototype, Transform root)
        {
            _prototype = prototype;
            _root = root;

            _pool = new ObjectPool<T>(CreatePooledItem, OnTakeFromPool, OnReturnedToPool, OnDestroyPoolObject, true,
                initialSize, int.MaxValue);

            List<T> initialItems = new(initialSize);
            for (int i = 0; i < initialSize; i++)
            {
                initialItems.Add(Get());
            }

            Release(initialItems);
        }

        public T Get() => _pool.Get();

        public void Release(T item) => _pool.Release(item);

        public void Release(IEnumerable<T> items)
        {
            foreach (T item in items)
            {
                Release(item);
            }
        }

        private T CreatePooledItem() => Object.Instantiate(_prototype, _root, false);

        private static void OnReturnedToPool(T item) => item.gameObject.SetActive(false);

        private static void OnTakeFromPool(T item) => item.gameObject.SetActive(true);

        private static void OnDestroyPoolObject(T item) => Object.Destroy(item.gameObject);
    }
}