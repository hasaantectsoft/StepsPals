using System.Globalization;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.LeaderboardScreen
{
    public class LeaderboardUserPanelView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI nameText;
        [SerializeField] private TextMeshProUGUI stepsCountText;
        [SerializeField] private TextMeshProUGUI numberText;
        [SerializeField] private Image backgroundImage;
        [SerializeField] private Sprite backgroundImageOtherUsers;
        [SerializeField] private Sprite backgroundImageThisUser;
        [SerializeField] private Color stepTextOtherUsersColor;
        [SerializeField] private Color stepTextThisUserColor;

        private NumberFormatInfo _formatInfoForSteps;
        private Transform _transform;

        private void Awake()
        {
            _formatInfoForSteps = new NumberFormatInfo {NumberGroupSeparator = " ", NumberDecimalDigits = 0};
            _transform = gameObject.transform;
        }

        public void Configure(UserPanelInfo info, int index)
        {
            nameText.text = info.PetName;
            stepsCountText.text = info.Steps.ToString("N", _formatInfoForSteps);
            stepsCountText.color = info.IsLocalUser ? stepTextThisUserColor : stepTextOtherUsersColor;
            backgroundImage.sprite = info.IsLocalUser ? backgroundImageThisUser : backgroundImageOtherUsers;
            numberText.text = index.ToString();

            _transform.SetParent(info.Parent);
            _transform.SetAsLastSibling();
        }
    }
}