import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { Theme } from "../../libs";

export default StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scale(16),
        paddingVertical: scale(12),
        marginBottom: scale(8),
    },
    backBtn: {
        width: scale(34),
        height: scale(34),
        marginRight: scale(12),
    },
    title: {
        // flex: 1,
        textAlign: "center",
        width: "100%",
        fontFamily: "PressStart2P-Regular",
        lineHeight: scale(20),
        fontSize: scale(14),
        color: Theme.colors.black,
    },
    titleContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        gap: scale(4),
    },
    subtitle: {
        fontFamily: "PressStart2P-Regular",
        lineHeight: scale(20),
        fontSize: scale(16),
        color: Theme.colors.black,
    },
    subtitleCenter: {
        alignSelf: "center",
    },
});
