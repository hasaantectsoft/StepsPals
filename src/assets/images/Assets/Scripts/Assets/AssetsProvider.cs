using System.Collections.Generic;
using Assets.SpriteAssets;
using Data.Types;
using UnityEngine;

namespace Assets
{
    public class AssetsProvider
    {
        private readonly Dictionary<PetState, Sprite> _petsSprites = new();
        private readonly Dictionary<PetType, Sprite> _petsGraves = new();
        private readonly Dictionary<LeagueType, Sprite> _leagueCups = new();

        public AssetsProvider(SpriteAssetsSO spriteAssets)
        {
            foreach ((PetState state, Sprite asset) in spriteAssets.PetsSprites.Dictionary)
            {
                _petsSprites[state] = asset;
            }

            foreach ((PetType type, Sprite asset) in spriteAssets.PetsGravesSprites.Dictionary)
            {
                _petsGraves[type] = asset;
            }

            foreach ((LeagueType type, Sprite asset) in spriteAssets.LeagueCupSprites.Dictionary)
            {
                _leagueCups[type] = asset;
            }
        }

        public Sprite GetPetSprite(PetType petSpecies, PetMaturity petMaturity, ConditionState petCondition) =>
            _petsSprites[
                new PetState {petSpecies = petSpecies, petCondition = petCondition, petMaturity = petMaturity}];

        public Sprite GetPetGraveSprite(PetType petSpecies) => _petsGraves[petSpecies];
        public Sprite GetLeagueCupSprite(LeagueType leagueType) => _leagueCups[leagueType];

        public Sprite GetPetEggSprite(PetType species) =>
            GetPetSprite(species, PetMaturity.Egg, ConditionState.Healthy);
    }
}