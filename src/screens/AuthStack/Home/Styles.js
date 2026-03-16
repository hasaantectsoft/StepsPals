import { Platform, StyleSheet } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import { Retro } from "../../../utils/extra/retro";
import { Theme } from "../../../libs";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerPressArea: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? scale(270) : scale(290),
        left: 0,
        right: 0,
        height: scale(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    name:{
        fontSize: scale(5),
        // maxWidth:scale(100),
        fontFamily: Retro,
        color: Theme.colors.white,
        textAlign: 'center',
    },
    star:{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    welcome:{
        fontSize: scale(5),
        fontFamily: Retro,
        color: Theme.colors.yellow,
        textAlign: 'center',
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
        top: scale(29),
    },
    windowFrameImage: {
        position: "absolute",
        top: scale(160),
        right: scale(10),
        width: scale(117),
        height: scale(160),
        zIndex: 1,
    },
    petSpriteWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    starcontainer: {
        position: 'absolute',
        top: scale(62),
        right: scale(17),
        width: scale(100),
        height: scale(80),
        zIndex: 5,
    },
    cakecontainer: {
        width: scale(40),
        height: scale(50),
    },
    cakeTouchable: {
        position: 'absolute',
        // adjust these values to shift the touchable where you want
        top: scale(8),
        right: scale(10),
        zIndex: 6,
    },
    collectioncontainer: { alignContent: 'center', position: 'absolute', top: scale(220), left: scale(20) },
    upgradeModalContainer:{
        width: scale(270),
        height: scale(280),
        gap:moderateScale(10)
    },
    titleStyle:{
        fontSize: scale(14),
        top: moderateScale(8),
        color:"red"
    }
});