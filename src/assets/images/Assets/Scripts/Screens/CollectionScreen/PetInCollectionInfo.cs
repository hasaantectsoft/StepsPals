using System;
using Data.Types;

namespace Screens.CollectionScreen
{
    public struct PetInCollectionInfo
    {
        public string PetName { get; private set; }
        public PetType PetSpecies { get; private set; }
        public DateTime PetBirthday { get; private set; }
        
        public PetInCollectionInfo(string petName, PetType petSpecies, DateTime petBirthday)
        {
            PetName = petName;
            PetSpecies = petSpecies;
            PetBirthday = petBirthday;
        }
    }
}