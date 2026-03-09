using System;
using Data.Types;
using Sounds;
using UnityEngine;

namespace Tutorials.ViewPresenter
{
    public class TutorialOverlayPresenter : MonoBehaviour
    {
        [SerializeField] private TutorialOverlayView view;

        public Action NextButtonClicked;

        private void Awake()
        {
            view.Initialize();
            view.NextClicked += OnNextClicked;
            ClearOverlay();
        }

        private void OnNextClicked()
        {
            NextButtonClicked?.Invoke();
            SoundsManager.PlaySound(AudioKey.CustomButtonClickSound);
        }

        public void PrepareStepToShow(TutorialStepViewInfo viewInfo, PetType petType)
        {
            view.ConfigureStep(viewInfo, petType);
        }

        public void ShowOverlay()
        {
            view.ShowBackground(true);
        }

        public void ClearOverlay()
        {
            view.ShowBackground(false);
        }

        public void SetHighlightRectangleActive(bool isActive) => view.SetSceneHighlightRectangleActive(isActive);
        public void SetUIHighlightRectangleActive(bool isActive) => view.SetUIHighlightRectangleActive(isActive);

        public void ConfigureSceneHighlightRectangle(Vector3 position, float width, float height)
        {
            view.ConfigureSceneHighlightRectangle(position, width, height);
        }

        public void ConfigureUIHighlightRectangle(Vector3 position, float width, float height)
        {
            view.ConfigureUIHighlightRectanglePosition(position, width, height);
        }
    }
}