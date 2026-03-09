using Analytics;
using Data.DataProxy;
using ScreenNavigationSystem;
using UnityEngine;
using Zenject;

namespace Screens.StatisticsScreen
{
    public class StatisticsScreenPresenter : ScreenPresenter
    {
        [SerializeField] private StatisticsScreenView view;

        private StatisticsDataProxy _statisticsDataProxy;

        [Inject]
        public void Construct(StatisticsDataProxy statisticsDataProxy)
        {
            _statisticsDataProxy = statisticsDataProxy;
        }
        
        private void Awake()
        {
            view.Initialize();
            OnShowCallback += OnShow;
        }

        private void OnShow(object data)
        {
            DevToDevManager.LogEvent(DevToDevKey.statistics_screen_opened);
            view.Configure(_statisticsDataProxy.GetStatisticsViewInfo());
        }
    }
}