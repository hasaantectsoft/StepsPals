import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Canvas, RoundedRect, Circle, Group } from "@shopify/react-native-skia";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS, withSpring } from "react-native-reanimated";
import { scale } from "react-native-size-matters";
import { Theme } from "../../libs";
import { Styles } from "./Styles";

const SLIDER_WIDTH = scale(180);
const THUMB_R = scale(14);
const TRACK_H = scale(12);
const MIN = 1000;
const MAX = 20000;
const STEP = 1;

export default function StepSlider({ value, onChange }) {
    const ratio = (value - MIN) / (MAX - MIN);
    const thumbX = useSharedValue(THUMB_R + ratio * (SLIDER_WIDTH - 2 * THUMB_R));

    const updateValue = (val) => onChange(Math.min(MAX, Math.max(MIN, val)));

    const gesture = Gesture.Pan()
        .onChange((e) => {
            thumbX.value = Math.max(THUMB_R, Math.min(SLIDER_WIDTH - THUMB_R, thumbX.value + e.changeX));
            const ratio = (thumbX.value - THUMB_R) / (SLIDER_WIDTH - 2 * THUMB_R);
            runOnJS(updateValue)(Math.round(MIN + ratio * (MAX - MIN)));
        })
        .onEnd(() => {
            thumbX.value = withSpring(thumbX.value);
        });

    const syncThumb = (v) => {
        const ratio = (v - MIN) / (MAX - MIN);
        thumbX.value = THUMB_R + ratio * (SLIDER_WIDTH - 2 * THUMB_R);
    };
    React.useEffect(() => syncThumb(value), [value]);

    const handleMinus = () => onChange(Math.max(MIN, value - STEP));
    const handlePlus = () => onChange(Math.min(MAX, value + STEP));

    return (
        <View style={Styles.sliderRow}>
            <TouchableOpacity style={Styles.stepBtn} onPress={handleMinus} activeOpacity={0.7}>
                <Image source={require("../../assets/images/minus.png")} style={Styles.stepBtnImg} resizeMode="contain" />
            </TouchableOpacity>
            <View style={Styles.sliderWrap}>
                <GestureDetector gesture={gesture}>
                    <Canvas style={Styles.sliderCanvas}>
                        <Group>
                            <RoundedRect x={0} y={(scale(44) - TRACK_H) / 2} width={SLIDER_WIDTH} height={TRACK_H} r={4} color={Theme.colors.brown} />
                            <RoundedRect x={2} y={(scale(44) - TRACK_H) / 2 + 2} width={SLIDER_WIDTH - 4} height={TRACK_H - 4} r={3} color="#E8D5C4" />
                            <Circle cx={thumbX} cy={scale(22)} r={THUMB_R} color={Theme.colors.brown} />
                            <Circle cx={thumbX} cy={scale(22)} r={THUMB_R - 3} color={Theme.colors.primary} />
                        </Group>
                    </Canvas>
                </GestureDetector>
            </View>
            <TouchableOpacity style={Styles.stepBtn} onPress={handlePlus} activeOpacity={0.7}>
                <Image source={require("../../assets/images/plus.png")} style={Styles.stepBtnImg} resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
}
