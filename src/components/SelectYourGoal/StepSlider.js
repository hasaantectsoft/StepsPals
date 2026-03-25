import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { images } from "../../assets/images";
import { Styles } from "./Styles";
import ProgressBar from "../ProgressBar/ProgressBar";

const MIN = 100;
const MAX = 20000;
const STEP = 100;

export default function StepSlider({ value, onChange }) {
  const handleMinus = () => onChange(Math.max(MIN, value - STEP));
  const handlePlus  = () => onChange(Math.min(MAX, value + STEP));

  // Called by ProgressBar on every drag move and on release
  // snappedProgress = already-snapped 0→1, snappedSteps = e.g. 1400
  const handleBarChange = (snappedProgress, snappedSteps) => {
    onChange(snappedSteps); // drive parent state → re-renders bar via `value` prop
  };

  return (
    <View style={Styles.sliderRow}>
      <TouchableOpacity onPress={handleMinus} activeOpacity={0.7}>
        <Image
          source={require("../../assets/images/minus.png")}
          style={Styles.stepBtnImg}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ProgressBar
        progress={(value - MIN) / (MAX - MIN)}   // 0.0 → 1.0
        images={images}
        onProgressChange={handleBarChange}        // ← wired up
      />

      <TouchableOpacity onPress={handlePlus} activeOpacity={0.7}>
        <Image
          source={require("../../assets/images/plus.png")}
          style={Styles.stepBtnImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}