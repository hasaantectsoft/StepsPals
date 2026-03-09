using Data.Types;

namespace Screens.EvolutionStagePopup
{
    public struct EvolutionStagePopupViewInfo
    {
        public PetType PetSpecies { get; private set; }
        public PetMaturity MaturityStage { get; private set; }
        public string PetName { get; private set; }

        public EvolutionStagePopupViewInfo(PetType petSpecies, PetMaturity maturityStage, string petName)
        {
            PetSpecies = petSpecies;
            MaturityStage = maturityStage;
            PetName = petName;
        }
    }
}