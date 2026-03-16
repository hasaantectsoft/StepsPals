import { StyleSheet } from "react-native";
import { Theme } from "../../libs";
import { scale } from "react-native-size-matters";
import { retro } from "../../utils/extra/delay";

export const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      position: "relative",
      zIndex: 2,
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
      // margin: scale(2),
      marginLeft: scale(10),
      // borderColor: Theme.colors.white,
      borderColor: "transparent",
      // backgroundColor: Theme.colors.lightgrey,
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
      marginRight: scale(10),
      fontSize: scale(8),
      fontFamily: retro,
      color: "#1b1b1b",
    },
    iconsRow: {
      height: scale(55),
      position: "relative",
    },
    iconAbsolute: {
      position: "absolute",
      top: 0,
    },
  });
  