import React from "react";
import { styles } from "./Styles";
import { ImageBackground, Text, TouchableOpacity } from "react-native";
import SpriteLoader from "../../../components/SprieLoader";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import { cake, window } from "../../../assets/svgs";
import RetroStepsBar from "../../../components/Retroprogreebar/Retrostepsbar";
import { scale } from "react-native-size-matters";
export default () => {
    const navigation = useNavigation();
    const { petname ,petsteps} = useSelector((state) => state.petReducer);
    return (

        <ImageBackground
            source={require('../../../assets/images/HomeLayout.png')}
            imageStyle={{ resizeMode: 'cover' }}
            style={styles.container}
        >
            <TouchableOpacity onPress={() => navigation.navigate('PetMenu')}>
                <Text style={styles.name}>Hello {petname}</Text>
                <Text style={styles.welcome}>is happy</Text>
            </TouchableOpacity>
            {/* Absolute Elements */}
            <SpriteLoader />
            <RetroStepsBar 
            top={scale(92)} 
            right={scale(100)} 
            left={scale(100)} 
            bottom={scale(100)} 
            width={scale(280)} 
            height={scale(40)} 
            borderRadius={scale(20)} 
            steps={petsteps} 
            goal={1200} />          

            <ImageBackground
                source={require('../../../assets/images/star.png')}
                style={styles.starcontainer}
                imageStyle={{ resizeMode: 'contain' }}
            >
                <SvgXml xml={cake} style={styles.cakecontainer} height={50} width={40} />
            </ImageBackground>
            <SvgXml xml={window} style={styles.windowContainer} height={160} width={120} />

        </ImageBackground>
    )
}