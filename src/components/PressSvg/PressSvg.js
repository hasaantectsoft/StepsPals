import React, { memo, useMemo, useRef } from "react";
import { View, Pressable, Animated } from "react-native";
import { SvgXml } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import { playButtonSound } from "../../utils/SoundManager/SoundManager";

const PressableIcon = ({
  icon,
  width,
  height,
  onPress,
  container,
  disable = false,
  scaleFactor = 0.9, 
  animationDuration = 100 
}) => {
  const getSize = (value) => {
    if (value === undefined) return moderateScale(24);
    if (typeof value === "number") return moderateScale(value);
    return value;
  };

  const iconElement = useMemo(() => (
    <SvgXml
      xml={icon}
      width={getSize(width)}
      height={getSize(height)}
    />
  ), [icon, width, height]);

  // Animated value for scaling
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: scaleFactor,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  if (!onPress) {
    return <View style={container}>{iconElement}</View>;
  }

  return (
    <Pressable
    onLongPress={() => {
        playButtonSound();
        if (onPress) {
          onPress();
        }
      }}
      onPress={() => {
        playButtonSound();
        if (onPress) {
          onPress();
        }
      }}

      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disable}
      hitSlop={15}
      android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }], ...container }}>
        {iconElement}
      </Animated.View>
    </Pressable>
  );
};

export default memo(PressableIcon);