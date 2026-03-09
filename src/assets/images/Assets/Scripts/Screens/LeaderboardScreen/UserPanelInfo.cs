using UnityEngine;

namespace Screens.LeaderboardScreen
{
    public struct UserPanelInfo
    {
        public string PetName { get; }
        public int Steps { get; }
        public bool IsLocalUser { get; }
        public Transform Parent { get; set; }

        public UserPanelInfo(string petName, int steps, bool isLocalUser)
        {
            PetName = petName;
            Steps = steps;
            IsLocalUser = isLocalUser;
            Parent = null;
        }
    }
}