using UnityEngine;

namespace Utils
{
    public static class PlayerPrefsHelper
    {
        private const string IsLinkedSocialKey = "LinkedSocial";
        private const string IsGameRatedByPlayerKey = "IsGameRatedByPlayer";
        private const string IsDayEndSuccessfulRateUsCalledKey = "IsDayEndSuccessfulRateUsCalled";
        private const string DeviceIdKey = "DeviceUniqueID";
        private const string IsLoginByButtonKey = "IsLoginByButton";

        public static bool IsGameRatedByPlayer
        {
            get => PlayerPrefs.GetInt(IsGameRatedByPlayerKey, 0) == 1;
            set
            {
                PlayerPrefs.SetInt(IsGameRatedByPlayerKey, value ? 1 : 0);
                PlayerPrefs.Save();
            }
        }

        public static bool IsDayEndSuccessfulRateUsCalled
        {
            get => PlayerPrefs.GetInt(IsDayEndSuccessfulRateUsCalledKey, 0) == 1;
            set
            {
                PlayerPrefs.SetInt(IsDayEndSuccessfulRateUsCalledKey, value ? 1 : 0);
                PlayerPrefs.Save();
            }
        }

        public static bool IsLinkedSocial
        {
            get => PlayerPrefs.GetInt(IsLinkedSocialKey, 0) == 1;
            set
            {
                PlayerPrefs.SetInt(IsLinkedSocialKey, value ? 1 : 0);
                PlayerPrefs.Save();
            }
        }

        public static string DeviceUniqueId
        {
            get => PlayerPrefs.GetString(DeviceIdKey, null);
            set
            {
                PlayerPrefs.SetString(DeviceIdKey, value);
                PlayerPrefs.Save();
            }
        }

        public static bool IsLoginByButton
        {
            get => PlayerPrefs.GetInt(IsLoginByButtonKey, 0) == 1;
            set
            {
                PlayerPrefs.SetInt(IsLoginByButtonKey, value ? 1 : 0);
                PlayerPrefs.Save();
            }
        }
    }
}