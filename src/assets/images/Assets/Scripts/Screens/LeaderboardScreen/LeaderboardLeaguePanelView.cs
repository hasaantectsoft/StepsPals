using Data.Types;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.LeaderboardScreen
{
    public class LeaderboardLeaguePanelView : MonoBehaviour
    {
        [SerializeField] private SerializedDictionary<LeagueType, Sprite> leaguesPanelsBgs;
        [SerializeField] private SerializedDictionary<LeagueType, Sprite> leaguesCups;
        [SerializeField] private SerializedDictionary<LeagueType, Color> leaguesTextColors;
        [SerializeField] private TextMeshProUGUI leagueName;
        [SerializeField] private Image panelImage;
        [SerializeField] private Image cupImage;

        public void Configure(LeagueType leagueType)
        {
            leagueName.SetText(leagueType.ToString());
            leagueName.color = leaguesTextColors[leagueType];
            panelImage.sprite = leaguesPanelsBgs[leagueType];
            cupImage.sprite = leaguesCups[leagueType];
        }
    }
}