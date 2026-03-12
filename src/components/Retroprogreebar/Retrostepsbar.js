import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Pressable, Animated } from "react-native";
import { styles } from "./styles";
import { scale } from "react-native-size-matters";
import { bowl, bowl1, checked, homebar, popp, waterdis, waterfull } from "../../assets/svgs";
import { SvgXml } from "react-native-svg";
import { playButtonSound } from "../../utils/SoundManager/SoundManager";

export default function RetroStepsBar({
  top = 0, right = 0, left = 0, bottom = 0,
  width, height, borderRadius,
  steps = 0, goal = 5000,
}) {
  const [boul, setBoul] = useState(0);
  const [pop, setpop] = useState(0);
  const [wat, setwat] = useState(0);
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const scaleAnim3 = useRef(new Animated.Value(1)).current;

  const barWidth = width || scale(280);
  const progress = goal ? Math.min(steps / goal, 1) : 0;
  const progressWidth = `${progress * 100}%`;
  const scaleFactor = 0.9;
  const animDur = 100;

  const getIcon = (s, a, b) => (s === 0 ? a : s === 1 ? b : checked);
  const scaleIn = (anim) => () =>
    Animated.timing(anim, { toValue: scaleFactor, duration: animDur, useNativeDriver: true }).start();
  const scaleOut = (anim) => () =>
    Animated.timing(anim, { toValue: 1, duration: animDur, useNativeDriver: true }).start();

  const iconConfigs = [
    { pct: 0.25, state: boul, setState: setBoul, anim: scaleAnim1, getXml: s => getIcon(s, bowl, bowl1),        canPress: steps >= goal * 0.25 },
    { pct: 0.47, state: wat,  setState: setwat,  anim: scaleAnim2, getXml: s => getIcon(s, waterdis, waterfull), canPress: steps >= goal * 0.50 },
    { pct: 0.70, state: pop,  setState: setpop,  anim: scaleAnim3, getXml: s => getIcon(s, popp, popp),          canPress: steps >= goal * 0.75 },
  ];

  return (
    <View style={[styles.container, { marginTop: top, marginRight: right, marginLeft: left, marginBottom: bottom }]}>
      <View style={styles.barWrapper}>
        <SvgXml xml={homebar} style={styles.barBackground} height={scale(70)} width={barWidth} />
        <View style={[styles.outerBar, { width: barWidth, height: height || scale(40), borderRadius: borderRadius || scale(20) }]}>
          <View style={[styles.fillBar, { width: progressWidth }]} />
          <Text style={styles.text}>{steps}/{goal} Steps</Text>
        </View>
      </View>

      <View style={[styles.iconsRow, { width: barWidth }]}>
        {iconConfigs.map(({ pct, state, setState, anim, getXml, canPress }, idx) => (
          <Pressable
            key={idx}
            style={[styles.iconAbsolute, { left: barWidth * pct - scale(20) }]}
            onPressIn={scaleIn(anim)}
            onPressOut={scaleOut(anim)}
            onPress={() => playButtonSound()}
          >
            <Animated.View style={{ transform: [{ scale: anim }] }}>
              <TouchableOpacity onPress={() => setState(state + 1)} disabled={!canPress || state === 2}>
                <SvgXml xml={getXml(state)} height={50} width={40} />
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
