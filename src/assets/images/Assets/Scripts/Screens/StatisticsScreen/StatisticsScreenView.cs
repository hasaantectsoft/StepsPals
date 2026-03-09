using ScreenNavigationSystem;
using Screens.Shared.NavigationBar;
using TMPro;
using UnityEngine;
using Utils;

namespace Screens.StatisticsScreen
{
    public class StatisticsScreenView : ScreenView
    {
        private static readonly string InfoColorTextString =
            ColorUtility.ToHtmlStringRGB(ColorsStorage.StatisticsTextColor);

        [SerializeField] private NavigationBarPresenter navigationBar;
        [SerializeField] private TextMeshProUGUI bestStreakText;
        [SerializeField] private TextMeshProUGUI currentStreakText;
        [SerializeField] private TextMeshProUGUI totalMissedDaysText;
        [SerializeField] private TextMeshProUGUI deadPetsText;
        [SerializeField] private TextMeshProUGUI fullyGrownPetsText;

        public void Initialize()
        {
            navigationBar.Initialize(NavigationButtonType.Statistics);
        }

        public void Configure(StatisticsViewInfo viewInfo)
        {
            bestStreakText.text = string.Format(StringKeys.BestStreakText, viewInfo.BestStreak, InfoColorTextString);
            currentStreakText.text =
                string.Format(StringKeys.CurrentStreakText, viewInfo.CurrentStreak, InfoColorTextString);
            totalMissedDaysText.text = string.Format(StringKeys.TotalMissedDaysText, viewInfo.TotalMissedDays,
                InfoColorTextString);
            deadPetsText.text = string.Format(StringKeys.DeadPetsText, viewInfo.DeadPetsCount, InfoColorTextString);
            fullyGrownPetsText.text = string.Format(StringKeys.FullyGrownPetsText, viewInfo.FullyGrownPetsCount,
                InfoColorTextString);
        }
    }
}