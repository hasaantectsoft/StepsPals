import { StyleSheet } from "react-native";
import { Theme } from "../../libs";
import {scale} from "react-native-size-matters";
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
      logoContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  pawOverlay: {
    position: 'absolute',
    top: scale(-25),
    right: scale(10)    ,
  },
    retryButton: {
        alignItems: "center",
        marginTop: scale(20),
    },
    retryText: {
        marginTop: scale(20),
        marginBottom: scale(20),
        fontFamily: Theme.typography.Retro.fontFamily,
        textAlign: "center",
        color: "black",
    },
    failedText: {
        marginTop: scale(10),
        marginBottom: scale(10),
        fontFamily: Theme.typography.Retro.fontFamily,
        textAlign: "center",
        color: Theme.colors.error,
        fontSize: 14,
    },
});