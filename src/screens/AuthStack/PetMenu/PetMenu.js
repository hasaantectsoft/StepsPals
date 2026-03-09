import { useState } from "react";
import {   Text, View } from "react-native";
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



export default function Petmenu() {
  const { petname,petkey,petsteps} = useSelector((state) => state.petReducer);
  const router = useNavigation();
  const [stepGoal, setStepGoal] = useState(petsteps);
  const [disable, setDisable] = useState(true);
  const dispatch=useDispatch();
console.log("Key is follwig",petkey)
  const pet = {
    id:petkey,
    name:petname,
    days: "2/7",
    species: "[Cat]",
    age: "[x] days",
    condition: "[Healthy]",
    stage: "[Teen]",
    missed: "[0]",
    image: require("../../../assets/images/Cat.png"),
  };

  

  const handelSave=()=>{
    dispatch(setPetSteps(stepGoal))
router.goBack();
  }
  return (
    <View style={styles.container}>
      <SettingsBackground path={images.Statistics}  />
        <PressableIcon
              icon={BackArrow}
              container={styles.backBtn}
              onPress={() => router.goBack()}
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


