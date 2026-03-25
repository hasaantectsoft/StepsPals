import React, { memo, useRef } from "react";
import PropTypes from "prop-types";
import { Animated, Pressable, View } from "react-native";
import { styles } from "./ScalePressableStyles";

const ScalePressable = ({
  children,
  
  activeOpacity,
  onPress,
  containerStyle,
  pressableStyle,
  disabled = false,
  scaleFactor = 0.9,
  animationDuration = 100,
  hitSlop = 15,
  androidRipple = { color: "transparent", borderless: true },
}) => {
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
      toValue: 1.1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  if (!onPress) {
    return <View style={containerStyle}>{children}</View>;
  }

  return (
    <Pressable
    activeOpacity={activeOpacity}
      onPress={onPress}
      onPressIn={handlePressOut}
      onPressOut={handlePressIn}
      disabled={disabled}
      hitSlop={hitSlop}
      style={pressableStyle}
      android_ripple={androidRipple}
    >
      <Animated.View
        style={[
          styles.animatedContainer,
          containerStyle,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

ScalePressable.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  pressableStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabled: PropTypes.bool,
  scaleFactor: PropTypes.number,
  animationDuration: PropTypes.number,
  hitSlop: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  androidRipple: PropTypes.object,
};

export default memo(ScalePressable);
