import React, { useState, useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { styles } from "./styles";
import { scale } from "react-native-size-matters";
import { bowl, bowl1, checked, homebar, popp, waterdis, waterfull } from "../../assets/svgs";
import { SvgXml } from "react-native-svg";
import { playButtonSound } from "../../utils/SoundManager/SoundManager";
import MessageBox from "../MessageBox/MessageBox";
import ScalePressable from "../ScalePressable/ScalePressable";

export default function RetroStepsBar({
  top = 0, right = 0, left = 0, bottom = 0,
  width, height, borderRadius,
  steps = 0, goal = 5000,
}) {
  const [boul, setBoul] = useState(0);
  const [pop, setpop] = useState(0);
  const [wat, setwat] = useState(0);
  const [activeMsgData, setActiveMsgData] = useState(null); // { msg, left }
  const msgOpacity = useRef(new Animated.Value(0)).current;

  const showMsg = (data) => {
    setActiveMsgData(data);
    msgOpacity.setValue(1);
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(msgOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setActiveMsgData(null));
  };

  const barWidth = width || scale(280);
  const progress = goal ? Math.min(steps / goal, 1) : 0;
  const progressWidth = `${progress * 100}%`;

  const getIcon = (s, a, b) => (s === 0 ? a : s === 1 ? b : checked);

  // Auto-unlock icons when milestones are reached
  useEffect(() => { if (steps >= goal * 0.25 && boul === 0) setBoul(1); }, [steps, goal]);
  useEffect(() => { if (steps >= goal * 0.50 && wat  === 0) setwat(1); }, [steps, goal]);
  useEffect(() => { if (steps >= goal * 0.75 && pop  === 0) setpop(1); }, [steps, goal]);

  // Auto-clear message once its milestone is passed
  useEffect(() => {
    if (!activeMsgData) return;
    const map = { "25%": 0.25, "50%": 0.50, "75%": 0.75, "100%": 1 };
    const key = Object.keys(map).find(k => activeMsgData.msg.includes(k));
    if (key && steps >= goal * map[key]) setActiveMsgData(null);
  }, [steps, goal]);

  const iconConfigs = [
    { pct: 0.25, state: boul, setState: setBoul, getXml: s => getIcon(s, bowl, bowl1),        canPress: steps >= goal * 0.25, msg: "You need to hit 25% of your step goal"  },
    { pct: 0.47, state: wat,  setState: setwat,  getXml: s => getIcon(s, waterdis, waterfull), canPress: steps >= goal * 0.50, msg: "You need to hit 50% of your step goal"  },
    { pct: 0.70, state: pop,  setState: setpop,  getXml: s => getIcon(s, popp, popp),          canPress: steps >= goal * 0.75, msg: "You need to hit 75% of your step goal"  },
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

      <View style={[styles.iconsRow, { width: barWidth, overflow: "visible" }]}>
        {iconConfigs.map(({ pct, state, setState, getXml, canPress, msg, dim }, idx) => (
          <ScalePressable
            key={idx}
            pressableStyle={[styles.iconAbsolute, { left: barWidth * pct - scale(20) }]}
            onPress={() => {
              playButtonSound();
              if (!canPress) {
                showMsg({ msg, left: barWidth * pct - scale(100) });
              } else {
                setActiveMsgData(null);
                if (state < 2) setState(state + 1);
              }
            }}
          >
            <View style={dim && !canPress ? { opacity: 0.4 } : null}>
              <SvgXml xml={getXml(state)} height={50} width={40} />
            </View>
          </ScalePressable>
        ))}

        {activeMsgData && (
          <Animated.View style={{ position: "absolute", top: scale(36), left: activeMsgData.left, opacity: msgOpacity }}>
            <MessageBox text={activeMsgData.msg} />
          </Animated.View>
        )}
      </View>
    </View>
  );
}
