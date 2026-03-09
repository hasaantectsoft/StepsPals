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
        color: Theme.colors.yellow,
        textAlign: 'center',
        position: 'absolute',
        top: scale(300),
        left: 0,
        right: 0,
    },
    cloudContainer:{
        position: 'absolute',
        top: scale(80),
        right: scale(0),
    },
    winowframe:{
        resizeMode: 'contain',
        width: scale(117),
        height: scale(84),
    },
    windowContainer:{
        position: 'absolute',
        top: scale(160),
        right: scale(10),
        width: scale(117),
        height: scale(157),
        overflow: 'hidden',
    },
    cloudImage: {
        width: scale(65),
        height: scale(32),
        top: scale(16),
    },
    windowFrameImage: {
        position: "absolute",
        top: scale(160),
        right: scale(10),
        width: scale(117),
        height: scale(160),
        zIndex: 1,
    },
    starcontainer: {
        position: 'absolute',
        top: scale(62),
        right: scale(17),
        width: scale(100),
        height: scale(80),
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cakecontainer: {},
    
});