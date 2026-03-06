import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { Retro } from "../../../utils/extra/retro";
import { Theme } from "../../../libs";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    name:{
        fontSize: scale(7),
        fontFamily: Retro,
        color: Theme.colors.white,
        textAlign: 'center',
        position: 'absolute',
        top: scale(290),
        left: 0,
        right: 0,
    },
    welcome:{
        fontSize: scale(7),
        fontFamily: Retro,
        color: Theme.colors.white,
        textAlign: 'center',
        position: 'absolute',
        top: scale(300),
        left: 0,
        right: 0,
    }
});