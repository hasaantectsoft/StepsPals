using System;
using System.Collections.Generic;
using Data.Types;
using Screens.PetMenuScreen;
using Sounds;
using UnityEngine;
using Utils;

namespace Data.Helpers
{
    public static class ContentHelper
    {
        public static readonly Dictionary<PetType, string> PetTypeNames = new()
        {
            {PetType.Dino, StringKeys.DinoTypeName},
            {PetType.Dog, StringKeys.DogTypeName},
            {PetType.Cat, StringKeys.CatTypeName},
        };

        public static readonly Dictionary<PetType, string> BabyPetTypeNames = new()
        {
            {PetType.Dino, StringKeys.BabyDinoTypeName},
            {PetType.Dog, StringKeys.BabyDogTypeName},
            {PetType.Cat, StringKeys.BabyCatTypeName},
        };

        public static readonly Dictionary<PetMenuInfoType, string> PetMenuInfoLabels = new()
        {
            {PetMenuInfoType.Species, StringKeys.Species},
            {PetMenuInfoType.Age, StringKeys.Age},
            {PetMenuInfoType.Condition, StringKeys.Condition},
            {PetMenuInfoType.MatureStage, StringKeys.MatureStage},
            {PetMenuInfoType.MissedDays, StringKeys.MissedDays},
        };

        public static readonly Dictionary<CareActionType, AudioKey> CareActionsSounds = new()
        {
            {CareActionType.Feed, AudioKey.ChewingFoodSound},
            {CareActionType.GiveWater, AudioKey.DrinkingWaterSound},
            {CareActionType.CleanPoop, AudioKey.CleanUpPoopSound}
        };

        public static readonly Dictionary<ConditionState, string> ConditionsStrings = new()
        {
            {ConditionState.Healthy, StringKeys.Healthy},
            {ConditionState.Sick, StringKeys.Sick},
            {ConditionState.VerySick, StringKeys.VerySick},
            {ConditionState.Dead, StringKeys.Dead},
        };

        public static readonly Dictionary<ConditionState, string> ConditionsForMonitor = new()
        {
            {ConditionState.Healthy, StringKeys.HealthyOnMonitor},
            {ConditionState.Sick, StringKeys.Sick},
            {ConditionState.VerySick, StringKeys.VerySick},
            {ConditionState.Dead, StringKeys.Dead},
        };

        public static readonly Dictionary<ConditionState, Color> ConditionsColorsForMonitor = new()
        {
            {ConditionState.Healthy, ColorsStorage.HealthyTextColor},
            {ConditionState.Sick, ColorsStorage.SickTextColor},
            {ConditionState.VerySick, ColorsStorage.VerySickTextColor},
            {ConditionState.Dead, ColorsStorage.DeadTextColor},
        };

        public static ConditionState GetConditionStateByMissedDays(int missedDays)
        {
            return missedDays switch
            {
                0 => ConditionState.Healthy,
                1 => ConditionState.Sick,
                2 => ConditionState.VerySick,
                > 2 => ConditionState.Dead,
                _ => throw new ArgumentOutOfRangeException(nameof(missedDays), missedDays, null)
            };
        }

        public static string GetTextForConditionsPopup(ConditionState conditionState)
        {
            return conditionState switch
            {
                ConditionState.Sick => StringKeys.SickPopupText,
                ConditionState.VerySick => StringKeys.VerySickPopupText,
                _ => throw new ArgumentOutOfRangeException(nameof(conditionState), conditionState, null)
            };
        }

        public static string GetTitleTextForEvolutionsPopup(PetMaturity maturity)
        {
            return maturity switch
            {
                PetMaturity.Teen => StringKeys.TeenPopupTitle,
                PetMaturity.Adult => StringKeys.AdultPopupTitle,
                _ => throw new ArgumentOutOfRangeException(nameof(maturity), maturity, null)
            };
        }

        public static string GetSubtitleTextForEvolutionsPopup(PetMaturity maturity)
        {
            return maturity switch
            {
                PetMaturity.Teen => StringKeys.TeenPopupSubtitle,
                PetMaturity.Adult => StringKeys.AdultPopupSubtitle,
                _ => throw new ArgumentOutOfRangeException(nameof(maturity), maturity, null)
            };
        }

        public static string GetMainTextForEvolutionsPopup(PetMaturity maturity)
        {
            return maturity switch
            {
                PetMaturity.Teen => StringKeys.TeenPopupMainText,
                PetMaturity.Adult => StringKeys.AdultPopupMainText,
                _ => throw new ArgumentOutOfRangeException(nameof(maturity), maturity, null)
            };
        }

        public static string GetPetMenuMeasuresPlural(PetMenuInfoType type)
        {
            return type switch
            {
                PetMenuInfoType.Age or PetMenuInfoType.Growth => StringKeys.AgeMeasurePlural,
                _ => string.Empty,
            };
        }

        public static string GetPetMenuMeasuresSingular(PetMenuInfoType type)
        {
            return type switch
            {
                PetMenuInfoType.Age or PetMenuInfoType.Growth => StringKeys.AgeMeasureSingular,
                _ => string.Empty,
            };
        }
    }
}