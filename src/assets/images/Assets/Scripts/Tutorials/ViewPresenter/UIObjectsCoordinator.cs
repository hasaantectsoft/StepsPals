using System.Collections.Generic;
using System.Linq;
using Data.DataProxy;
using Data.Types;
using UnityEngine;
using Utils;
using Zenject;

namespace Tutorials.ViewPresenter
{
    public class UIObjectsCoordinator : MonoBehaviour
    {
        [SerializeField] private SerializedDictionary<UICoordinatorPoint, RectTransform> pointToTheseObjects;

        private TutorialsDataProxy _tutorialsDataProxy;
        private RectTransform _rootCanvasRectTransform;

        private RectTransform RootCanvasRectTransform
        {
            get
            {
                if (_rootCanvasRectTransform)
                    return _rootCanvasRectTransform;

                List<Canvas> list = new();
                gameObject.GetComponentsInParent(false, list);

                Canvas rootCanvas = list[^1];
                foreach (Canvas canvas in list.Where(canvas => canvas.isRootCanvas))
                {
                    rootCanvas = canvas;
                    break;
                }

                _rootCanvasRectTransform = rootCanvas.GetComponent<RectTransform>();
                return _rootCanvasRectTransform;
            }
        }

        [Inject]
        public void Construct(TutorialsDataProxy tutorialsDataProxy)
        {
            _tutorialsDataProxy = tutorialsDataProxy;
        }

        public void ShowTutorialRectangle(UICoordinatorPoint pointType)
        {
            if (!_tutorialsDataProxy.IsAnyActiveTutorial)
                return;

            RectTransform rectTransform = pointToTheseObjects[pointType];
            _tutorialsDataProxy.ShowUIRectangle(RootCanvasRectTransform.InverseTransformPoint(rectTransform.position),
                rectTransform.rect.size);
        }
    }
}