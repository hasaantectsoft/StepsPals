using System;
using Data.Types;

namespace Data.Models.PlayerPetsModels
{
    [Serializable]
    public class PlayerPetModel
    {
        public PetType petType;
        public string name;
        public int age;
        public int growthDay;
        public PetMaturity maturity;
        public ConditionState condition;
        public int missedDays;
        public CareActionType lastDoneCareAction;
        public bool successDayApplied;
        public DateTime birthday;
        public bool inCollection;
        public DateTime? deathDay;
    }
}