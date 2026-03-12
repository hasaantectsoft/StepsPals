import { StyleSheet } from "react-native";
import { Theme } from "../../../libs";
import { scale } from "react-native-size-matters";



export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingTop: scale(30),
    },
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: scale(24),
    },
    inputBg: {
        width: "100%",
        height: scale(44),
        alignItems: "center",
        justifyContent: "center",
    },
    inputImage: {
        width: "100%",
        height: "100%",
    },
    input: {
        width: "85%",
        textAlign: "center",
        height: "100%",
        backgroundColor: "transparent",
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(10),
        color: Theme.colors.darkblue,
    },
    card: {
        borderRadius: scale(12),
        paddingVertical: scale(24),
        paddingHorizontal: scale(20),
        alignItems: "center",
        width: "100%",
        maxWidth: scale(250),
        marginBottom: scale(100),
    },
    title: {
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(14),
        color: Theme.colors.darkblue,
        marginBottom: scale(16),
    },
    errorText: {
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(6),
        color: Theme.colors.DARKRED,
        marginTop: scale(8),
    },
    petImageWrap: {
        marginBottom: scale(16),
        width: scale(90),
        height: scale(90),
        alignItems: "center",
        justifyContent: "center",
    },
    doneBtn: {
        marginTop: scale(20),
        backgroundColor: Theme.colors.brightgreen,
        borderWidth: 3,
        borderColor: Theme.colors.darkblue,
        borderRadius: scale(24),
        paddingVertical: scale(14),
        paddingHorizontal: scale(48),
        alignItems: "center",
        justifyContent: "center",
    },
    doneBtnText: {
        fontFamily: Theme.typography.Retro.fontFamily,
        fontSize: scale(10),
        color: Theme.colors.darkblue,
    },
});
