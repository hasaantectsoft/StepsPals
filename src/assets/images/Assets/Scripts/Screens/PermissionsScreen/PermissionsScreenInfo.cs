using Data.Types;

namespace Screens.PermissionsScreen
{
    public struct PermissionsScreenInfo
    {
        public PetType PetType { get; private set; }
        public string PetName { get; private set; }
        public int StepGoal { get; private set; }

        public PermissionsScreenInfo(PetType petType, string petName, int stepGoal)
        {
            PetType = petType;
            PetName = petName;
            StepGoal = stepGoal;
        }
    }
}