import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";

import { switchOff, switchOn } from "../../assets/svgs";
import { moderateScale } from "react-native-size-matters";

const BAR_WIDTH  = moderateScale(90);
const BAR_HEIGHT = moderateScale(50);
const HEAD_SIZE  = moderateScale(50);

const THUMB_MIN_X = 4;
const THUMB_MAX_X = BAR_WIDTH - HEAD_SIZE - 4;
const MIDPOINT    = (THUMB_MIN_X + THUMB_MAX_X) / 2;
const TAP_SLOP    = 5; // move less than 5px = treat as tap, not drag

const AnimatedSwitch = ({ value = false, images, onValueChange }) => {
  const [isOn, setIsOn]  = useState(value);
  const thumbX           = useSharedValue(value ? THUMB_MAX_X : THUMB_MIN_X);
  const containerX       = useRef(0);
  const viewRef          = useRef(null);
  const isDragging       = useRef(false);
  const lastIsOn         = useRef(value);
  const dragStartX       = useRef(0);

  // Keep in sync when Redux/parent changes value from outside
  useEffect(() => {
    if (!isDragging.current) {
      setIsOn(value);
      lastIsOn.current = value;
      thumbX.value = withTiming(value ? THUMB_MAX_X : THUMB_MIN_X, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [value]);

  const emitChange = (newOn) => {
    setIsOn(newOn);
    if (newOn !== lastIsOn.current) {
      lastIsOn.current = newOn;
      if (onValueChange) onValueChange(newOn);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        isDragging.current = false;
        dragStartX.current = evt.nativeEvent.pageX;
        viewRef.current?.measure((x, y, width, height, pageX) => {
          containerX.current = pageX;
        });
      },

      onPanResponderMove: (evt) => {
        const moved = Math.abs(evt.nativeEvent.pageX - dragStartX.current);
        if (moved > TAP_SLOP) isDragging.current = true;

        const touchX  = evt.nativeEvent.pageX - containerX.current - HEAD_SIZE / 2;
        const clamped = Math.max(THUMB_MIN_X, Math.min(THUMB_MAX_X, touchX));
        thumbX.value  = clamped;

        runOnJS(emitChange)(clamped > MIDPOINT);
      },

      onPanResponderRelease: (evt) => {
        const moved = Math.abs(evt.nativeEvent.pageX - dragStartX.current);

        if (moved <= TAP_SLOP) {
          // TAP: toggle current state
          const newOn = !lastIsOn.current;
          thumbX.value = withTiming(newOn ? THUMB_MAX_X : THUMB_MIN_X, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          });
          runOnJS(emitChange)(newOn);
        } else {
          // DRAG: snap to whichever side thumb is closer to
          const snapOn = thumbX.value > MIDPOINT;
          thumbX.value = withTiming(snapOn ? THUMB_MAX_X : THUMB_MIN_X, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          });
          runOnJS(emitChange)(snapOn);
        }

        isDragging.current = false;
      },

      onPanResponderTerminate: () => {
        isDragging.current = false;
      },
    })
  ).current;

  const headStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  return (
    <View
      ref={viewRef}
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <SvgXml
        xml={isOn ? switchOn : switchOff}
        width={BAR_WIDTH}
        height={BAR_HEIGHT}
        style={StyleSheet.absoluteFill}
      />

      <Animated.Image
        source={images.SwitchHead}
        style={[styles.head, headStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

export default AnimatedSwitch;

const styles = StyleSheet.create({
  container: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    justifyContent: "center",
  },
  head: {
    position: "absolute",
    width: HEAD_SIZE,
    height: HEAD_SIZE,
    top: (BAR_HEIGHT - HEAD_SIZE) / 2,
    left: 0,
    zIndex: 2,
  },
});