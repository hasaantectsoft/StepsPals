using Assets;
using Data.Types;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.CollectionScreen
{
    public class PetInCollectionView : MonoBehaviour
    {
        private const string DateFormat = "dd.MM.yy";

        [SerializeField] private Image petImage;
        [SerializeField] private TextMeshProUGUI petName;
        [SerializeField] private TextMeshProUGUI birthdate;
        [SerializeField] private GameObject[] pawsBetweenLines;
        

        public void Configure(PetInCollectionInfo? info, bool isMiddleSlot, AssetsProvider assetsProvider)
        {
            bool slotNotEmpty = info != null;
            petName.gameObject.SetActive(slotNotEmpty);
            birthdate.gameObject.SetActive(slotNotEmpty);
            petImage.gameObject.SetActive(slotNotEmpty);

            if (slotNotEmpty)
            {
                petName.text = info.Value.PetName;
                birthdate.text = info.Value.PetBirthday.ToString(DateFormat);
                petImage.sprite =
                    assetsProvider.GetPetSprite(info.Value.PetSpecies, PetMaturity.Adult, ConditionState.Healthy);
            }

            foreach (GameObject paw in pawsBetweenLines)
            {
                paw.SetActive(isMiddleSlot);
            }
        }
    }
}