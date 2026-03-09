using Assets;
using UnityEngine;
using Zenject;

namespace Screens.Shared.PetGrave
{
    public class PetGravePresenter : MonoBehaviour
    {
        [SerializeField] private PetGraveView view;

        private AssetsProvider _assetsProvider;

        [Inject]
        public void Construct(AssetsProvider assetsProvider)
        {
            _assetsProvider = assetsProvider;
        }

        public void Configure(PetGraveViewInfo info)
        {
            view.Configure(info,  _assetsProvider.GetPetGraveSprite(info.PetSpecies));
        }
    }
}