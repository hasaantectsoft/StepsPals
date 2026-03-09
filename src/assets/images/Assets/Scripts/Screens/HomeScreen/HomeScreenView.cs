using System;
using System.Collections.Generic;
using Cysharp.Threading.Tasks;
using Data.Types;
using DG.Tweening;
using ScreenNavigationSystem;
using Screens.Shared.Buttons;
using TMPro;
using Tutorials.ViewPresenter;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Screens.HomeScreen
{
    public class HomeScreenView : ScreenView
    {
        private const float StepsBarAnimationDuration = 0.2f;

        [SerializeField] private GameObject topPanelGo;
        [SerializeField] private SerializedDictionary<CareActionType, CareActionButton> careActionsButtons;
        [SerializeField] private Slider stepsGoalBar;
        [SerializeField] private TextMeshProUGUI stepsText;
        [SerializeField] private GameObject hatchTextBlockGo;
        [SerializeField] private Canvas progressBarWithButtonCanvas;
        [SerializeField] private TextMeshProUGUI hatchText;
        [SerializeField] private GameObject overlayGo;
        [SerializeField] private UIObjectsCoordinator tutorialObjectsCoordinator;
        [SerializeField] private GraphicRaycaster progressBarRaycaster;
        [SerializeField] private CustomButton collectionButton;
        [SerializeField] private CustomButton newPetButton;

        public IReadOnlyDictionary<CareActionType, CareActionButton> CareActionsButtons =>
            careActionsButtons.Dictionary;

        public event Action<CareActionType> ClickedCareAction;
        public event Action<CareActionType> ClickedInactiveCareButton;
        public event Action ClickedCollectionButton;
        public event Action ClickedNewPetButton;

        private void Awake()
        {
            foreach ((CareActionType type, CareActionButton button) in careActionsButtons.Dictionary)
            {
                button.FinishedClicking += () =>
                {
                    ClickedCareAction?.Invoke(type);
                    TryHideHintBubblesInCareActionButtons(type);
                };
                button.ClickedInactiveButton += () => { ClickedInactiveCareButton?.Invoke(type); };
            }

            collectionButton.FinishedClicking += () => { ClickedCollectionButton?.Invoke(); };
            newPetButton.FinishedClicking += () => { ClickedNewPetButton?.Invoke(); };
        }

        public void Configure()
        {
            foreach ((CareActionType _, CareActionButton button) in careActionsButtons.Dictionary)
            {
                button.Configure();
            }
        }

        public void SetCareActionState(CareActionType careAction, CareActionState state, string hintText,
            bool showHintOnDisabled)
        {
            careActionsButtons[careAction].SetActionState(state, hintText, showHintOnDisabled);
        }

        public void UpdateStepsSlider(int currentSteps, int stepsGoal)
        {
            stepsText.text = string.Format(StringKeys.StepsStatusText, currentSteps, stepsGoal);
            DOTween.Kill(stepsGoalBar);
            stepsGoalBar.DOValue(stepsGoal == 0 ? 0 : currentSteps / (float)stepsGoal, StepsBarAnimationDuration)
                .SetTarget(stepsGoalBar);
        }

        public void SetHatchTextBlockActive(bool active) => hatchTextBlockGo.SetActive(active);

        public void SetHatchText(string text)
        {
            hatchText.text = text;
        }

        public void SetTopPanelActive(bool active) => topPanelGo.SetActive(active);
        public void SetOverlayActive(bool active) => overlayGo.SetActive(active);

        public void ShowTutorialRectangleOverlay(UICoordinatorPoint point, int tutorialSortOrder)
        {
            bool isNotProgressBar = point != UICoordinatorPoint.StepsProgressBar;
            progressBarWithButtonCanvas.sortingOrder = isNotProgressBar ? 1 : tutorialSortOrder + 1;
            progressBarRaycaster.enabled = isNotProgressBar;

            if (isNotProgressBar && point != UICoordinatorPoint.None)
            {
                tutorialObjectsCoordinator.ShowTutorialRectangle(point);
            }

            if (point == UICoordinatorPoint.FeedingCareActionButton)
            {
                careActionsButtons[CareActionType.Feed].SetActionState(CareActionState.Available, string.Empty, false);
            }
        }

        public void TryHideHintBubblesInCareActionButtons(CareActionType notHide)
        {
            foreach (CareActionType buttonType in careActionsButtons.Dictionary.Keys)
            {
                if (buttonType == notHide)
                {
                    continue;
                }

                careActionsButtons[buttonType].HideHintBubble().Forget();
            }
        }

        public void SetNewPetButtonActive(bool active)
        {
            newPetButton.gameObject.SetActive(active);
        }

        public void SetCollectionButtonActive(bool active)
        {
            collectionButton.gameObject.SetActive(active);
        }

        public void PlayPulsingStarAnimation(bool play)
        {
            careActionsButtons[CareActionType.GiveTreat].PlayPulsingAnimation(play);
        }
    }
}