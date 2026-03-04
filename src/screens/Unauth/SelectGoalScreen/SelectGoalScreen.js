import { View, Text } from "react-native";
import { Styles } from "./Styles";
export default () => {
        return (
        <View style={Styles.container}>
            <ImageBackground
                source={require("../../../assets/images/PawPatterns.png")}
                style={Styles.imgbg}
                resizeMode="cover"
            >
                <Text>Select Goal</Text>
            </ImageBackground>
        </View>
    );
};