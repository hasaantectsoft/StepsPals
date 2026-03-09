using System;
using Data.Models;
using Playfab;
using UniRx;
using UnityEngine;

namespace Data.DataProxy
{
    public class TimeDataProxy : IDataProxy, IDisposable
    {
        private readonly IApiInterface _apiInterface;
        private readonly CompositeDisposable _compositeDisposable = new();
        private GameStateModel _gameStateModel;
        private DateTime _currentTime;
        private IDisposable _interval;

        public DateTime CurrentTime => _currentTime;

        public TimeDataProxy(IApiInterface apiInterface)
        {
            _apiInterface = apiInterface;

            Observable.EveryApplicationFocus().Subscribe(delegate(bool isFocused)
            {
                if (isFocused)
                {
                    UpdateTimeFromServer(null);
                }
                else
                {
                    SaveLastSeenAt();
                }
            }).AddTo(_compositeDisposable);
        }

        public void SetGameState(GameStateModel data)
        {
            _gameStateModel = data;
        }

        public void UpdateTimeFromServer(Action<DateTime> callback)
        {
            _apiInterface.GetTime(delegate(DateTime time)
            {
                _currentTime = time;
                _interval?.Dispose();
                _interval = Observable.Interval(TimeSpan.FromSeconds(1)).Subscribe(delegate
                {
                    _currentTime = _currentTime.AddSeconds(1);
                });
                callback?.Invoke(_currentTime);
            }, delegate { Debug.Log("Failed to retrieve server time"); });
        }

        private void SaveLastSeenAt()
        {
            if (_gameStateModel == null) 
                return;
            _gameStateModel.lastSeenAt = Utils.Utils.GetCurrentTimeInInteger(_currentTime);
        }

        public void Dispose()
        {
            _interval?.Dispose();
            _compositeDisposable?.Dispose();
        }
    }
}