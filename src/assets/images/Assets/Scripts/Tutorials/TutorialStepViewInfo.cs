using Tutorials.ViewPresenter;

namespace Tutorials
{
    public struct TutorialStepViewInfo
    {
        public string Text { get; }
        public TutorialStepActionType TutorialStepActionType { get; }
        public int SortOrder { get; }
        public BubblePointerPosition BubblePointerPosition { get; }
        public bool IsDoneIconActive { get; }
        public string TextAboveOverlay { get; }
        public bool IsHatchTextActive { get; }
        public bool StringFormatText { get; }
        public bool OverlayActive { get; }
        public MessageBubblePosition MessageBubblePosition { get; }

        public TutorialStepViewInfo(string text, TutorialStepActionType tutorialStepActionType, int sortOrder,
            BubblePointerPosition bubblePointerPosition, bool isDoneIconActive, string textAboveOverlay,
            bool isHatchTextActive, bool stringFormatText, MessageBubblePosition messageBubblePosition,
            bool overlayActive)
        {
            Text = text;
            TutorialStepActionType = tutorialStepActionType;
            SortOrder = sortOrder;
            BubblePointerPosition = bubblePointerPosition;
            IsDoneIconActive = isDoneIconActive;
            TextAboveOverlay = textAboveOverlay;
            IsHatchTextActive = isHatchTextActive;
            StringFormatText = stringFormatText;
            MessageBubblePosition = messageBubblePosition;
            OverlayActive = overlayActive;
        }
    }
}