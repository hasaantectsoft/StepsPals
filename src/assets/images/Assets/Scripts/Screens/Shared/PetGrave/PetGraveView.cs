using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Screens.Shared.PetGrave
{
    public class PetGraveView : MonoBehaviour
    {
        private const string DateFormat = "dd.MM.yy";

        [SerializeField] private TextMeshProUGUI petName;
        [SerializeField] private TextMeshProUGUI birthdayText;
        [SerializeField] private TextMeshProUGUI deathText;
        [SerializeField] private Image graveImage;

        public void Configure(PetGraveViewInfo info, Sprite graveSprite)
        {
            petName.text = info.PetName;
            graveImage.sprite = graveSprite;
            birthdayText.text = info.PetBirthday.ToString(DateFormat);
            deathText.text = info.PetDeathDay.ToString(DateFormat);
        }
    }
}