import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
import { retro } from "../../../utils/extra/delay";
export const styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    autoRenewText: {
        color: Theme.colors.ligtBrown,
    },
    scrollContent: {
        paddingBottom: moderateScale(80),
    },
    main: {
        flex: 1,
        paddingTop: moderateScale(90),
        gap: moderateScale(20),
        // marginHorizontal: moderateScale(10),
    },
    header: {
        alignItems: "center",
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
    subscucriptionContainer: {
        marginTop: moderateScale(30),
        gap: moderateScale(18),
        overflow: "visible",
    },
    svgContainer: {
        right: moderateScale(15),
    },
    txtStyle: {
        ...combineStyles.regular12,
        width: moderateScale(300),
        alignSelf: "center",
        textAlign: "center",
        color: Theme.colors.ligtBrown,
        lineHeight: moderateScale(20)
    },
    img: {
        width: "100%",
        height: moderateScale(110),
        resizeMode: "contain",


    },
    listContent: {
        paddingTop: moderateScale(12),
        gap: moderateScale(15),
        paddingRight: moderateScale(15),
    },
    listContainer: {
        width: "100%",
        overflow: "visible",
    },
    badge: {
        position: "absolute",
        top: -10,
        right: 20,
        overflow: "visible",
    },
    imgStyle: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    title: {
        ...combineStyles.regular12,
        paddingHorizontal: moderateScale(48),
        paddingTop: moderateScale(20)
    },
    trail: {
        ...combineStyles.regular10,
        paddingHorizontal: moderateScale(48),
        color: Theme.colors.brown,
        marginTop: moderateScale(5)
    },
    prise: {
        ...combineStyles.regular10,
        paddingHorizontal: moderateScale(48),
        marginBottom: moderateScale(5)

    },
    Access: {
        ...combineStyles.regular8,
        paddingHorizontal: moderateScale(48),
        color: "#9853C4"
    },
    restoreText: {
        fontSize: 8,
        fontFamily: retro,
        textAlign: "center",
        marginVertical: moderateScale(20),
    },
    linksRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: moderateScale(20),
        gap: moderateScale(20),
    },
    linkText: {
        fontFamily: retro,
        fontSize: 6,
    },
    testButtonsRow: {
        alignSelf: "center",
        gap: moderateScale(30),
        marginVertical: moderateScale(16),
    },
    testBtn: {
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(14),
    },
    testBtnText: {
        fontFamily: retro,
        fontSize: 8,
        color: Theme.colors.brown,
        textAlign: "center",
    },

});