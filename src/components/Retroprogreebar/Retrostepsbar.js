import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Theme } from "../../libs";
import { retro } from "../../utils/extra/delay";
import { scale } from "react-native-size-matters";
import { bowl, bowl1, checked, popp, waterdis, waterfull } from "../../assets/svgs";
import { SvgXml } from "react-native-svg";

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
    // if 0 the 1st icon 2 then 2nd 3 then 4th icon
const [boul, setBoul] = useState(0)
const [pop,setpop]=useState(0)
const [wat,setwat]=useState(0)
const progress = Math.min(steps / goal, 1);
  const progressWidth = `${progress * 100}%`;
  const getIcon = (petsteps, a, b) => (petsteps === 0 ? a : petsteps === 1 ? b : checked);
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
      <View
        style={[
          styles.outerBar,
          {
            width: width || scale(280),
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
     <View style={{
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%",
        alignItems:"center",
        gap:scale(10),
     }}>
    <TouchableOpacity onPress={() => setBoul(boul+1)} disabled={boul===2}>
  <SvgXml xml={getIcon(boul,bowl,bowl1)} style={styles.bowlcontainer} height={50} width={40}/>
</TouchableOpacity>

<TouchableOpacity onPress={() => setwat(wat+1)} disabled={wat===2}>
  <SvgXml xml={getIcon(wat,waterdis,waterfull)} style={styles.bowlcontainer} height={50} width={40}/>
</TouchableOpacity>

<TouchableOpacity onPress={() => setpop(pop+1)} disabled={pop===2}>
  <SvgXml xml={getIcon(pop,popp,popp)} style={styles.bowlcontainer} height={50} width={40}/>
</TouchableOpacity>
    </View>
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  outerBar: {
    borderWidth: scale(4),
    borderColor: Theme.colors.darkblue,
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