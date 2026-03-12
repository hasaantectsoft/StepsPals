import React, { useRef } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";

import { progressBarSvg } from "../../assets/svgs";

const BAR_WIDTH = 320;
const BAR_HEIGHT = 40;
const HEAD_SIZE = 50;

// Usable fill area inside the SVG bar (adjust these to match your SVG's inner bounds)
const FILL_LEFT_OFFSET = 10;
const FILL_RIGHT_OFFSET = 10;
const FILL_AREA = BAR_WIDTH - FILL_LEFT_OFFSET - FILL_RIGHT_OFFSET;

const ProgressBar = ({ progress = 0, images, onProgressChange }) => {
  const progressValue = useSharedValue(progress); // 0.0 → 1.0
  const containerX = useRef(0);
  const viewRef = useRef(null);

  const notifyParent = (val) => {
    if (onProgressChange) onProgressChange(val);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        // Measure container position on first touch
        viewRef.current?.measure((x, y, width, height, pageX) => {
          containerX.current = pageX;
        });

        // Also handle tap (grant = finger down)
        const touchX = evt.nativeEvent.pageX - containerX.current;
        let newProgress = (touchX - FILL_LEFT_OFFSET) / FILL_AREA;
        newProgress = Math.max(0, Math.min(1, newProgress));
        progressValue.value = newProgress;
        runOnJS(notifyParent)(newProgress);
      },

      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX - containerX.current;
        let newProgress = (touchX - FILL_LEFT_OFFSET) / FILL_AREA;
        newProgress = Math.max(0, Math.min(1, newProgress));
        progressValue.value = newProgress;
        runOnJS(notifyParent)(newProgress);
      },
    })
  ).current; // ← .current here so it's ready on first render

  // Animated fill width
  const fillStyle = useAnimatedStyle(() => ({
    width: progressValue.value * FILL_AREA,
  }));

  // Animated head X position
  // Head center tracks progress; offset by half head size so center aligns
  const headStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          FILL_LEFT_OFFSET +
          progressValue.value * FILL_AREA -
          HEAD_SIZE / 2,
      },
    ],
  }));

  return (
    <View
      ref={viewRef}
      style={styles.container}
      {...panResponder.panHandlers}
    >
      {/* SVG background bar */}
      <View style={styles.backgroundLayer}>
        <SvgXml xml={progressBarSvg} width={BAR_WIDTH} height={BAR_HEIGHT} />
      </View>

      {/* Animated fill */}
      <View style={styles.fillContainer}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>

      {/* Draggable head image */}
      <Animated.Image
        source={images.ProgressBarHead}
        style={[styles.head, headStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: BAR_WIDTH,
    height: HEAD_SIZE,          // tall enough for the head to not get clipped
    justifyContent: "center",
  },

  backgroundLayer: {
    position: "absolute",
    top: (HEAD_SIZE - BAR_HEIGHT) / 2,  // vertically center bar inside taller container
    left: 0,
    zIndex: 1,
  },

  fillContainer: {
    position: "absolute",
    left: FILL_LEFT_OFFSET,
    top: (HEAD_SIZE - BAR_HEIGHT) / 2 + 11,  // align with inner bar track
    height: 18,
    overflow: "hidden",
    zIndex: 2,
    width: FILL_AREA,
  },

  fill: {
    height: "100%",
    backgroundColor: "#6ECAFF",
  },

  head: {
    position: "absolute",
    width: HEAD_SIZE,
    height: HEAD_SIZE,
    top: 0,
    left: 0,
    zIndex: 3,
  },
});