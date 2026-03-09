using Data.Types;

namespace Screens.PetNamingScreen
{
    public struct PetNamingViewInfo
    {
        public bool ResetView { get; private set; }
        public PetType SelectedPetType { get; private set; }

        public PetNamingViewInfo(bool resetView, PetType selectedPetType)
        {
            ResetView = resetView;
            SelectedPetType = selectedPetType;
        }
    }
}