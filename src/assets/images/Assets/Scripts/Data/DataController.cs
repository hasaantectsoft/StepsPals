using System;
using System.Collections.Generic;
using Data.DataProxy;
using Data.Models;
using ModestTree;
using Playfab;
using SaveSystem;
using UniRx;

namespace Data
{
    public class DataController
    {
        private const int SavingPeriodSeconds = 10;
        private readonly List<IDataProxy> _dataProxies;
        private readonly ISaveSystem _saveSystem;
        private GameStateModel _currentGameState;
        private readonly CompositeDisposable _compositeDisposable = new();
        private Action _onRetrieveSuccess;

        public DataController(List<IDataProxy> dataProxies, IApiInterface apiInterface,
            BinarySaveSystem binarySaveSystem)
        {
            _dataProxies = dataProxies;
            _saveSystem = new PlayFabSaveSystem(apiInterface, binarySaveSystem);
        }

        public void Initialize(Action onSuccess, Action onError)
        {
            _compositeDisposable.Clear();
            Observable.Interval(TimeSpan.FromSeconds(SavingPeriodSeconds)).Subscribe(_ => SaveGameState())
                .AddTo(_compositeDisposable);
            Observable.EveryApplicationFocus().Where(hasFocus => !hasFocus).Subscribe(_ => SaveGameState())
                .AddTo(_compositeDisposable);

            _onRetrieveSuccess = onSuccess;
            _saveSystem.RetrieveGameState(OnStateReceived, onError);
        }

        private void OnStateReceived(GameStateModel result)
        {
            _currentGameState = result;
            Log.Debug($"Loaded saves: {_currentGameState}");
            foreach (IDataProxy dataProxy in _dataProxies)
            {
                dataProxy.SetGameState(_currentGameState);
            }

            _onRetrieveSuccess?.Invoke();
        }

        private void SaveGameState()
        {
            if (_currentGameState == null)
            {
                return;
            }

            _saveSystem.SaveGameState(_currentGameState);
        }

        public void StopSavingData()
        {
            _compositeDisposable?.Clear();
        }
    }
}