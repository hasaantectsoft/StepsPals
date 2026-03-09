using UnityEngine;
using UnityEngine.UI;

namespace Screens.Shared
{
    public class ScalableGrid : MonoBehaviour
    {
        [SerializeField] private GridLayoutGroup gridLayoutGroup;
        [SerializeField] private float preferableWidth;
        [SerializeField] private float preferableHeight;
        [SerializeField] private RectTransform contentTransform;

        private void Start()
        {
            float aspect = preferableWidth / preferableHeight;
            float parentWidth = contentTransform.rect.width;
            float totalSpacing = gridLayoutGroup.spacing.x * (gridLayoutGroup.constraintCount - 1);

            float cellWidth = (parentWidth - totalSpacing) / gridLayoutGroup.constraintCount;
            float cellHeight = cellWidth / aspect;

            gridLayoutGroup.cellSize = new Vector2(cellWidth, cellHeight);
        }
    }
}