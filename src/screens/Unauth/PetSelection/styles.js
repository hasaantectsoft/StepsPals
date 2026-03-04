import { StyleSheet } from "react-native";
import { Theme } from "../../../libs";
import { scale } from "react-native-size-matters";
export const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.primary,
    },
    imgbg: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: scale(10),
        textAlign: "center",
        fontFamily: Theme.typography.Retro.fontFamily,
        color: Theme.colors.brown,
        maxWidth: '80%',
        lineHeight: scale(14),
        marginBottom: scale(14),
    },
    nextButtonWrapper: {
        position: "absolute",
        bottom: scale(89),
        // right: scale(20),
        alignItems: "center",
    },
    nextButton: {
        width: scale(120),
        height: scale(48),
        justifyContent: "center",
        alignItems: "center",
    },
    nextButtonText: {
        fontSize: scale(12),
        fontFamily: Theme.typography.Retro.fontFamily,
        textAlign: "center",
        color: Theme.colors.white,
    },
    petItem: {
        alignItems: "center",
        paddingVertical: scale(8),
        paddingHorizontal: scale(12),
        borderRadius: Theme.borders.regularRadius,
    },
    selectedPetItem: {
        borderWidth: 5,
        borderColor: Theme.colors.white,
        backgroundColor: Theme.colors.selectedPetBg,
    },
    petName:{
        fontSize: scale(10),
        fontFamily: Theme.typography.Retro.fontFamily,
        textAlign: "center",
        color: Theme.colors.black,
        marginTop: scale(10),
    },
    subtitle: {
        fontSize: scale(14),
        fontFamily: Theme.typography.Retro.fontFamily,
        textAlign: "center",
        color: Theme.colors.black,
    },
    petContainer:{
       flexDirection: "row",
       justifyContent: "center",
       alignItems: "center",
       marginTop: scale(14),
    },
});

