using System;
using Balances.Tutorials;
using Data.Types;
using UnityEngine;
using Utils;

namespace Balances
{
    [Serializable]
    public class GameBalances
    {
        [field: SerializeField] public int DefaultStepsGoal { get; private set; }
        [field: SerializeField] public IntegerRange StepsGoalRange { get; private set; }
        [field: SerializeField] public SerializedDictionary<PetMaturity, int> GrowthDaysToMature { get; private set; }

        [field: SerializeField]
        public SerializedDictionary<CareActionType, float> ActionOnGoalPercentage { get; private set; }

        [field: SerializeField] public TutorialsBalances TutorialsBalances { get; private set; }
    }
}