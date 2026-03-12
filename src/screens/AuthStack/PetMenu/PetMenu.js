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
import { moderateScale } from "react-native-size-matters";
import { Theme } from "../../../libs";
import PressableIcon from "../../../components/PressSvg/PressSvg";
import { BackArrow, grayButton } from "../../../assets/svgs";
import { orangeBtn } from "../../../components/Petmenu/buttonSvgs";
import { setPetSteps } from "../../../redux/slices/petslice";
import { babyDogsprites, teenDogsprites, adultDogsprites } from "../../../assets/Sprites/Pets/Dog";
import { babycatsprites, teencatsprites, adultcatsprites } from "../../../assets/Sprites/Pets/Cat";
import { babydinosprites, teendinosprites, adultdinosprites } from "../../../assets/Sprites/Pets/Dino";

const SPECIES_MAP = { '1': 'Dog', '2': 'Cat', '3': 'Dino' };

const SPRITE_MAP = {
  '1': { baby: babyDogsprites.Dogmain, teen: teenDogsprites.Dogmain, adult: adultDogsprites.Dogmain },
  '2': { baby: babycatsprites.catmain, teen: teencatsprites.catmain, adult: adultcatsprites.catmain },
  '3': { baby: babydinosprites.dinomain, teen: teendinosprites.dinomain, adult: adultdinosprites.dinomain },
};



const getPetStage = (ageInDays) => {
  if (ageInDays <= 7)  return { stage: "baby",  days: `${ageInDays}/7`  };
  if (ageInDays <= 21) return { stage: "teen",  days: `${ageInDays}/21` };
  return                      { stage: "adult", days: "21/21"            };
};

export default function Petmenu() {
  const { petname, petkey, petsteps, petcreatedat } = useSelector((state) => state.petReducer);
  const router = useNavigation();
  const [stepGoal, setStepGoal] = useState(petsteps);
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch();

  const ageInDays = petcreatedat
    ? Math.min(Math.floor((Date.now() - petcreatedat) / (1000 * 60 * 60 * 24)), 21)
    : 0;
  const { stage, days } = getPetStage(ageInDays);

  const pet = {
    id: petkey,
    name: petname,
    days,
    age: `${ageInDays} day${ageInDays !== 1 ? "s" : ""}`,
    condition: "Healthy",
    stage,
    missed: "0",
    species: SPECIES_MAP[petkey] ?? "Dino",
    spriteImage: SPRITE_MAP[petkey]?.[stage] ?? babydinosprites.dinomain,
  };

  

  const handelSave=()=>{
    dispatch(setPetSteps(stepGoal))
    router.replace('Main')
  }
  return (
    <View style={styles.container}>
      <SettingsBackground path={images.Statistics}  />
        <PressableIcon
              icon={BackArrow}
              container={styles.backBtn}
              onPress={() => router.replace('Main')}
            />
      <PetInfo pet={pet} />
      <PetDetails pet={pet} />
      <Text style={[combineStyles.regular16,{marginTop:moderateScale(28)}]}>Step Goal</Text>
      <Text style={[combineStyles.regular10,{color:Theme.colors.brown,marginTop:moderateScale(10)}]}>[{stepGoal}] steps/day</Text>
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
        <PressableIcon icon={disable?grayButton:orangeBtn} width={"100%"} height={60} onPress={handelSave}/>
        <Text style={[styles.btn ,!disable&&{color:"black"}]}>Save</Text>
      </View>
    </View>
  );
}


