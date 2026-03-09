using System;
using Data.Types;
using UnityEngine;

namespace Assets.SpriteAssets
{
    [Serializable]
    public struct PetState
    {
        [SerializeField] public PetType petSpecies;
        [SerializeField] public PetMaturity petMaturity;
        [SerializeField] public ConditionState petCondition;
    }
}