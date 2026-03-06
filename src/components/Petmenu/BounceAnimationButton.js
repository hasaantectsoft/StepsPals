import { useRef } from "react";
import { Animated, Pressable } from "react-native";

export const BouncyPressable = ({
  children,
  onPress,
  style,
  scaleTo = 1.05,
  scaleChildren = false,
  childrenScaleTo = 1.15,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const childScaleValue = useRef(new Animated.Value(1)).current;

  const fastSpring = {
    useNativeDriver: true,
    stiffness: 800,
    damping: 18,
    mass: 0.3,
  };

  const handlePressOut = () => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: scaleTo,
        ...fastSpring,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        ...fastSpring,
      }),
    ]).start(() => {
      onPress?.();
    });

    if (scaleChildren) {
      Animated.sequence([
        Animated.spring(childScaleValue, {
          toValue: childrenScaleTo,
          ...fastSpring,
        }),
        Animated.spring(childScaleValue, {
          toValue: 1,
          ...fastSpring,
        }),
      ]).start();
    }
  };

  return (
    <Pressable onPressOut={handlePressOut} style={style}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      
        {children}
       
      </Animated.View>
    </Pressable>
  );
};
