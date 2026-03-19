import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { combineStyles } from "../../libs/combineStyle";
import { Theme } from "../../libs";

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  titleLogo: {
    width: "100%",
    height: moderateScale(130),
  },

  titleButton: {
    width: "95%",
    height: moderateScale(60)
  },
  rankBtn: {
    width: "70%",
    height: moderateScale(42),
    justifyContent: "center",
    alignItems: "center"
  },
  listGap: {
    gap: moderateScale(2)
  },

  titleimg: {
    width: "100%",
    height: "100%"
  },

  Lagendtxt: {
    ...combineStyles.regular16,
    color: Theme.colors.white,
    bottom: moderateScale(33),
    alignSelf: "center"
  },

  gravYard: {
    width: "100%",
    alignItems: "center",
    // gap: moderateScale(10)
  },

  img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(12),
    gap: moderateScale(8)
  },
  rankIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    alignItems: "center",
    justifyContent: "center"
  },
  id: {
    ...combineStyles.regular10,
    color: Theme.colors.white,
    fontSize: moderateScale(8)
  },
  dot: {
    ...combineStyles.regular12,
    color: Theme.colors.white,
    fontSize: moderateScale(8),
    opacity: 0.7
  },
  name: {
    ...combineStyles.regular12,
    fontSize: moderateScale(9)
  },
  score: {
    ...combineStyles.regular12,
    color: Theme.colors.blue,
    fontSize: moderateScale(9)
  }
});