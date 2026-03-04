import { ImageBackground, Text, View } from "react-native"
import { styles } from "./styles";
import { Header } from "../../../components";
export default () => {
return (
    <>
    <ImageBackground
    source={require("../../../assets/images/PawPatterns.png")}
    style={styles.wrapper}
    resizeMode="cover"
    >
        <View style={styles.headerContainer}> 
        <Header title="we need some "
        subtitle="permissions" 
        onBackPress={() => navigation.goBack()} />
        </View>
    </ImageBackground>
    </>
)

}