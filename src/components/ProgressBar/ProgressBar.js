import React, { useEffect, useRef } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";

import { progressBarSvg } from "../../assets/svgs";

const BAR_WIDTH = 280;
const BAR_HEIGHT = 40;
const HEAD_SIZE = 40;

const FILL_LEFT_OFFSET = 10;
const FILL_RIGHT_OFFSET = 10;
const FILL_AREA = BAR_WIDTH - FILL_LEFT_OFFSET - FILL_RIGHT_OFFSET;

const MIN = 100;
const MAX = 20000;
const STEP = 100;

const snapToStep = (val) =>
  Math.min(MAX, Math.max(MIN, Math.round((val - MIN) / STEP) * STEP + MIN));

const ProgressBar = ({ progress = 0, images, onProgressChange }) => {
  const progressValue = useSharedValue(progress);
  const containerX = useRef(0);
  const viewRef = useRef(null);
  const isDragging = useRef(false);

  // Sync head position when parent changes progress via +/- buttons
  useEffect(() => {
    if (!isDragging.current) {
      progressValue.value = withSpring(progress, { damping: 20, stiffness: 200 });
    }
  }, [progress]);

  // Called on move: gives live feedback while dragging
  const notifyParent = (rawProgress) => {
    if (!onProgressChange) return;
    const rawVal = MIN + rawProgress * (MAX - MIN);
    const snapped = snapToStep(rawVal);
    const snappedProgress = (snapped - MIN) / (MAX - MIN);
    onProgressChange(snappedProgress, snapped);
  };

  // Called on release: snaps the head visually
  const snapHeadToStep = (rawProgress) => {
    const rawVal = MIN + rawProgress * (MAX - MIN);
    const snapped = snapToStep(rawVal);
    const snappedProgress = (snapped - MIN) / (MAX - MIN);
    progressValue.value = withSpring(snappedProgress, { damping: 20, stiffness: 200 });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        isDragging.current = true;
        viewRef.current?.measure((x, y, width, height, pageX) => {
          containerX.current = pageX;
        });
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
        progressValue.value = newProgress; // smooth while dragging
        runOnJS(notifyParent)(newProgress); // update step label live
      },

      onPanResponderRelease: (evt) => {
        const touchX = evt.nativeEvent.pageX - containerX.current;
        let rawProgress = (touchX - FILL_LEFT_OFFSET) / FILL_AREA;
        rawProgress = Math.max(0, Math.min(1, rawProgress));
        runOnJS(snapHeadToStep)(rawProgress); // snap head on release
        runOnJS(notifyParent)(rawProgress);
        isDragging.current = false;
      },

      onPanResponderTerminate: () => {
        isDragging.current = false;
      },
    })
  ).current;

  const fillStyle = useAnimatedStyle(() => ({
    width: progressValue.value * FILL_AREA,
  }));

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
      <View style={styles.backgroundLayer}>
        <SvgXml xml={progressBarSvg} width={BAR_WIDTH} height={BAR_HEIGHT} />
      </View>

      <View style={styles.fillContainer}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>

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
    height: HEAD_SIZE,
    justifyContent: "center",
  },
  backgroundLayer: {
    position: "absolute",
    top: (HEAD_SIZE - BAR_HEIGHT) / 2,
    left: 0,
    zIndex: 1,
  },
  fillContainer: {
    position: "absolute",
    left: FILL_LEFT_OFFSET,
    top: (HEAD_SIZE - BAR_HEIGHT) / 2 + 11,
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