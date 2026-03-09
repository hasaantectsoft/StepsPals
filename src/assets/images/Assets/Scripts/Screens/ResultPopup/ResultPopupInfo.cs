using Data.Types;

namespace Screens.ResultPopup
{
    public struct ResultPopupInfo
    {
        public int StepsCount { get; private set; }
        public LeagueType League { get; private set; }

        public ResultPopupInfo(int stepsCount, LeagueType league)
        {
            StepsCount = stepsCount;
            League = league;
        }
    }
}