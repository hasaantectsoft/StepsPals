using System;
using Data.Types;
using Game.HomeRoom.Environment;
using TMPro;
using UnityEngine;
using Utils;

namespace Game.HomeRoom
{
    public class HomeRoomView : MonoBehaviour
    {
        [field: SerializeField] public EggView EggView { get; private set; }
        [SerializeField] private TextMeshPro petNameText;
        [SerializeField] private TextMeshPro petStatusText;
        [SerializeField] private ClickableBehaviour clickablePetName;
        [SerializeField] private GameObject concealableBackgroundObjects;
        [SerializeField] private SerializedDictionary<SceneObjectId, GameObject> sceneObjectsCoordinator;
        [SerializeField] private BallView ballView;
        [SerializeField] private WindowView windowView;
        
        public event Action PetNameClicked;
        public event Action EggClicked;

        public void Initialize()
        {
            clickablePetName.Clicked += () => PetNameClicked?.Invoke();
            EggView.EggClicked += () => EggClicked?.Invoke();
            SetPetNameInteractable(false);
        }

        public void Configure(string petName, Sprite eggImage)
        {
            petNameText.text = petName;
            EggView.SetEggSprite(eggImage);
        }

        public void ShowPetCracks(int index) => EggView.ShowPetCracks(index);

        public void HideAllPetCracks() => EggView.HideAllPetCracks();

        public void SetConcealableObjectsActive(bool active) => concealableBackgroundObjects.SetActive(active);

        public void SetEggClickInteractable(bool interactable) => EggView.SetClickInteractable(interactable);
        public void SetPetNameInteractable(bool interactable) => clickablePetName.SetIsInteractable(interactable);

        public void ShowPetData(bool show)
        {
            petStatusText.gameObject.SetActive(show);
            petNameText.gameObject.SetActive(show);
        }

        public void SetPetStatusText(string status, Color colorText) =>
            petStatusText.text = string.Format(StringKeys.PetStatusOnMonitorText, status,
                ColorUtility.ToHtmlStringRGBA(colorText));

        public Vector3 GetSceneObjectPosition(SceneObjectId sceneObjectId) => 
            sceneObjectsCoordinator[sceneObjectId].transform.position;

        public void SetEggActive(bool active) => EggView.SetEggActive(active);
        
        public void PlayEggShakeAnimation() => EggView.PlayShakeAnimation();

        public void PlayEnvironmentAnimations()
        {
            ballView.PlayBallBackAndForthRollingAnimation();
            windowView.PlayCloudAnimation();
        }
    }
}