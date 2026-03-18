import { Dimensions, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export const styles = StyleSheet.create({
  petInfo: {
    alignItems: "center",
  },
  petName: {
    marginTop: moderateScale(10),
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? moderateScale(18) : moderateScale(22),
    textAlign: "center",
  },
  petDays: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? moderateScale(12) : moderateScale(14),
    marginVertical: 4,
  },
  petImage: {
    marginTop: moderateScale(16),
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
});

