using System;
using Data.Types;

namespace Data.Models
{
    [Serializable]
    public class LeaguePlayfabModel
    {
        public LeagueType type;
        public int requiredStepsCount;
        public int visibleTopUsersCount;
    }
}