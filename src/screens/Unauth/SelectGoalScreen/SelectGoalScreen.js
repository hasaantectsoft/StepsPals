import { View, Text, ImageBackground } from "react-native";
import { Styles } from "./Styles";
export default () => {
        return (
        <View style={Styles.container}>
            <ImageBackground
                source={require("../../../assets/images/PawPatterns.png")}
                style={Styles.imgbg}
                resizeMode="cover"
            >
                <Text>Set Your Daily Step Goal</Text>
                <Text>
                    This is the number of steps
you’ll aim to walk each
day.
                </Text>
                <Text>
                    Your pet’s health and
happiness
depend on it!
                </Text>
                <Text>
                    [PetName]
                </Text>
            </ImageBackground>
        </View>
    );
};