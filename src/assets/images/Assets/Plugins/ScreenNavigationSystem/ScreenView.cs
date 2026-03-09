using UnityEngine;

namespace ScreenNavigationSystem
{
    [RequireComponent(typeof(CanvasGroup))]
    public abstract class ScreenView : MonoBehaviour
    {
        [SerializeField] private bool shouldDeleteAfterHide;

        private CanvasGroup _canvasGroup;

        public bool ShouldDeleteAfterHide => shouldDeleteAfterHide;

        public CanvasGroup CanvasGroup
        {
            get => _canvasGroup ??= GetComponent<CanvasGroup>();
            protected set => _canvasGroup = value;
        }
    }
}