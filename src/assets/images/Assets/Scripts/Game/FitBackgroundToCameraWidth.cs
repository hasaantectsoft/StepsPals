using UnityEngine;

namespace Game
{
    [RequireComponent(typeof(SpriteRenderer))]
    public class FitBackgroundToCameraWidth : MonoBehaviour
    {
        [SerializeField] private SpriteRenderer spriteRenderer;

        private Vector2 _lastScreenSize;

        private void Awake()
        {
            _lastScreenSize = new Vector2(Screen.width, Screen.height);
            FitToWidth();
        }

        private void Update()
        {
            if (!Mathf.Approximately(Screen.width, _lastScreenSize.x) ||
                !Mathf.Approximately(Screen.height, _lastScreenSize.y))
            {
                _lastScreenSize = new Vector2(Screen.width, Screen.height);
                FitToWidth();
            }
        }

        private void FitToWidth()
        {
            if (!spriteRenderer.sprite)
            {
                return;
            }

            if (!Camera.main)
            {
                return;
            }

            float cameraHeight = Camera.main.orthographicSize * 2f;
            float cameraWidth = cameraHeight * Screen.width / Screen.height;
            Vector2 spriteSize = spriteRenderer.sprite.bounds.size;
            Vector3 scale = transform.localScale;
            scale.x = cameraWidth / spriteSize.x;
            scale.y = scale.x;
            transform.localScale = scale;
        }
    }
}