import React from "react";
import { styles } from "./Styles";
import { ImageBackground, Text, View } from "react-native";
import SpriteLoader from "../../../components/SprieLoader";
export default () => {
    
return (

    <ImageBackground
    source={require('../../../assets/images/HomeLayout.png')}
    imageStyle={{resizeMode: 'cover'}}
        style={styles.container}
    >
        <View>

        <Text style={styles.name}>Hello [Name]</Text>
        <Text style={styles.welcome}>is happy</Text>
        </View>
<SpriteLoader />
    </ImageBackground>
)
}