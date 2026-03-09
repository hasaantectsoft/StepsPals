using Data.Types;
using UnityEngine;
using Utils;

namespace Game.Pets.Animation
{
    public class ConditionsAnimationPoints : MonoBehaviour
    {
        [SerializeField] private SerializedDictionary<PetType, SerializedDictionary<ConditionState, GameObject>> conditionsPositions;

        public Vector3 GetPositionOfAnimation(PetType petType, ConditionState condition) => 
            conditionsPositions[petType][condition].transform.localPosition;
    }
}