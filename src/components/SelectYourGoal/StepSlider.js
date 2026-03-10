import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Canvas, RoundedRect, Circle, Group, rrect, rect } from "@shopify/react-native-skia";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue, useDerivedValue, runOnJS, withSpring } from "react-native-reanimated";
import { scale } from "react-native-size-matters";
import { Styles } from "./Styles";
const SLIDER_WIDTH = scale(180);
const THUMB_R = scale(14);
const TRACK_H = scale(12);
const TRACK_PAD = 1;
const FILLED_COLOR = "#6ECAFF";
const UNFILLED_COLOR = "#a7baca";
const BORDER_COLOR = "#000000";
const MIN = 1000;
const MAX = 20000;
const STEP = 500;

const snapToStep = (v) => Math.round((v - MIN) / STEP) * STEP + MIN;

export default function StepSlider({ value, onChange }) {
    const ratio = (value - MIN) / (MAX - MIN);
    const thumbX = useSharedValue(THUMB_R + ratio * (SLIDER_WIDTH - 2 * THUMB_R));
    const isDragging = useRef(false);

    const lastValueRef = useRef(value);
    const setDraggingTrue = () => { isDragging.current = true; };
    const setDraggingFalse = () => { isDragging.current = false; };
    const updateValue = (val) => {
        const snapped = Math.min(MAX, Math.max(MIN, snapToStep(val)));
        if (snapped !== lastValueRef.current) {
            lastValueRef.current = snapped;
            onChange(snapped);
        }
    };

    const gesture = Gesture.Pan()
        .onStart(() => runOnJS(setDraggingTrue)())
        .onChange((e) => {
            thumbX.value = Math.max(THUMB_R, Math.min(SLIDER_WIDTH - THUMB_R, thumbX.value + e.changeX));
            const r = (thumbX.value - THUMB_R) / (SLIDER_WIDTH - 2 * THUMB_R);
            const val = MIN + r * (MAX - MIN);
            runOnJS(updateValue)(val);
        })
        .onEnd(() => {
            const r = (thumbX.value - THUMB_R) / (SLIDER_WIDTH - 2 * THUMB_R);
            const val = MIN + r * (MAX - MIN);
            const snapped = Math.round((val - MIN) / STEP) * STEP + MIN;
            thumbX.value = withSpring(THUMB_R + ((snapped - MIN) / (MAX - MIN)) * (SLIDER_WIDTH - 2 * THUMB_R));
            runOnJS(updateValue)(snapped);
            runOnJS(setDraggingFalse)();
        });

    const syncThumb = (v) => {
        if (isDragging.current) return;
        lastValueRef.current = v;
        const r = (v - MIN) / (MAX - MIN);
        thumbX.value = THUMB_R + r * (SLIDER_WIDTH - 2 * THUMB_R);
    };
    useEffect(() => syncThumb(value), [value]);

    const fillWidth = useDerivedValue(() => Math.max(0, thumbX.value - TRACK_PAD - 2));

    const trackY = (scale(44) - TRACK_H) / 2 + TRACK_PAD;
    const trackClip = rrect(rect(TRACK_PAD, trackY, SLIDER_WIDTH - 4, TRACK_H - 4), 3, 3);

    const handleMinus = () => onChange(Math.max(MIN, snapToStep(value) - STEP));
    const handlePlus = () => onChange(Math.min(MAX, snapToStep(value) + STEP));

    return (
        <View style={Styles.sliderRow}>
            <TouchableOpacity  onPress={handleMinus} activeOpacity={0.7}>
                <Image source={require("../../assets/images/minus.png")} style={Styles.stepBtnImg} resizeMode="contain" />
            </TouchableOpacity>
            <View style={Styles.sliderWrap}>
                <GestureDetector gesture={gesture}>
                    <Canvas style={Styles.sliderCanvas}>
                        <Group>
                            <RoundedRect x={0} y={(scale(44) - TRACK_H) / 2} width={SLIDER_WIDTH} height={TRACK_H} r={4} color={BORDER_COLOR} />
                            <Group clip={trackClip}>
                                <RoundedRect x={TRACK_PAD} y={trackY} width={SLIDER_WIDTH - 4} height={TRACK_H - 4} r={3} color={UNFILLED_COLOR} />
                                <RoundedRect x={TRACK_PAD} y={trackY} width={fillWidth} height={TRACK_H - 4} r={3} color={FILLED_COLOR} />
                            </Group>
                            <Circle cx={thumbX} cy={scale(22)} r={THUMB_R} color={BORDER_COLOR} />
                            <Circle cx={thumbX} cy={scale(22)} r={THUMB_R - 3} color={FILLED_COLOR} />
                        </Group>
                    </Canvas>
                </GestureDetector>
            </View>
            <TouchableOpacity  onPress={handlePlus} activeOpacity={0.7}>
                <Image source={require("../../assets/images/plus.png")} style={Styles.stepBtnImg} resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
}
