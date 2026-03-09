using System;
using Data.DataProxy;
using Data.DataProxy.PlayersPetsDataProxy;
using Data.Types;
using Notifications;
using UniRx;
using UnityEngine;

namespace Managers
{
    public class PushNotificationManager : IDisposable
    {
        private readonly GameNotificationsManager _gameNotificationsManager;
        private readonly PlayersPetsDataProxy _playersPetsDataProxy;
        private readonly StatisticsDataProxy _statisticsDataProxy;
        private ActivePetDataProxy _activePetDataProxy;
        private readonly CompositeDisposable _compositeDisposable = new();

        public PushNotificationManager(GameNotificationsManager gameNotificationsManager,
            PlayersPetsDataProxy playersPetsDataProxy, StatisticsDataProxy statisticsDataProxy)
        {
            _gameNotificationsManager = gameNotificationsManager;
            _playersPetsDataProxy = playersPetsDataProxy;
            _statisticsDataProxy = statisticsDataProxy;
            Observable.EveryApplicationFocus().Subscribe(delegate(bool isFocus)
            {
                if (isFocus || !_gameNotificationsManager.Initialized)
                    return;
                ScheduleNotifications();
            }).AddTo(_compositeDisposable);
        }

        public void Initialize()
        {
            if (!_gameNotificationsManager.Initialized)
            {
                _gameNotificationsManager.Initialize();
            }
        }

        public void Dispose()
        {
            _compositeDisposable.Dispose();
        }

        private void ScheduleNotifications()
        {
            _activePetDataProxy = _playersPetsDataProxy.ActivePet.Value;
            if (_activePetDataProxy == null)
                return;

            string petName = _activePetDataProxy.Name;
            
            float nextNoon = Utils.Utils.CalculateSecondsToExactTimeOfFutureDay(0, 12);
            nextNoon = nextNoon < 0 ? Utils.Utils.CalculateSecondsToExactTimeOfFutureDay(1, 12) : nextNoon;
            ScheduleNotification("👟 Keep on moving!", $"🐾 {petName} is waiting!", nextNoon);

            int startScheduleDays = _activePetDataProxy.AllCareActionsDone ? 2 : 1;
            if (_activePetDataProxy.Condition.Value == ConditionState.Healthy)
            {
                ScheduleNotification($"🤒 {petName} got sick yesterday.", "👣 Walk & care today to heal!",
                    Utils.Utils.CalculateSecondsToExactTimeOfFutureDay(startScheduleDays, 9));
                startScheduleDays++;
            }

            if (_activePetDataProxy.Condition.Value is ConditionState.Healthy or ConditionState.Sick)
            {
                ScheduleNotification("😷 Two days without care.", $"🚶🏻‍➡️ Save {petName} with steps & love!",
                    Utils.Utils.CalculateSecondsToExactTimeOfFutureDay(startScheduleDays, 9));
                startScheduleDays++;
            }

            ScheduleNotification($"❤️‍🩹 {petName} has passed away…", "🚑 Revive or start anew?",
                Utils.Utils.CalculateSecondsToExactTimeOfFutureDay(startScheduleDays, 0, 5));

            if (_statisticsDataProxy.CurrentStreak is 3 or 7 or 14)
            {
                ScheduleNotification("🔥 Keep it up!", "💪 Your daily care streak grows stronger!",
                    Utils.Utils.CalculateNextWorkingHoursTimeUtc(9, 18));
            }
        }

        private void ScheduleNotification(string title, string body, float secondToDelivery)
        {
            Debug.Log($"Scheduled notification {title} by {secondToDelivery} seconds.");
            IGameNotification notification = CreateNotification(title, body, secondToDelivery);
            if (notification != null)
            {
                _gameNotificationsManager.ScheduleNotification(notification);
            }
        }

        private IGameNotification CreateNotification(string title, string body, float secondToDelivery)
        {
            IGameNotification notification = _gameNotificationsManager.CreateNotification();
            if (notification == null)
            {
                return null;
            }

            notification.Title = title;
            notification.Body = body;
            notification.SmallIcon = "small_icon";
            notification.LargeIcon = "large_icon";
            notification.DeliveryTime = DateTime.UtcNow.AddSeconds(secondToDelivery);
            return notification;
        }
    }
}