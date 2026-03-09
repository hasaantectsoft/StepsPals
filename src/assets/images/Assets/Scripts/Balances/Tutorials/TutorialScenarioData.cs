using System;
using Data.Types;
using UnityEngine;

namespace Balances.Tutorials
{
    [Serializable]
    public class TutorialScenarioData
    {
        [field: SerializeField] public TutorialScenarioId Id { get; private set; }
        [field: SerializeField] public TutorialStepSo[] StepsSo { get; private set; }
    }
}