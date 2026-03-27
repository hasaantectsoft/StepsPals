import { Dimensions, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { retro } from "../../../utils/extra/delay";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export const styles = StyleSheet.create({
  petInfo: {
    alignItems: "center",
    marginTop:moderateScale(33)
  },
  petName: {
    marginTop: moderateScale(18),
    fontFamily: retro,
    fontSize: isSmallScreen ? moderateScale(16) : moderateScale(16),
    textAlign: "center",
  },
  petDays: {
    fontFamily: retro,
    fontSize: isSmallScreen ? moderateScale(10) : moderateScale(10),
    marginVertical: 4,
  },
  petImage: {
    marginTop: moderateScale(35),
    marginBottom:moderateScale(30),
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
});

