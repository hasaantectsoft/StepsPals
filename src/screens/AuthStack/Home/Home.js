import React, { useEffect, useRef } from "react";
import { styles } from "./Styles";
import { Animated, Easing, Image, ImageBackground, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import SpriteLoader from "../../../components/SprieLoader";
import { useSelector, useDispatch } from "react-redux";
import { setProgressStep } from "../../../redux/slices/progressSlice";
import { fetchSteps } from "../../../utils/handler/fetchsteps";
import { useNavigation } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import { images } from "../../../assets/images";
import { SvgXml } from "react-native-svg";
import RetroStepsBar from "../../../components/Retroprogreebar/Retrostepsbar";
import { cake, newfeature, windowframe } from "../../../assets/svgs";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";
import ScalePressable from "../../../components/ScalePressable/ScalePressable";
import { babyDogsprites ,teenDogsprites,adultDogsprites} from "../../../assets/Sprites/Pets/Dog";
import { babydinosprites ,teendinosprites,adultdinosprites} from "../../../assets/Sprites/Pets/Dino";
import { babycatsprites ,teencatsprites,adultcatsprites} from "../../../assets/Sprites/Pets/Cat";
export default () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { petname, petsteps } = useSelector((state) => state.petReducer);
    console.log(petname);
    const { step } = useSelector((state) => state.progressReducer);
    const cloudX = useRef(new Animated.Value(-scale(65))).current;
    const cloudFloat = useRef(new Animated.Value(0)).current;
    const cloudY = cloudFloat.interpolate({ inputRange: [0, 1], outputRange: [-scale(4), scale(4)] });

    useEffect(() => {
        if (Platform.OS === 'android') {
            fetchSteps().then(({ granted, steps }) => {
                if (granted && steps != null) dispatch(setProgressStep(steps));
            });
        }
    }, [dispatch]);

    useEffect(() => {
        const cloudWidth = scale(65);
        const windowWidth = scale(117);

        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(cloudX, {
                    toValue: windowWidth,
                    duration: 3000,
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

        const floatAnim = Animated.loop(
            Animated.sequence([
                Animated.timing(cloudFloat, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(cloudFloat, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        );

        anim.start();
        floatAnim.start();
        return () => { anim.stop(); floatAnim.stop(); };
    }, [cloudX, cloudFloat]);

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
            <SpriteLoader   />
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
            <ScalePressable onPress={() => playButtonSound()} pressableStyle={styles.starcontainer}>
                <ImageBackground
                    source={images.star}
                    style={styles.star}
                    imageStyle={{ resizeMode: 'contain' }}
                >
                    <SvgXml xml={cake} style={styles.cakecontainer} height={50} width={40} />
                </ImageBackground>
            </ScalePressable>

            <ImageBackground
                source={images.windowBottom}
                imageStyle={styles.winowframe}
                style={styles.windowContainer}>
                <Animated.Image
                    style={[styles.cloudImage,
                    { transform: [{ translateX: cloudX }, { translateY: cloudY }] }]}
                    resizeMode="contain"
                    source={images.Cloud}
                />
            </ImageBackground>
            <SvgXml style={styles.windowFrameImage} height={scale(100)} width={scale(120)} xml={windowframe} />


        </ImageBackground>
    )
}