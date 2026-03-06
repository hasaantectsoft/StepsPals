import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(40),
    alignItems: "center",
  },
  note: {
  ...combineStyles.regular10,
    lineHeight:moderateScale(15),
    color:Theme.colors.brown,
    textAlign: "center",
    marginTop: 10,
  },
  saveBtn: {
    marginTop: "auto",
    bottom:moderateScale(60),
    // height:moderateScale(50),
    width: "100%",
    // alignItems: "center",
    // justifyContent:"center"
  },
  btn:{
   ...combineStyles.regular14,
   top:moderateScale(3),
   color:"white",
   left:moderateScale(140),
   top:moderateScale(20),
   position:"absolute"
  }
});