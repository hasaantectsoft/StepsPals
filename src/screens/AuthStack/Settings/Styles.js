import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { combineStyles } from "../../../libs/combineStyle";
export const styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: moderateScale(159),
    },
    main: {
        flex: 1,
        paddingHorizontal: moderateScale(40),
        paddingTop: moderateScale(10),
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
    },
    title:{
        ...combineStyles.regular26, 
        textAlign: "center" ,
        marginTop: moderateScale(60)
    },
    version:{
        textAlign: "center",
        marginTop: moderateScale(20),
        ...combineStyles.regular8,
    },
    devSection: {
        marginTop: moderateScale(24),
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(8),
        backgroundColor: "rgba(0,0,0,0.06)",
        borderRadius: moderateScale(8),
    },
    devLabel: {
        ...combineStyles.regular14,
        marginBottom: moderateScale(8),
    },
    devRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: moderateScale(6),
    },
    devSub: {
        ...combineStyles.regular12,
        marginRight: moderateScale(6),
        width: moderateScale(44),
    },
    devBtn: {
        paddingVertical: moderateScale(6),
        paddingHorizontal: moderateScale(10),
        marginRight: moderateScale(6),
        marginBottom: moderateScale(4),
        backgroundColor: "rgba(0,0,0,0.08)",
        borderRadius: moderateScale(6),
    },
    devBtnText: {
        ...combineStyles.regular12,
    },
    devHint: {
        ...combineStyles.regular10,
        marginTop: moderateScale(4),
        opacity: 0.8,
    },
});