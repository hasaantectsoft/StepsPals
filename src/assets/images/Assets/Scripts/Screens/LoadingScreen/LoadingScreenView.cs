using DG.Tweening;
using ScreenNavigationSystem;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.LoadingScreen
{
    public class LoadingScreenView : ScreenView
    {
        [SerializeField] private TextMeshProUGUI loadingText;
        [SerializeField] private Slider progressBar;

        private const float DurationOfAnimation = 0.4f;

        public void SetLoadingProgress(float progress, bool withAnimation)
        {
            if (withAnimation)
            {
                progressBar.DOKill();
                progressBar.DOValue(progress, DurationOfAnimation);
            }
            else
            {
                progressBar.value = progress;
            }

            loadingText.text = string.Format(StringKeys.LoadingText, (int)(progress * 100f));
        }
    }
}