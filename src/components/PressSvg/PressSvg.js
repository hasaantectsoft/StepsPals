import { View, TouchableOpacity } from "react-native";
import React from "react";
import { SvgXml } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";

const PressableIcon = ({ icon, width, height, onPress, container,disable=false }) => {

  const getSize = (value) => {
    if (value === undefined) return moderateScale(24);
    if (typeof value === "number") return moderateScale(value);
    return value; // percentage like "100%"
  };

  const Icon = (
    <SvgXml
      xml={icon}
      width={getSize(width)}
      height={getSize(height)}
    />
  );

  if (!onPress) {
    return <View style={container}>{Icon}</View>;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={15}
      style={container}
      disabled={disable}
    >
      {Icon}
    </TouchableOpacity>
  );
};

export default PressableIcon;