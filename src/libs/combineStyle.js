import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Theme } from ".";



export const combineStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(20)
    },
    regular26: {
        fontSize: moderateScale(26),
        fontFamily: Theme.typography.Retro.fontFamily,
        color: Theme.colors.black
    },
    regular18: {
        fontSize: moderateScale(18),
        fontFamily: Theme.typography.Retro.fontFamily,
        color: Theme.colors.black
    },
    regular16: {
        fontSize: moderateScale(16),
        fontFamily: Theme.typography.Retro.fontFamily,
        color: Theme.colors.black
    },
    regular14: {
        fontSize: moderateScale(14),
        fontFamily: Theme.typography.Retro.fontFamily,
        color: Theme.colors.black
    },
    regular12: {
        fontSize: moderateScale(12),
        fontFamily: Theme.typography.Retro.fontFamily,
        color: Theme.colors.black
    },
    regular10: {
        fontSize: moderateScale(10),
        fontFamily: Theme.typography.Retro.fontFamily,
        color: Theme.colors.black
    },
    rowSpacebetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backGroundImg: {
        width: "100%",
        height: "100%",
    },
    row: {
        flexDirection: "row",
        gap: moderateScale(10),
        alignItems: "center"
    }
});