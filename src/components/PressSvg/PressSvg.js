import React, { memo, useMemo } from "react";
import { View, Pressable } from "react-native";
import { SvgXml } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";

const PressableIcon = ({
  icon,
  width,
  height,
  onPress,
  container,
  disable = false
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

  if (!onPress) {
    return <View style={container}>{iconElement}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disable}
      hitSlop={15}
      style={container}
      android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
    >
      {iconElement}
    </Pressable>
  );
};

export default memo(PressableIcon);