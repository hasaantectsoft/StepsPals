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
        alignItems: "center",
    },
    title: {
        fontSize: scale(10),
        paddingTop: scale(140),

        textAlign: "center",
        fontFamily: Theme.typography.Retro.fontFamily,
        color: Theme.colors.brown,
        maxWidth: '80%',
        lineHeight: scale(14),
        // marginTop: scale(20),
        marginBottom: scale(14),
    },

    petItem: {
        marginTop: scale(10),
        alignItems: "center",
        paddingVertical: scale(8),
        paddingHorizontal: scale(6),
        borderRadius: Theme.borders.regularRadius,
    },
    selectedPetItem: {
        borderWidth: 2,
        borderColor: Theme.colors.white,
    },
    selectedBgImage: {
        resizeMode: "contain",
height: scale(130),
width: scale(100),
        borderRadius: Theme.borders.regularRadius,
    },
    petName:{
        fontSize: scale(10),
        fontFamily: Theme.typography.Retro.fontFamily,
        textAlign: "center",
        color: Theme.colors.black,
        // marginTop: scale(10),
        
    },
    subtitle: {
        marginTop: scale(10),
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
       marginBottom: scale(120),
    },
    nextButton: {
        width: scale(120),
        height: scale(100),
        justifyContent: "center",
        alignItems: "center",
    },
    nextButtonText: {
        fontSize: scale(12),
        fontFamily: Theme.typography.Retro.fontFamily,
        textAlign: "center",
        color: Theme.colors.white,
    },
});

