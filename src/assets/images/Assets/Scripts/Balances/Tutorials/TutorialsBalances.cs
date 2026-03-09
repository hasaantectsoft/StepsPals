using Data.Types;
using UnityEngine;

namespace Balances.Tutorials
{
    [CreateAssetMenu(fileName = "TutorialsBalances", menuName = "SO/Tutorial/Tutorials Balances")]
    public class TutorialsBalances : ScriptableObject
    {
        [field: SerializeField] public TutorialScenarioData[] Scenarios { get; private set; }

        public TutorialScenarioData GetTutorialBalances(TutorialScenarioId tutorialId)
        {
            foreach (TutorialScenarioData scenario in Scenarios)
            {
                if (scenario.Id == tutorialId)
                {
                    return scenario;
                }
            }

            return null;
        }
    }
}