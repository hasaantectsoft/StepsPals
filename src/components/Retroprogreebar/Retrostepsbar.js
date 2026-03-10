import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated } from "react-native";
import { Theme } from "../../libs";
import { retro } from "../../utils/extra/delay";
import {  scale } from "react-native-size-matters";
import { bowl, bowl1, checked, homebar, popp, waterdis, waterfull } from "../../assets/svgs";
import { SvgXml } from "react-native-svg";
import { playButtonSound } from "../../utils/SoundManager/SoundManager";

export default function RetroStepsBar({
  top = 0,
  right = 0,
  left = 0,
  bottom = 0,
  width,
  height,
  borderRadius,
  steps = 0,
  goal = 5000,
}) {
const [boul, setBoul] = useState(0);
const [pop, setpop] = useState(0);
const [wat, setwat] = useState(0);
const scaleAnim1 = useRef(new Animated.Value(1)).current;
const scaleAnim2 = useRef(new Animated.Value(1)).current;
const scaleAnim3 = useRef(new Animated.Value(1)).current;

const progress = goal ? Math.min(steps / goal, 1) : 0;
const progressWidth = `${progress * 100}%`;
const canFirstPress = steps >= 1500;
const canSecondPress = steps >= 2500;
const canThirdPress = steps >= 3500;
const scaleFactor = 0.9;
const animDur = 100;
const getIcon = (petsteps, a, b) => (petsteps === 0 ? a : petsteps === 1 ? b : checked);

const scaleIn = (anim) => () => {
  Animated.timing(anim, { toValue: scaleFactor, duration: animDur, useNativeDriver: true }).start();
};
const scaleOut = (anim) => () => {
  Animated.timing(anim, { toValue: 1, duration: animDur, useNativeDriver: true }).start();
};
  return (
    <View
      style={[
        styles.container,
        {
          marginTop: top,
          marginRight: right,
          marginLeft: left,
          marginBottom: bottom,
        },
      ]}
    >
      <View style={styles.barWrapper}>
        <SvgXml
          xml={homebar}
          style={styles.barBackground}
          height={scale(70)}
          width={width || scale(280)}
        />
        <View
          style={[
            styles.outerBar,
            {
            width: width || scale(200),
              height: height || scale(40),
              borderRadius: borderRadius || scale(20),
            },
          ]}
        >
        <View style={[styles.fillBar, { width: progressWidth }]} />

          <Text style={styles.text}>
            {steps}/{goal} Steps
          </Text>
        </View>
      </View>
     <View style={styles.gap}>
      <Pressable onPressIn={scaleIn(scaleAnim1)} onPressOut={scaleOut(scaleAnim1)} onPress={() => playButtonSound()}>
        <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
          <TouchableOpacity onPress={() => setBoul(boul+1)} disabled={!canFirstPress || boul===2}>
            <SvgXml xml={getIcon(boul,bowl,bowl1)} style={styles.bowlcontainer} height={50} width={40}/>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
      <Pressable onPressIn={scaleIn(scaleAnim2)} onPressOut={scaleOut(scaleAnim2)} onPress={() => playButtonSound()}>
        <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
          <TouchableOpacity onPress={() => setwat(wat+1)} disabled={!canSecondPress || wat===2}>
            <SvgXml xml={getIcon(wat,waterdis,waterfull)} style={styles.bowlcontainer} height={50} width={40}/>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
      <Pressable onPressIn={scaleIn(scaleAnim3)} onPressOut={scaleOut(scaleAnim3)} onPress={() => playButtonSound()}>
        <Animated.View style={{ transform: [{ scale: scaleAnim3 }] }}>
          <TouchableOpacity onPress={() => setpop(pop+1)} disabled={!canThirdPress || pop===2}>
            <SvgXml xml={getIcon(pop,popp,popp)} style={styles.bowlcontainer} height={50} width={40}/>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </View>
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 2,
  },
  gap:{
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",
    alignItems:"center",
    gap:scale(10),
 },

  barWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  barBackground: {
    position: "absolute",
  },

  outerBar: {
    borderWidth: scale(4),
    margin:scale(2),
    marginLeft:scale(10),
    // marginHorizontal:scale(10),
    borderColor: Theme.colors.white,
    backgroundColor: Theme.colors.lightgrey,
    overflow: "hidden",
    justifyContent: "center",
  },

  fillBar: {
    position: "absolute",
    left: 0,
    height: "100%",
    backgroundColor: Theme.colors.waterblue,
  },

  text: {
    position: "absolute",
    // alignSelf: "center",
    marginLeft:scale(30),
    fontSize: scale(10),
    fontFamily: retro,
    color: "#1b1b1b",
  },
});