import { StyleSheet } from "react-native";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
import { moderateScale, scale } from "react-native-size-matters";
export const styles = StyleSheet.create({
    container: {
        ...combineStyles.container,
        backgroundColor: Theme.colors.DarkGreen,

    },
    header: {
        ...combineStyles.regular16,
        textAlign: "center",
        marginTop: moderateScale(30),
        marginBottom:moderateScale(15)
    },
    subtitle: {
        ...combineStyles.regular12,
        color: Theme.colors.brown,
        textAlign: "center",
        lineHeight: moderateScale(18),
        marginBottom:moderateScale(15)
    },
    gravYard:{
        width:moderateScale(100),
        height:moderateScale(110)
    },
    gravYardContainer:{
        ...combineStyles.rowSpacebetween,
        flexWrap:"wrap",
        
        rowGap: moderateScale(12),
  columnGap: moderateScale(10),
  paddingBottom:moderateScale(300),
  justifyContent:'flex-start',
  

        
    },
    name:{
position: "absolute",
top:moderateScale(39),
left:moderateScale(17),
...combineStyles.regular10,
fontSize:moderateScale(8)
    },
    borndate:{
position: "absolute",
top:moderateScale(80),
left:moderateScale(31),
...combineStyles.regular10,
fontSize:moderateScale(5),
    },
diedate:{
position: "absolute",
top:moderateScale(70),
left:moderateScale(31),
...combineStyles.regular10,
fontSize:moderateScale(5)
}
});