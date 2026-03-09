using System;
using UnityEngine;

namespace Steps
{
    public class AndroidStepCounterBase : StepCounterBase
    {
        private bool _reading;

        public override void Authorize(Action<bool> onCompleted)
        {
            Debug.LogWarning($"[HEALTH] Permissions requested");
            if (Application.platform == RuntimePlatform.Android)
            {
                HealthConnectManager.OnPermissionResult += HealthConnectManagerOnPermissionResult;
                HealthConnectManager.RequestPermissions();

                void HealthConnectManagerOnPermissionResult(bool result)
                {
                    Debug.LogWarning($"[HEALTH] permissions result: {result}");
                    HealthConnectManager.OnPermissionResult -= HealthConnectManagerOnPermissionResult;
                    if (result)
                    {
                        HealthConnectManager.StartStepCounterService();
                    }

                    onCompleted?.Invoke(result);
                }
            }
            else
            {
                onCompleted?.Invoke(true);
            }
        }

        protected override void TryReadNextStepData()
        {
            if (QueueToReadData.Count <= 0)
                return;

            if (_reading)
                return;

            (DateTimeOffset startDate, DateTimeOffset endDate, Action<int> onReceived, Action _) =
                QueueToReadData.Dequeue();
            if (Application.platform == RuntimePlatform.Android)
            {
                _reading = true;
                HealthConnectManager.OnStepCountReceived += HealthConnectManagerOnStepCountReceived;
                HealthConnectManager.GetStepCountForDateRange(startDate, endDate);

                void HealthConnectManagerOnStepCountReceived(long stepsCount)
                {
                    HealthConnectManager.OnStepCountReceived -= HealthConnectManagerOnStepCountReceived;
                    OnReceived((int)stepsCount);
                }
            }
            else
            {
                OnReceived(0);
            }

            return;

            void OnReceived(int stepCount)
            {
                _reading = false;
                onReceived?.Invoke(stepCount);
                TryReadNextStepData();
            }
        }
    }
}