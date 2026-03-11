import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { combineStyles } from "../../../libs/combineStyle";
export const styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    main: {
        flex: 1,
        paddingHorizontal: moderateScale(40),
        paddingTop: moderateScale(90),
        gap: moderateScale(20),
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
    modalStyle:{
        height: moderateScale(180),
    }
});