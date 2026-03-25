import { StyleSheet } from "react-native";
import { Theme } from "../../../libs";
import { scale } from "react-native-size-matters";
import { Retro } from "../../../utils/extra/retro";
export const Styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    imgbg: {
        flex: 1,
        resizeMode: 'stretch',
    },
    title: {
        fontSize: scale(20),
        fontFamily: Retro,
        color: Theme.colors.black,
        textAlign: 'center',
        marginTop: scale(60),
    },
    borderContainer: {
        borderWidth: 1,
        borderColor: 'red',
        width: '100%',
        height: '100%',
        marginTop: scale(60),
        marginBottom: scale(60),
        
    },
    statsContainer: {
        marginTop: scale(40),
        alignItems: 'center',
        backgroundColor: Theme.colors.oragne,
        borderWidth: 3,
        borderColor: Theme.colors.white,
        paddingVertical: scale(24),
        paddingHorizontal: scale(20),
        borderRadius: scale(10),
    },
    stats: {
        fontSize: scale(12),
        fontFamily: Retro,
        color: Theme.colors.black,
        textAlign: 'center',
        marginVertical: scale(8),
    },
    stwImage: {
        marginTop: scale(30),
        width: scale(314),   // ~20% smaller
        height: scale(269),  // ~20% smaller
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    stwImageInner: {
        resizeMode: 'stretch',
    },
});