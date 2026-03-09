import React from "react";
import { ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Styles } from "./Styles";
import { stats } from "../../../utils/extra/stats";
import { images } from "../../../assets/images";

export default () => {
  return (
    <ImageBackground
      source={require("../../../assets/images/Statistics.png")}
      style={Styles.imgbg}
    >
      <SafeAreaView edges={["top"]} style={Styles.container}>
        <Text style={Styles.title}>Statistics</Text>

        <ImageBackground
          source={images.stw}
          style={Styles.stwImage}
          imageStyle={Styles.stwImageInner}
        >
            {stats.map((stat, index) => (
              <Text key={index} style={Styles.stats}>
                {stat.title}: {stat.value}
              </Text>
            ))}
        </ImageBackground>
      </SafeAreaView>
    </ImageBackground>
  );
}