using System;
using System.Collections.Generic;
using UnityEngine;

namespace Steps
{
    public abstract class StepCounterBase : MonoBehaviour
    {
        protected readonly Queue<(DateTimeOffset startDate, DateTimeOffset endDate, Action<int> onReceived,
            Action onError)> QueueToReadData = new();

        public abstract void Authorize(Action<bool> onCompleted);

        public void ReadStepData(DateTimeOffset startDate, DateTimeOffset endDate, Action<int> onReceived,
            Action onError = null)
        {
            QueueToReadData.Enqueue((startDate, endDate, onReceived, onError));
            TryReadNextStepData();
        }

        protected abstract void TryReadNextStepData();
    }
}