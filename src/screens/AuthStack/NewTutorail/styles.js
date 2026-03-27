import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { retro } from "../../../utils/extra/delay";
import { Theme } from "../../../libs";

export const style=StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    layerFill: {
        flex: 1,
        width: "100%",
    },
    tutorialSvgOverlay9: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: moderateScale(150),
        alignItems: "center",
        zIndex: 10,
    },
    tutorialSvgOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: moderateScale(280),
        alignItems: "center",
        zIndex: 10,
    },
    sub:{
        fontFamily:retro,
        marginTop:moderateScale(10),
        fontSize:moderateScale(13),
        textAlign:"center",
        color:Theme.colors.white,},
    heading:{
        fontFamily:retro,
        
        fontSize:moderateScale(20),
        textAlign:"center",
        color:Theme.colors.white,
        marginTop:moderateScale(150),
    },
    headerHidden:{
        opacity:0,
    },
    messabeboxtext:{
        fontFamily:retro,
        marginTop:moderateScale(30),
        fontSize:moderateScale(13),
        textAlign:"center",
        color:Theme.colors.black,
    },
    image:{
        alignSelf:"center",
        marginTop:moderateScale(30),
        width: moderateScale(300),
        height: moderateScale(100),
    },
    petSlot:{
        alignSelf:"center",
        marginTop:moderateScale(120),
        width: moderateScale(120),
        minHeight: moderateScale(130),
        justifyContent:"center",
        alignItems:"center",
    },
    eggInner: {
        width: moderateScale(100),
        height: moderateScale(100),
        justifyContent: "center",
        alignItems: "center",
    },
    crack1: {
        position: "absolute",
        width: moderateScale(20),
        height: moderateScale(40),
        alignSelf: "center",
        top: moderateScale(20),
        zIndex: 1,
    },
    crack2: {
        position: "absolute",
        width: moderateScale(45),
        height: moderateScale(40),
        alignSelf: "center",
        top: moderateScale(20),
        zIndex: 1,
    },
    hatchStack: {
        width: "100%",
        minHeight: moderateScale(130),
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    puffOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
})