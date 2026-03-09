using System;
using Data.Helpers;
using Data.Types;
using DG.Tweening;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Utils;

namespace Tutorials.ViewPresenter
{
    public class TutorialOverlayView : MonoBehaviour
    {
        [SerializeField] private Canvas tutorialCanvas;
        [SerializeField] private CanvasGroup mainCanvasGroup;
        [SerializeField] private GameObject overlayGo;
        [SerializeField] private Button nextButton;
        [SerializeField] private GameObject sceneMaskObject;
        [SerializeField] private GameObject uiMaskObject;
        [SerializeField] private RectTransform sceneHighlightRectangle;
        [SerializeField] private RectTransform uiHighlightRectangle;
        [SerializeField] private TextMeshProUGUI messageText;
        [SerializeField] private GameObject nextButtonImageGo;
        [SerializeField] private GameObject doneIconImageGo;
        [SerializeField] private GameObject hatchTextBlockGo;
        [SerializeField] private TextMeshProUGUI hatchText;
        [SerializeField] private RectTransform messageBubbleTransform;
        [SerializeField] private SerializedDictionary<BubblePointerPosition, GameObject> bubblePointers;
        [SerializeField] private SerializedDictionary<MessageBubblePosition, RectTransform> messageBubblePositions;

        private const float FadingAnimationDuration = 0.3f;
        private Tween _fadingAnimation;
        
        public event Action NextClicked;

        private void OnDestroy()
        {
            _fadingAnimation?.Kill();
        }

        public void Initialize()
        {
            nextButton.ActionWithThrottle(() => NextClicked?.Invoke());
            mainCanvasGroup.alpha = 0f;
        }

        public void ShowBackground(bool isShow)
        {
            mainCanvasGroup.interactable = isShow;
            mainCanvasGroup.blocksRaycasts = isShow;
            _fadingAnimation?.Kill();
            _fadingAnimation = mainCanvasGroup.DOFade( isShow ? 1f : 0f, FadingAnimationDuration);
        }

        public void ConfigureStep(TutorialStepViewInfo viewInfo, PetType petType)
        {
            tutorialCanvas.sortingOrder = viewInfo.SortOrder;
            messageText.text = viewInfo.StringFormatText
                ? string.Format(viewInfo.Text, ContentHelper.BabyPetTypeNames[petType]) : viewInfo.Text;

            bool isClickAction = viewInfo.TutorialStepActionType == TutorialStepActionType.NextButtonClick;

            nextButton.gameObject.SetActive(isClickAction);
            nextButtonImageGo.SetActive(isClickAction && !viewInfo.IsDoneIconActive);
            doneIconImageGo.SetActive(viewInfo.IsDoneIconActive);
            SetMessageBubblePosition(viewInfo.MessageBubblePosition);
            ConfigureTextAboveOverlay(viewInfo.TextAboveOverlay, viewInfo.IsHatchTextActive);
            SetOverlayActive(viewInfo.OverlayActive);

            foreach ((BubblePointerPosition bubblePointerPosition, GameObject go) in bubblePointers.Dictionary)
            {
                go.SetActive(bubblePointerPosition == viewInfo.BubblePointerPosition);
            }
        }

        private void SetMessageBubblePosition(MessageBubblePosition messageBubblePosition)
        {
            messageBubbleTransform.gameObject.SetActive(messageBubblePosition != MessageBubblePosition.None);
            if (messageBubblePosition == MessageBubblePosition.None)
                return;

            Vector3 currentPos = messageBubbleTransform.position;
            messageBubbleTransform.position = new Vector3(currentPos.x,
                messageBubblePositions[messageBubblePosition].position.y, currentPos.z);
        }

        public void SetSceneHighlightRectangleActive(bool active)
        {
            SetHighlightRectangleActive(sceneMaskObject, sceneHighlightRectangle, active);
        }

        public void SetUIHighlightRectangleActive(bool active)
        {
            SetHighlightRectangleActive(uiMaskObject, uiHighlightRectangle, active);
        }

        private void SetHighlightRectangleActive(GameObject maskObject, RectTransform highlightRectangle, bool active)
        {
            maskObject.SetActive(active);
            highlightRectangle.gameObject.SetActive(active);
            highlightRectangle.localScale = Vector3.one;
        }

        public void ConfigureSceneHighlightRectangle(Vector3 position, float width, float height)
        {
            RectTransformUtility.ScreenPointToLocalPointInRectangle(tutorialCanvas.transform as RectTransform, position,
                tutorialCanvas.renderMode == RenderMode.ScreenSpaceOverlay ? null : tutorialCanvas.worldCamera,
                out Vector2 uiAnchoredPosition);
            sceneHighlightRectangle.anchoredPosition = uiAnchoredPosition;
            sceneHighlightRectangle.sizeDelta = new Vector2(width, height);
        }

        public void ConfigureUIHighlightRectanglePosition(Vector3 position, float width, float height)
        {
            SetUIHighlightRectangleActive(true);
            uiHighlightRectangle.anchoredPosition = position;
            uiHighlightRectangle.sizeDelta = new Vector2(width, height);
        }

        private void SetOverlayActive(bool active)
        {
            overlayGo.SetActive(active);
        }

        private void ConfigureTextAboveOverlay(string text, bool active)
        {
            hatchText.text = text;
            hatchTextBlockGo.SetActive(active);
        }
    }
}