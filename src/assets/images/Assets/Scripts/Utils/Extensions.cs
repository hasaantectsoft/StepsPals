using System;
using System.Collections.Generic;
using System.Linq;
using ScreenNavigationSystem;
using Screens.SubscriptionScreen;
using UniRx;
using UnityEngine;
using UnityEngine.UI;
using Zenject;
using Random = UnityEngine.Random;

namespace Utils
{
    public static class Extensions
    {
        public static IDisposable ActionWithThrottle(this Button button, Action action, int throttleMillis = 200)
        {
            return button.OnClickAsObservable()
                .ThrottleFirst(TimeSpan.FromMilliseconds(throttleMillis), Scheduler.MainThreadIgnoreTimeScale)
                .Subscribe(_ => action?.Invoke()).AddTo(button);
        }

        public static void BindViewAndPresenter<TView, TPresenter>(this DiContainer container)
        {
            container.BindInterfacesAndSelfTo<TView>().FromComponentInHierarchy().AsSingle();
            container.BindInterfacesAndSelfTo<TPresenter>().AsSingle().NonLazy();
        }

        public static T GetRandomElement<T>(this IEnumerable<T> enumerable) => enumerable.ToList().GetRandomElement();

        public static T GetRandomElement<T>(this IReadOnlyList<T> list)
        {
            if (list.Count == 0)
            {
                throw new ArgumentException("Cannot get random element from empty enumerable", nameof(list));
            }

            int randomIndex = Random.Range(0, list.Count);
            return list[randomIndex];
        }

        public static T GetRandomElementAndRemove<T>(this List<T> list)
        {
            if (list.Count == 0)
            {
                throw new ArgumentException("Cannot get random element from empty enumerable", nameof(list));
            }

            int randomIndex = Random.Range(0, list.Count);
            T randomElement = list.ElementAt(randomIndex);
            list.RemoveAt(randomIndex);
            return randomElement;
        }

        public static Dictionary<TK, TV> ToDictionary<TK, TV>(this IReadOnlyCollection<ValueByKey<TK, TV>> valuesByKeys)
        {
            Dictionary<TK, TV> dictionary = new(valuesByKeys.Count);
            foreach (ValueByKey<TK, TV> valueByKey in valuesByKeys)
            {
                dictionary[valueByKey.Key] = valueByKey.Value;
            }

            return dictionary;
        }

        public static int IndexOf<T>(this IReadOnlyList<T> array, T value)
        {
            for (int i = 0; i < array.Count; i++)
            {
                if (Equals(array[i], value))
                {
                    return i;
                }
            }

            return -1;
        }

        public static void SetAlpha(this Graphic image, float alpha)
        {
            Color imageColor = image.color;
            image.color = new Color(imageColor.r, imageColor.g, imageColor.b, alpha);
        }

        public static void SetAlpha(this SpriteRenderer sprite, float alpha)
        {
            Color imageColor = sprite.color;
            sprite.color = new Color(imageColor.r, imageColor.g, imageColor.b, alpha);
        }

        public static Dictionary<TKey, TElement> ToDictionary<TKey, TElement>(
            this ReactiveDictionary<TKey, TElement> source)
        {
            return source.ToDictionary(g => g.Key, g => g.Value);
        }

        public static NavigationCommand CloseAllScreensExceptThis(this NavigationCommand navigationCommand,
            params Type[] types)
        {
            return navigationCommand.CloseAllScreensByConditions(screen => types.Contains(screen.GetType()) == false);
        }

        public static NavigationCommand CloseAllScreensExceptSubscription(this NavigationCommand navigationCommand)
        {
            return navigationCommand.CloseAllScreensByConditions(screen =>
                screen.GetType() != typeof(SubscriptionScreenPresenter));
        }
    }
}