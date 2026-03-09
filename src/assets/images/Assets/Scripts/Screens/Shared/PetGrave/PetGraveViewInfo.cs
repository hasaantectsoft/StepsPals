using System;
using Data.Types;

namespace Screens.Shared.PetGrave
{
    public struct PetGraveViewInfo
    {
        public string PetName { get; private set; }
        public PetType PetSpecies { get; private set; }
        public DateTime PetBirthday { get; private set; }
        public DateTime PetDeathDay { get; private set; }
        
        public PetGraveViewInfo(string petName, PetType petSpecies, DateTime petBirthday, DateTime petDeathDay)
        {
            PetName = petName;
            PetSpecies = petSpecies;
            PetBirthday = petBirthday;
            PetDeathDay = petDeathDay;
        }
    }
}