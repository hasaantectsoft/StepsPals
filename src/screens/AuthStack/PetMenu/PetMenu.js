import { useState } from "react";
import { Text, View } from "react-native";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";
import PetDetails from "../../../components/Petmenu/PetMenu/PetDetails";
import PetInfo from "../../../components/Petmenu/PetMenu/PetInfo";
import { useNavigation } from "@react-navigation/native";
import StepSlider from "../../../components/SelectYourGoal/StepSlider";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./style";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import { moderateScale, scale } from "react-native-size-matters";
import { Theme } from "../../../libs";
import PressableIcon from "../../../components/PressSvg/PressSvg";
import { BackArrow, grayButton } from "../../../assets/svgs";
import { orangeBtn } from "../../../components/Petmenu/buttonSvgs";
import { updatePet } from "../../../redux/slices/petslice";
import { getCondition } from "../../../utils/petCondition";

const SPECIES_MAP = { '1': 'Dog', '2': 'Cat', '3': 'Dino' };



const getPetStage = (ageInDays) => {
  if (ageInDays <= 7) return { stage: "baby", days: `${ageInDays}/7` };
  if (ageInDays < 21) return { stage: "teen", days: `${ageInDays}/21` };
  return { stage: "adult", days: "MAX" };
};

export default function Petmenu() {
  const { petname, petkey, petsteps, petcreatedat, missedDays } = useSelector((state) => state.petReducer);
  const router = useNavigation();
  const [stepGoal, setStepGoal] = useState(petsteps);
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch();

  const ageInDays = petcreatedat
    ? Math.floor((Date.now() - petcreatedat) / (1000 * 60 * 60 * 24))
    : 0;
  const { stage, days } = getPetStage(ageInDays);

  const pet = {
    id: petkey,
    name: petname,
    days,
    age: ageInDays >= 21 ? "21 days" : `${ageInDays} day${ageInDays !== 1 ? "s" : ""}`,
    condition: getCondition(missedDays),
    stage,
    missed: String(missedDays ?? 0),
    species: SPECIES_MAP[petkey] ?? "Dino",
  };



  const handelSave = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    dispatch(updatePet({ pendingpetsteps: stepGoal, pendingfrom: tomorrow.getTime() }));
    router.replace('Main');
  };
  return (
    <View style={styles.container}>
      <SettingsBackground path={images.Statistics} />
      <PressableIcon
        icon={BackArrow}
        container={styles.backBtn}
        onPress={() => router.replace('Main')}
      />
      <PetInfo pet={pet} />
      <PetDetails pet={pet} />
      <Text style={[combineStyles.regular16, { marginTop: moderateScale(28) }]}>Step Goal</Text>
      <Text style={[combineStyles.regular10, { color: Theme.colors.brown, marginVertical: scale(20) }]}>{stepGoal} steps/day</Text>
      <StepSlider
        value={stepGoal}
        onChange={(val) => {
          setStepGoal(val);
          setDisable(false);
        }}
      />
      <Text style={styles.note}>
        Any changes will take effect starting tomorrow
      </Text>
      <View style={styles.saveBtn}>
        <PressableIcon icon={disable ? grayButton : orangeBtn} width={"100%"} height={60} onPress={handelSave} />
        <Text style={[styles.btn, !disable && { color: "black" }]}>Save</Text>
      </View>
    </View>
  );
}


