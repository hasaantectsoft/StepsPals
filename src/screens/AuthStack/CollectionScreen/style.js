import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: moderateScale(50),
        gap: moderateScale(15),
        alignItems: "center",
    },
    txt: {
        ...combineStyles.regular12,
        width: moderateScale(300),
        textAlign: "center",
        lineHeight: moderateScale(20),
        color: Theme.colors.brown
    },
    img: {
        width: "100%",
        height: moderateScale(590),
        alignItems: "center",
        justifyContent:"center"
        

    },
    imgStyle: {
        width: "100%",
         height: "100%",
        resizeMode: "stretch"
    },
    card: {
        width: moderateScale(75),
        height: moderateScale(105),
        margin: moderateScale(5),
    },
    cardImage: {
        width: "100%",
        height: "100%",
        resizeMode: "stretch",
        alignItems:"center",
        justifyContent:"center"
    },
    CollectionCard: {
        
    },
    listContent:{
        alignSelf:"center",
        justifyContent:"center",
    },
    innerContainer:{
       width:"80%",
       height:"78%",
       borderRadius:moderateScale(20),
       marginTop:"auto",
       bottom:moderateScale(35),
    //    backgroundColor:"#f2cc81"
    },
    petimg:{
        width:"60%",
        height:"70%",
        resizeMode:"contain",
        alignSelf:"center",
    },
    name:{
        ...combineStyles.regular6,
        textAlign:"center",
        color:Theme.colors.black,
    },
    date:{
        ...combineStyles.regular6,
        textAlign:"center",
        color:Theme.colors.brown,

    },
       modalStyle:{
        height: moderateScale(160),
    },
});