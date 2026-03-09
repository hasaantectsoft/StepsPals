using System;
using System.Collections.Generic;

namespace Data.Models.PlayerPetsModels
{
    [Serializable]
    public class PlayersPetsModel
    {
        public List<PlayerPetModel> allPets;
        public int stepsGoalCount;
        public int newStepGoalForNextDay;
    }
}