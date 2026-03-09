using UnityEngine;

namespace Utils
{
    public static class ColorsStorage
    {
        public static Color RedErrorColor = new(0.85f, 0.25f, 0.25f);
        public static Color RedBorderErrorColor = new(0.47f, 0.21f, 0.21f);
        public static Color LightBrownForText = new(0.43f, 0.36f, 0.32f);
        public static Color LighterBrownForText = new(0.5f, 0.43f, 0.35f);
        public static Color HealthyTextColor = new(1f, 0.99f, 0.43f);
        public static Color SickTextColor = new(0.75f, 1f, 0.31f);
        public static Color VerySickTextColor = new(0.88f, 0.5f, 0.98f);
        public static Color DeadTextColor = new(0.85f, 0.26f, 1f);
        public static Color VerySickPopupTextColor = new(0.12f, 0.42f, 0.61f);
        public static Color PetNameDeathPopupText = new(0.99f, 0.93f, 0.15f);
        public static Color DarkBrownPopupText = new(0.4f, 0.16f, 0.04f);
        public static Color StatisticsTextColor = new(0.43f, 0.3f, 0.07f);
    }
}