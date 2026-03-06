import React from "react";
import { styles } from "./Styles";
import { ImageBackground, Pressable, Text } from "react-native";
import SpriteLoader from "../../../components/SprieLoader";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
export default () => {
    const navigation = useNavigation(); 
    const { petname} = useSelector((state) => state.petReducer);
return (

    <ImageBackground
    source={require('../../../assets/images/HomeLayout.png')}
    imageStyle={{resizeMode: 'cover'}}
        style={styles.container}
    >
        <Pressable onPress={() => navigation.navigate('PetMenu')}>

        <Text style={styles.name}>Hello {petname}</Text>
        <Text style={styles.welcome}>is happy</Text>
        </Pressable>
<SpriteLoader />
    </ImageBackground>
)
}