using Data.Types;
using UnityEngine;
using Utils;

namespace Game.Pets.Animation
{
    public class CareActionsPoints : MonoBehaviour
    {
        [SerializeField] private SerializedDictionary<CareActionType, GameObject> careActionsAnimations;
        [SerializeField] private SerializedDictionary<PetType, GameObject> drinkingPositions;

        public Vector3 GetPositionOfAnimation(PetType petType, CareActionType actionType) =>
            actionType == CareActionType.GiveWater ? drinkingPositions[petType].transform.localPosition
                : careActionsAnimations[actionType].transform.localPosition;
    }
}