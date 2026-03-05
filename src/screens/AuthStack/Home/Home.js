import React from "react";
import { styles } from "./Styles";
import { ImageBackground, Text } from "react-native";
import SpriteLoader from "../../../components/SprieLoader";
export default () => {
return (

    <ImageBackground
    source={require('../../../assets/images/HomeLayout.png')}
    imageStyle={{resizeMode: 'cover'}}
        style={styles.container}
    >
<SpriteLoader />
    </ImageBackground>
)
}