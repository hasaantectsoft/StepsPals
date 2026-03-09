using UnityEngine;
using UnityEngine.UI;

namespace ScreenNavigationSystem
{
    [RequireComponent(typeof(Canvas))]
    [RequireComponent(typeof(GraphicRaycaster))]
    public class UILayerConfigurator : MonoBehaviour
    {
        [SerializeField] private int layer;

        private Canvas _canvas;
        private int _defaultLayerNum;
        private int _nowLayerNum;

        public int OrderLayer => layer;

        private void Awake()
        {
            _nowLayerNum = _defaultLayerNum = UILayerSettings.LayerSettings.GetSortingOrderByLayer(layer);
            if (_canvas != null)
            {
                return;
            }

            SetOrder(_defaultLayerNum);
            _canvas.overrideSorting = true;
            _canvas.sortingLayerName = UILayerSettings.LayerSettings.SortingLayerName;
        }

        public void BackToDefaultOrder() => SetOrder(_nowLayerNum);

        public void SetShowAnimatingOrder() =>
            SetOrder(_defaultLayerNum + UILayerSettings.LayerSettings.ShowAnimationOrderShift);

        public void SetHideAnimatingOrder() =>
            SetOrder(_defaultLayerNum + UILayerSettings.LayerSettings.HideAnimationOrderShift);

        public void SetDefaultLayer(int shift = 1)
        {
            _nowLayerNum = _defaultLayerNum + shift;
            SetOrder(_nowLayerNum);
        }

        private void SetOrder(int order)
        {
            _canvas ??= GetComponent<Canvas>();
            _canvas.sortingOrder = order;
        }
    }
}