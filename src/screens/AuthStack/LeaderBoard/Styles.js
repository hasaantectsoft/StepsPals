import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
export const styles = StyleSheet.create({
     container: {
        flex: 1,
        paddingHorizontal: moderateScale(10),
        paddingTop: moderateScale(50),
      
       
      },
      titleLogo:{
        width:"100%",
        height:moderateScale(130)
      },
      titleButton:{
        width:"100%",
        height:moderateScale(60),
        alignSelf:"center"
      },
      titleimg:{
        width:"100%",
        height:"100%"
      },
      Lagendtxt:{
        ...combineStyles.regular16,
        color:Theme.colors.white,
        bottom:moderateScale(33)
      },
      timeContainer:{
        alignItems:"center",
        marginTop:moderateScale(10),
        marginBottom:moderateScale(10),
        gap:moderateScale(5)
      },
      timeText:{
        ...combineStyles.regular8,
        color:"#2F3450"
      },
      timeValue:{
        ...combineStyles.regular14,
        color:"#2F3450"
      }
});