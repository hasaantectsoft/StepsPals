using Data.Types;

namespace Screens.StepGoalSetupScreen
{
    public struct StepGoalSetUpScreenInfo
    {
        public PetType PetType { get; private set; }
        public string PetName { get; private set; }

        public StepGoalSetUpScreenInfo(PetType petType, string petName)
        {
            PetType = petType;
            PetName = petName;
        }
    }
}