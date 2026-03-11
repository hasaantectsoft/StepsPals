import { Animated } from "react-native";
const scaleFactor = 0.9;
const animDur = 100;
export const scaleIn = (anim) => () => {
  Animated.timing(anim, { toValue: scaleFactor, duration: animDur, useNativeDriver: true }).start();
};
export const scaleOut = (anim) => () => {
  Animated.timing(anim, { toValue: 1, duration: animDur, useNativeDriver: true }).start();
};