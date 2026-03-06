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
        color:Theme.colors.ligtBrown
    }
});