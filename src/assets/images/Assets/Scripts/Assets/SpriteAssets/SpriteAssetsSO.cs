using Data.Types;
using UnityEngine;
using Utils;

namespace Assets.SpriteAssets
{
    [CreateAssetMenu(fileName = "SpriteAssetsSO", menuName = "SO/GameAssets/SpriteAssets")]
    public class SpriteAssetsSO : ScriptableObject
    {
        [field: SerializeField] public SerializedDictionary<PetState, Sprite> PetsSprites { get; private set; }
        [field: SerializeField] public SerializedDictionary<PetType, Sprite> PetsGravesSprites { get; private set; }
        [field: SerializeField] public SerializedDictionary<LeagueType, Sprite> LeagueCupSprites { get; private set; }
    }
}