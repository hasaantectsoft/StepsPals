import { StyleSheet } from "react-native";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
import { moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: {
    ...combineStyles.container,
    backgroundColor: Theme.colors.DarkGreen,
  },

  header: {
    ...combineStyles.regular16,
    textAlign: "center",
    marginTop: moderateScale(30),
    marginBottom: moderateScale(15),
  },

  subtitle: {
    ...combineStyles.regular12,
    color: Theme.colors.brown,
    textAlign: "center",
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(15),
  },

  gravYardContainer: {
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(200),
  },

  row: {
    justifyContent: "flex-start",
    marginBottom: moderateScale(12),
  },

  item: {
    width: "33.444%",
    alignItems: "center",
  },

  gravYard: {
    width: moderateScale(100),
    height: moderateScale(110),
  },

  name: {
    position: "absolute",
    top: moderateScale(39),
    left: 0,
    right: 0,
    ...combineStyles.regular10,
    fontSize: moderateScale(6.5),
    textAlign: "center",
  },

  borndate: {
    position: "absolute",
    top: moderateScale(80),
    left: moderateScale(31),
    ...combineStyles.regular10,
    fontSize: moderateScale(5),
  },

  diedate: {
    position: "absolute",
    top: moderateScale(70),
    left: moderateScale(31),
    ...combineStyles.regular10,
    fontSize: moderateScale(5),
  },
  bottomText:{
    ...combineStyles.regular10,
    textAlign: "center",
    marginTop: moderateScale(70),
    lineHeight: moderateScale(18),
    color:"#6E5B51",
    width: moderateScale(270),
    alignSelf:"center"
  }
});