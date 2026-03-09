using Data.Types;

namespace Screens.ConditionsPopup
{
    public struct ConditionsPopupViewInfo
    {
        public ConditionState Condition { get; private set; }
        public string PetName { get; private set; }

        public ConditionsPopupViewInfo(ConditionState condition, string petName)
        {
            Condition = condition;
            PetName = petName;
        }
    }
}