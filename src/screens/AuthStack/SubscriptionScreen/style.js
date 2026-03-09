import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
export const styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    main: {
        flex: 1,
        paddingTop: moderateScale(90),
        gap: moderateScale(20),
        marginHorizontal: moderateScale(20),
    },
    header:{
        alignItems:"center",
    },
    buttonContainer: {
        marginTop: moderateScale(30),
        gap: moderateScale(20),
    },
    margin: {
        marginTop: moderateScale(20)
    },
    textStyle: {
        ...combineStyles.regular18,
        marginTop: moderateScale(30),
        bottom: moderateScale(10)
    },
    subscucriptionContainer:{
        marginTop:moderateScale(30),
        gap:moderateScale(18),
        // alignItems:"center",
        // backgroundColor:"black"
    },
    svgContainer:{
        right: moderateScale(15),
    },
    txtStyle:{
        ...combineStyles.regular12,
        width:moderateScale(300),
        alignSelf:"center",
        textAlign:"center",
        color:Theme.colors.ligtBrown,
        lineHeight:moderateScale(20)
    },
    img:{
        width:"100%",
        height:moderateScale(110),
        resizeMode:"contain",
       

    },
    listContainer:
    {
        width:"100%"
    },
    imgStyle:{
        width:"100%",
        height:"100%",
        resizeMode:"cover"
    },
    title:{
        ...combineStyles.regular12,
        paddingHorizontal:moderateScale(48),
        paddingTop:moderateScale(20)
    },
    trail:{
        ...combineStyles.regular10,
        paddingHorizontal:moderateScale(48),
        color:Theme.colors.brown,
        marginTop:moderateScale(5)
    },
    prise:{
         ...combineStyles.regular10,
        paddingHorizontal:moderateScale(48),
        marginBottom:moderateScale(5)

    },
    Access:{
        ...combineStyles.regular8,
        paddingHorizontal:moderateScale(48),
        color:"#9853C4"
    }
    
});