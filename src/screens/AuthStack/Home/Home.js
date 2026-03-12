import React, { useEffect, useRef } from "react";
import { styles } from "./Styles";
import { Animated, Easing, Image, ImageBackground, Pressable, Text, TouchableOpacity, View } from "react-native";
import SpriteLoader from "../../../components/SprieLoader";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import { images } from "../../../assets/images";
import { NativeModules } from 'react-native';
import { SvgXml } from "react-native-svg";
import RetroStepsBar from "../../../components/Retroprogreebar/Retrostepsbar";
import { cake, newfeature, windowframe } from "../../../assets/svgs";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";
import { checkBackgroundAccess, getTodaySteps, initializeHealthConnect, requestPermissions } from "../../../utils/StepCounter";
export default () => {
    const navigation = useNavigation();
    const { petname, petsteps } = useSelector((state) => state.petReducer);


    // useEffect(() => {
    //     const fetchSteps = async () => {
    //         const initialized = await initializeHealthConnect();
    //         if (!initialized) return;
    //         const permission = await checkBackgroundAccess();
    //         if (!permission) {
    //             await requestPermissions();
    //         }
    //         const steps = await getTodaySteps();
    //         console.log('Steps today:', steps);
    //     };

    //     fetchSteps(); // initial fetch

    //     // // const interval = setInterval(fetchSteps, 5000); // update every 5 seconds
    //     // return () => clearInterval(interval); // cleanup on unmount
    // }, []);



    useEffect(() => {
    const fetchSteps = async () => {
        try {
            const initialized = await initializeHealthConnect();
            if (!initialized) return;

            const permission = await checkBackgroundAccess();
            if (!permission) {
                await requestPermissions();
            }

            const steps = await getTodaySteps();
            console.log('Steps today:', steps);

            
            if (NativeModules.StepWidget && NativeModules.StepWidget.updateSteps) {
                NativeModules.StepWidget.updateSteps(steps);
            }

        } catch (error) {
            console.error('Error fetching steps or updating widget:', error);
        }
    };

    fetchSteps(); 

   
}, []);







    const { step } = useSelector((state) => state.progressReducer);
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
            <Pressable onPress={() => { playButtonSound(); }}>
                <TouchableOpacity hitSlop={30} onPress={() => { navigation.navigate('PetMenu') }}>
                    <Text style={styles.name}>Hello {petname}</Text>
                    <Text style={styles.welcome}>is happy</Text>
                </TouchableOpacity>
            </Pressable>
            <SpriteLoader />
            <RetroStepsBar
                top={scale(92)}
                right={scale(100)}
                left={scale(100)}
                bottom={scale(100)}
                width={scale(280)}
                height={scale(40)}
                borderRadius={scale(20)}
                steps={step}
                goal={petsteps} />


            <View style={styles.collectioncontainer}>
                <TouchableOpacity onPress={() => { playButtonSound(); navigation.navigate('Collection') }}>
                    <Image source={images.collection} style={{ width: scale(45), height: scale(45) }} />
                </TouchableOpacity>                        
                <SvgXml height={scale(45)} width={scale(45)} xml={newfeature} />
            </View>
            <ImageBackground

                source={images.star}
                style={styles.starcontainer}
                imageStyle={{ resizeMode: 'contain' }}
            >
                <TouchableOpacity onPress={() => playButtonSound()}>
                    <SvgXml xml={cake} style={styles.cakecontainer} height={50} width={40} />
                </TouchableOpacity>
            </ImageBackground>
            <ImageBackground
                source={images.windowBottom}
                imageStyle={styles.winowframe}
                style={styles.windowContainer}>
                <Animated.Image
                    style={[styles.cloudImage,
                    { transform: [{ translateX: cloudX }] }]}
                    resizeMode="contain"
                    source={images.Cloud}
                />
            </ImageBackground>
            <SvgXml style={styles.windowFrameImage} height={scale(100)} width={scale(120)} xml={windowframe} />


        </ImageBackground>
    )
}