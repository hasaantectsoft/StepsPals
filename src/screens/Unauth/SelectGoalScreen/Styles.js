import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { Theme } from "../../../libs";

export const Styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgbg: {
        flex: 1,
        paddingTop: scale(60),
        paddingHorizontal: scale(16),
    },
    content: {
        alignItems: "center",
        marginTop: scale(8),
    },
    descText: {
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(11.5),
        maxWidth: "100%",
        lineHeight: scale(16),
        color: Theme.colors.brown,
        textAlign: "center",
        marginBottom: scale(12),
    },
    descText1: {
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(11.5),
        maxWidth: "76%",
        lineHeight: scale(16),
        color: Theme.colors.brown,
        textAlign: "center",
        marginBottom: scale(24),
    },
    petImage: {
        width: scale(90),
        height: scale(90),
        marginBottom: scale(8),
        marginTop: scale(8),
    },
    petName: {
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(12),
        color: Theme.colors.brown,
        textAlign: "center",
        marginBottom: scale(16),
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: scale(32),
    },
    stepValue: {
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(18),
        color: Theme.colors.brown,
        marginRight: scale(6),
    },
    stepsLabel: {
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(12),
        color: Theme.colors.brown,
    },
});