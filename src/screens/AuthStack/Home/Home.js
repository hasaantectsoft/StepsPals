import React, { useEffect, useRef } from "react";
import { styles } from "./Styles";
import { Animated, Easing, ImageBackground, Text, TouchableOpacity } from "react-native";
import SpriteLoader from "../../../components/SprieLoader";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import { images } from "../../../assets/images";
import { SvgXml } from "react-native-svg";
import RetroStepsBar from "../../../components/Retroprogreebar/Retrostepsbar";
import { cake, windowframe } from "../../../assets/svgs";
export default () => {
    const navigation = useNavigation();
    const { petname, petsteps } = useSelector((state) => state.petReducer);

    const cloudX = useRef(new Animated.Value(-scale(65))).current;
    useEffect(() => {
        const cloudWidth = scale(65);
        const windowWidth = scale(117);

        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(cloudX, {
                    toValue: windowWidth,
                    duration: 6000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(cloudX, {
                    toValue: -cloudWidth,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );

        anim.start();
        return () => anim.stop();
    }, [cloudX]);

    return (

        <ImageBackground
            source={images.HomeLayout}
            imageStyle={{ resizeMode: 'cover' }}
            style={styles.container}
        >
            <TouchableOpacity onPress={() => navigation.navigate('PetMenu')}>
                <Text style={styles.name}>Hello {petname}</Text>
                <Text style={styles.welcome}>is happy</Text>
            </TouchableOpacity>
            <SpriteLoader />
            <RetroStepsBar
                top={scale(92)}
                right={scale(100)}
                left={scale(100)}
                bottom={scale(100)}
                width={scale(280)}
                height={scale(40)}
                borderRadius={scale(20)}
                steps={3000}
                goal={5000} />

            <ImageBackground
                source={images.star}
                style={styles.starcontainer}
                imageStyle={{ resizeMode: 'contain' }}
            >
                <SvgXml xml={cake} style={styles.cakecontainer} height={50} width={40} />
            </ImageBackground>
            <ImageBackground 
                source={images.windowBottom } 
                imageStyle={styles.winowframe} 
                style={styles.windowContainer}>
                <Animated.Image
                    style={[styles.cloudImage, 
                    { transform: [{ translateX: cloudX }] }]}
                    resizeMode="contain"
                    source={images.Cloud}
                />
            </ImageBackground>
            <SvgXml style={styles.windowFrameImage} height={scale(100)} width={scale(120)} xml={windowframe}/>


        </ImageBackground>
    )
}