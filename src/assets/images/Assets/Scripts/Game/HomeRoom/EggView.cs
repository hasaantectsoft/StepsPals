using System;
using DG.Tweening;
using UnityEngine;

namespace Game.HomeRoom
{
    public class EggView : MonoBehaviour
    {
        [field: SerializeField] public SpriteRenderer[] EggCracks { get; private set; }
        [SerializeField] private SpriteRenderer egg;
        [SerializeField] private ClickableBehaviour eggClickableZone;

        private const float ShakeAnimationDuration = 0.1f;
        private readonly Vector3 _shakeStrength = new(0.14f, 0.07f, 0f);
        
        private Transform _transform;
        private Vector3 _basePosition;
        private Tween _shakeAnimation;
        
        public event Action EggClicked;

        private void Awake()
        {
            eggClickableZone.Clicked += () => EggClicked?.Invoke();
            
            _transform = transform;
            _basePosition = _transform.localPosition;
        }

        private void OnDestroy()
        {
            _shakeAnimation?.Kill();
        }
        
        public void SetEggActive(bool active) => egg.gameObject.SetActive(active);
        
        public void SetEggSprite(Sprite sprite) => egg.sprite = sprite;

        public void PlayShakeAnimation()
        {
            _shakeAnimation?.Kill();
            _transform.localPosition = _basePosition;
            _shakeAnimation = _transform.DOShakePosition(ShakeAnimationDuration, _shakeStrength);
        }
        
        public void ShowPetCracks(int index) => EggCracks[index].gameObject.SetActive(true);

        public void HideAllPetCracks()
        {
            foreach (SpriteRenderer crack in EggCracks)
            {
                crack.gameObject.SetActive(false);
            }
        }
        
        public void SetClickInteractable(bool interactable) => eggClickableZone.SetIsInteractable(interactable);
    }
}