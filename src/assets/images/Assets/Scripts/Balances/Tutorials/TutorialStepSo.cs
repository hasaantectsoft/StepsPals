using Analytics;
using Data.Types;
using NaughtyAttributes;
using Tutorials;
using Tutorials.ViewPresenter;
using UnityEngine;

namespace Balances.Tutorials
{
    [CreateAssetMenu(fileName = "TutorialStepSo", menuName = "SO/Tutorial/Tutorial Step")]
    public class TutorialStepSo : ScriptableObject
    {
        [field: SerializeField] public DevToDevKey DevToDevKey { get; private set; }
        [field: SerializeField] public bool CanSkipTutorial { get; private set; }
        [field: SerializeField] public bool OverlayActive { get; private set; } = true;

        [field: SerializeField, Header("UI"), Space]
        public int DialogCanvasDrawOrder { get; private set; } = 250;

        [field: SerializeField] public UICoordinatorPoint HighlightUIObject { get; private set; }

        [field: SerializeField] public SceneObjectId HighlightSceneObject { get; private set; }

        [field: SerializeField, ShowIf(nameof(HasHighlightSceneObject))]
        public Vector2 HighlightMaskSceneSize { get; private set; }

        [field: SerializeField] public bool ShowDoneIcon { get; private set; }

        [field: Header("Step Message"), Space] [field: SerializeField, AllowNesting]
        public string Message { get; private set; }

        [field: SerializeField, ShowIf(nameof(HasMessage))]
        public bool StringFormatText { get; private set; }

        [field: SerializeField] public MessageBubblePosition MessageBubblePosition { get; private set; }

        [field: SerializeField] public BubblePointerPosition BubblePointerPosition { get; private set; }

        [field: Header("Logic"), Space] [field: SerializeField, AllowNesting]
        public TutorialStepActionType Action { get; private set; }

        [field: SerializeField] public CareActionType LastCareAction { get; private set; } = CareActionType.None;

        [field: Header("Above Overlay Text"), Space] [field: SerializeField, AllowNesting]
        public bool IsTextActive { get; private set; }

        [field: SerializeField, ShowIf(nameof(IsTextActive))]
        public string Text { get; private set; }

        private bool HasHighlightSceneObject => HighlightSceneObject != SceneObjectId.None;
        private bool HasMessage => !string.IsNullOrWhiteSpace(Message);
    }
}