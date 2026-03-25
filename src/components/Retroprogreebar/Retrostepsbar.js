import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ImageBackground } from "react-native";
import { styles } from "./styles";
import { scale } from "react-native-size-matters";
import { bowl, bowl1, checked, newhomebar, pop1, popp, waterdis, waterfull } from "../../assets/svgs";
import { SvgXml } from "react-native-svg";
import { playbottomtabsound } from "../../utils/SoundManager/SoundManager";
import ScalePressable from "../ScalePressable/ScalePressable";
import MessageBox from "../MessageBox/MessageBox";

const DISABLED_MESSAGES = {
  feed: "Walk more to unlock the food bowl! Reach 25% of your step goal.",
  drink: "Complete the food bowl first, then reach 50% of your steps for water.",
  clean: "Complete food and water first, then reach 75% of your steps for cleanup.",
};

export default function RetroStepsBar({
  top = 0, right = 0, left = 0, bottom = 0,
  width, height, borderRadius,
  steps = 0, goal = 5000,
  onAllCareCheckedChange,
  onCareActionChange,
  onDisabledCarePress,
}) {
  const [boul, setBoul] = useState(0);
  const [pop, setpop] = useState(0);
  const [wat, setwat] = useState(0);
  const [activeMessageKey, setActiveMessageKey] = useState(null);
  const messageTimeoutRef = useRef(null);

  const barWidth = width || scale(280);
  const showIconMessage = useCallback((careKey) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setActiveMessageKey(null);
    setTimeout(() => {
      setActiveMessageKey(careKey);
      messageTimeoutRef.current = setTimeout(() => setActiveMessageKey(null), 3000);
    }, 0);
  }, []);
  useEffect(() => () => { if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current); }, []);
  const progress = goal ? Math.min(steps / goal, 1) : 0;
  const progressWidth = `${progress * 100}%`;

  const getIcon = (s, a, b) => (s === 0 ? a : s === 1 ? b : checked);

  // Auto-unlock icons when milestones are reached
  useEffect(() => { if (steps >= goal * 0.25 && boul === 0) setBoul(1); }, [steps, goal]);
  useEffect(() => { if (steps >= goal * 0.50 && wat  === 0) setwat(1); }, [steps, goal]);
  useEffect(() => { if (steps >= goal * 0.75 && pop  === 0) setpop(1); }, [steps, goal]);

  const allCareChecked = boul === 2 && wat === 2 && pop === 2;

  useEffect(() => {
    onAllCareCheckedChange?.(allCareChecked);
  }, [allCareChecked, onAllCareCheckedChange]);

  const iconConfigs = useMemo(
    () => ([
      {
        pct: 0.25,
        state: boul,
        setState: setBoul,
        getXml: (s) => getIcon(s, bowl, bowl1),
        canPress: steps >= goal * 0.25,
        careKey: "feed",
      },
      {
        pct: 0.47,
        state: wat,
        setState: setwat,
        getXml: (s) => getIcon(s, waterdis, waterfull),
        canPress: steps >= goal * 0.5 && boul === 2,
        careKey: "drink",
      },
      {
        pct: 0.70,
        state: pop,
        setState: setpop,
        getXml: (s) => getIcon(s, popp, pop1),
        canPress: steps >= goal * 0.75 && wat === 2,
        careKey: "clean",
      },
    ]),
    [boul, goal, steps, wat, pop]
  );

  return (
    <View style={[styles.container, { marginTop: top, marginRight: right, marginLeft: left, marginBottom: bottom }]}>
      <View style={styles.barWrapper}>
        <View style={[styles.outerBar, { width: barWidth, height: height || scale(40), borderRadius: borderRadius || scale(20) }]}>
          <View style={[styles.fillBar, { width: progressWidth }]} />
          <ImageBackground
            source={require("../../assets/images/unfilledhomebar.png")}
            style={[styles.unfilledBar, { left: progressWidth, width: `${(1 - progress) * 100}%` }]}
          />
        </View>
        <SvgXml xml={newhomebar} style={styles.barBackground} height={scale(70)} width={barWidth} />
        <Text style={styles.text}>{steps}/{goal} Steps</Text>
      </View>

      <View style={[styles.iconsRow, { width: barWidth, overflow: "visible" }]}>
        {iconConfigs.map(({ pct, state, setState, getXml, canPress, careKey }, idx) => (
          <React.Fragment key={idx}>
            <ScalePressable
              pressableStyle={[styles.iconAbsolute, { left: barWidth * pct - scale(35) }]}
              onPress={() => {
                playbottomtabsound();
                if (!canPress) {
                  showIconMessage(careKey);
                  onDisabledCarePress?.(DISABLED_MESSAGES[careKey]);
                  return;
                }
                if (state < 2) {
                  const next = state + 1;
                  setState(next);
                  if (next === 2 && onCareActionChange) {
                    onCareActionChange(careKey);
                  }
                }
              }}
            >
              <SvgXml xml={getXml(state)} height={60} width={60} />
            </ScalePressable>
            {activeMessageKey === careKey ? (
              <View style={[styles.iconMessageWrap, { left: barWidth * pct - scale(100), width: scale(170) }]}>
                <MessageBox text={DISABLED_MESSAGES[careKey]} numberOfLines={3} />
              </View>
            ) : null}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
