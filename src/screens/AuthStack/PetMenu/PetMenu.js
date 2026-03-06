import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import { PixelButton } from "../../../components/Petmenu/PixelButton";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";

import Header from "../../../components/Petmenu/PetMenu/Header";
import PetDetails from "../../../components/Petmenu/PetMenu/PetDetails";
import PetInfo from "../../../components/Petmenu/PetMenu/PetInfo";
import StepGoal from "../../../components/Petmenu/PetMenu/StepGoal";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export default function Petmenu() {
  const router = useNavigation();
  const [stepGoal, setStepGoal] = useState(500);

  const increase = () => setStepGoal((v) => Math.min(10000, v + 100));
  const decrease = () => setStepGoal((v) => Math.max(0, v - 100));

  // placeholder pet data
  const pet = {
    name: "[PetName]",
    days: "[2]/[21]",
    species: "[Cat]",
    age: "[x] days",
    condition: "[Healthy]",
    stage: "[Teen]",
    missed: "[0]",
    image: require("../../../assets/images/Cat.png"),
  };

  return (
    <View style={styles.container}>
      <SettingsBackground path={require("../../../assets/images/Statistics.png")} />

      <Header onBack={() => router.back()} />

      <PetInfo pet={pet} />

      <PetDetails pet={pet} />

      <StepGoal
        value={stepGoal}
        onIncrease={increase}
        onDecrease={decrease}
      />

      <Text style={styles.note}>
        Any changes will take effect starting tomorrow
      </Text>

      <View style={styles.saveBtn}>
        <PixelButton label="Save" onPress={() => router.back()} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  note: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? 8 : 10,
    textAlign: "center",
    marginTop: 10,
  },
  saveBtn: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});