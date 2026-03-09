using System;
using Assets;
using Cysharp.Threading.Tasks;
using Data.Types;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.ResultPopup
{
    public class ResultPopupView : ScreenView
    {
        [SerializeField] private SerializedDictionary<LeagueType, Color> backgroundColors;
        [SerializeField] private SerializedDictionary<LeagueType, Color> glareColors;
        [SerializeField] private SerializedDictionary<LeagueType, Color> leagueTextColors;
        [SerializeField] private SerializedDictionary<LeagueType, Color> titleColors;
        [SerializeField] private SerializedDictionary<LeagueType, Color> mainTextColors;

        [SerializeField] private CloseButton closeButton;
        [SerializeField] private Transform paw;
        [SerializeField] private Image background;
        [SerializeField] private Image cupImage;
        [SerializeField] private Image glareImage;
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private TextMeshProUGUI leagueNameText;
        [SerializeField] private TextMeshProUGUI mainText;
        [SerializeField] private GameObject rankedGameObject;
        [SerializeField] private GameObject unrankedGameObject;

        private AssetsProvider _assetsProvider;

        public event Action ClickedCloseButton;

        public void Initialize(AssetsProvider assetsProvider)
        {
            _assetsProvider = assetsProvider;
            closeButton.Clicked += () => ClickedCloseButton?.Invoke();
        }

        public void Configure(ResultPopupInfo info)
        {
            LeagueType leagueType = info.League;
            bool ranked = leagueType != LeagueType.Unranked;
            rankedGameObject.SetActive(ranked);
            unrankedGameObject.SetActive(!ranked);

            background.color = backgroundColors[leagueType];
            glareImage.color = glareColors[leagueType];

            if (!ranked)
            {
                return;
            }

            cupImage.sprite = _assetsProvider.GetLeagueCupSprite(leagueType);
            titleText.color = titleColors[leagueType];
            leagueNameText.color = leagueTextColors[leagueType];
            leagueNameText.text = string.Format(StringKeys.ResultPopupLeagueFormat, leagueType.ToString());
            mainText.color = mainTextColors[leagueType];
            mainText.text = string.Format(StringKeys.ResultPopupTextFormat, info.StepsCount.ToString("N0"));
        }

        public void PlayPawAnimation()
        {
            Animations.PlayScaleAnimation(paw).Forget();
        }
    }
}