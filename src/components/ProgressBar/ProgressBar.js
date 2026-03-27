import React, { useEffect, useRef } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import { progressBarSvg, progressBarDottedOverlay } from "../../assets/svgs";

const BAR_WIDTH = moderateScale(230);
const BAR_HEIGHT = moderateScale(40);
const HEAD_SIZE = moderateScale(40);

const FILL_LEFT_OFFSET = moderateScale(10);
const FILL_RIGHT_OFFSET = moderateScale(12);
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

  // Tracks the last progress value we set ourselves (drag or snap)
  // so we can detect when the prop change came from outside (button press)
  const internalProgress = useRef(progress);

  useEffect(() => {
    if (isDragging.current) return;

    const incoming = progress;

    // Skip if we already set this value ourselves (came from drag/snap callback)
    if (Math.abs(incoming - internalProgress.current) < 0.0001) return;

    // This is an external change (button press) — set DIRECTLY, no spring
    // withSpring was causing the blink on rapid +/- button presses
    internalProgress.current = incoming;
    progressValue.value = incoming;
  }, [progress]);

  const notifyParent = (rawProgress) => {
    if (!onProgressChange) return;
    const rawVal = MIN + rawProgress * (MAX - MIN);
    const snapped = snapToStep(rawVal);
    const snappedProgress = (snapped - MIN) / (MAX - MIN);
    onProgressChange(snappedProgress, snapped);
  };

  const snapHeadToStep = (rawProgress) => {
    const rawVal = MIN + rawProgress * (MAX - MIN);
    const snapped = snapToStep(rawVal);
    const snappedProgress = (snapped - MIN) / (MAX - MIN);

    // Update internal ref so useEffect knows this value came from us
    internalProgress.current = snappedProgress;

    // Spring only on drag release — feels natural, no blink risk here
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

        internalProgress.current = newProgress;
        progressValue.value = newProgress;
        runOnJS(notifyParent)(newProgress);
      },

      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX - containerX.current;
        let newProgress = (touchX - FILL_LEFT_OFFSET) / FILL_AREA;
        newProgress = Math.max(0, Math.min(1, newProgress));

        internalProgress.current = newProgress;
        progressValue.value = newProgress;
        runOnJS(notifyParent)(newProgress);
      },

      onPanResponderRelease: (evt) => {
        const touchX = evt.nativeEvent.pageX - containerX.current;
        let rawProgress = (touchX - FILL_LEFT_OFFSET) / FILL_AREA;
        rawProgress = Math.max(0, Math.min(1, rawProgress));

        runOnJS(snapHeadToStep)(rawProgress);
        runOnJS(notifyParent)(rawProgress);

        setTimeout(() => {
          isDragging.current = false;
        }, 300);
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

      <View style={styles.dottedOverlay} pointerEvents="none">
        <SvgXml xml={progressBarDottedOverlay} width={BAR_WIDTH} height={BAR_HEIGHT} />
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
    left: moderateScale(0),
    zIndex: 1,
  },
  fillContainer: {
    position: "absolute",
    left: FILL_LEFT_OFFSET,
    top: (HEAD_SIZE - BAR_HEIGHT) / 2 + 12.5,
    height: moderateScale(16),
    overflow: "hidden",
    zIndex: 2,
    width: FILL_AREA,
  },
  dottedOverlay: {
    position: "absolute",
    top: (HEAD_SIZE - BAR_HEIGHT) / 2,
    left: moderateScale(0),
    zIndex: 3,
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
    zIndex: 4,
  },
});