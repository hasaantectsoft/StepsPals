using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

namespace Game
{
    [RequireComponent(typeof(BoxCollider))]
    public class ClickableBehaviour : MonoBehaviour
    {
        [SerializeField] private Collider[] colliders;
        private const float ClickDuration = 0.5f;
        private const float ClickThrottle = 0.3f;
        private const float ClickShiftLimit = 500f;

        private float _allowedDistance;
        private float _aspectRatio;
        private Vector3 _clickPosition;
        private bool _interactable = true;

        private float _mouseDownTime;
        private float _lastClickTime;

        public Action Clicked;

        private void Start()
        {
            float screenWidth = Screen.width;
            float screenHeight = Screen.height;

            _aspectRatio = screenWidth / screenHeight;
            _allowedDistance = ClickShiftLimit / _aspectRatio;
        }

        private void OnMouseDown()
        {
            _mouseDownTime = Time.time;
            _clickPosition = Input.mousePosition;
        }

        private void OnMouseUp()
        {
            PointerEventData pointerData = new(EventSystem.current) {pointerId = -1, position = Input.mousePosition};
            List<RaycastResult> results = new();
            EventSystem.current.RaycastAll(pointerData, results);

            if (results.Count > 0) return;

            float distance = (_clickPosition - Input.mousePosition).sqrMagnitude;

            if (distance >= _allowedDistance) return;

            float duration = Time.time - _mouseDownTime;
            float pauseBetweenClicks = Time.time - _lastClickTime;

            if (EventSystem.current.IsPointerOverGameObject())
                return;

            if (duration <= ClickDuration * Time.timeScale && pauseBetweenClicks >= ClickThrottle && _interactable)
            {
                Clicked?.Invoke();
                _lastClickTime = Time.time;
            }
        }

        public void SetIsActive(bool isActive)
        {
            gameObject.SetActive(isActive);
        }

        public void SetIsInteractable(bool interactable)
        {
            _interactable = interactable;

            foreach (Collider interactionCollider in colliders)
            {
                interactionCollider.enabled = _interactable;
            }
        }
    }
}