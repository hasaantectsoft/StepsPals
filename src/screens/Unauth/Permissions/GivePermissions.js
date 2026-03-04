import { ImageBackground, Text, View } from "react-native"
import { styles } from "./styles";
import { Header } from "../../../components";
import { useNavigation } from "@react-navigation/native";
export default () => {
    const navigation = useNavigation();

return (

    <>
    <ImageBackground
    source={require("../../../assets/images/required.png")}
    style={styles.wrapper}
    resizeMode="cover"
    >
        <View style={styles.headerContainer}> 
        <Header title="we need some"
        subtitle="permissions" 
        onBackPress={() => navigation.goBack()} />
        </View>
    </ImageBackground>
    </>
)

}