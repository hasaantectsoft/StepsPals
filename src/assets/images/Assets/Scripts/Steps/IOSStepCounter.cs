using System;
using BeliefEngine.HealthKit;
using UnityEngine;

namespace Steps
{
    public class IOSStepCounter : StepCounterBase
    {
        [SerializeField] private HealthStore healthStore;
        [SerializeField] private HealthKitDataTypes healthDataTypes;

        private const int NoStepsErrorCode = 11;
        private bool _reading;

        public override void Authorize(Action<bool> onCompleted)
        {
            healthDataTypes.Load();
            if (healthDataTypes.data.TryGetValue(HealthKitDataTypes.GetIdentifier(HKDataType.HKQuantityTypeIdentifierStepCount), out var stepCountPermission))
            {
                stepCountPermission.read = true;
            }
            healthStore.Authorize(healthDataTypes, success => onCompleted?.Invoke(success));
        }

        protected override void TryReadNextStepData()
        {
            if (QueueToReadData.Count <= 0)
                return;

            if (_reading)
                return;

            (DateTimeOffset startDate, DateTimeOffset endDate, Action<int> onReceived, Action onError) =
                QueueToReadData.Dequeue();
            _reading = true;
            healthStore.ReadStatistics(HKDataType.HKQuantityTypeIdentifierStepCount, startDate, endDate,
                StatisticsOptions.CumulativeSum, delegate(HealthStatistics statistics, Error error)
                {
                    if (error != null)
                    {
                        _reading = false;

                        if (error.code != NoStepsErrorCode)
                        {
                            Debug.LogError($"Error during step reading: {error.localizedDescription}");
                            onError?.Invoke();
                        }
                        else
                        {
                            onReceived?.Invoke(0);
                        }

                        TryReadNextStepData();
                        return;
                    }

                    int stepCount = 0;
                    if (statistics != null)
                    {
                        stepCount = Convert.ToInt32(statistics.sumQuantity);
                    }

                    if (stepCount > 0)
                    {
                        onReceived?.Invoke(stepCount);
                    }

                    _reading = false;
                    TryReadNextStepData();
                });
        }
    }
}