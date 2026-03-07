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
  details:{
        flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingHorizontal: moderateScale(30),
    paddingTop:moderateScale(15)
  },
    rankIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    resizeMode: "contain",
    alignItems:"center",
    justifyContent:"center"
  },
  id:{
    ...combineStyles.regular10,
    color:Theme.colors.white,
    top:moderateScale(2)
  },
  name:{
    ...combineStyles.regular12,
    left:moderateScale(10),
    top:moderateScale(3)
  },
  score:{
    ...combineStyles.regular12,
    
    color:Theme.colors.blue,
    position:"absolute",
    top:moderateScale(24),
    right:moderateScale(30)
  }
});