import React, { useEffect, useRef, useState } from "react";
import { styles } from "./Styles";
import { Animated, Easing, Image, ImageBackground, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import SpriteLoader from "../../../components/SprieLoader";
import { useSelector, useDispatch } from "react-redux";
import { setProgressStep } from "../../../redux/slices/progressSlice";
import { updatePet } from "../../../redux/slices/petslice";
import { fetchSteps } from "../../../utils/handler/fetchsteps";
import { useNavigation } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import { images } from "../../../assets/images";
import { SvgXml } from "react-native-svg";
import RetroStepsBar from "../../../components/Retroprogreebar/Retrostepsbar";
import { cake, newfeature, windowframe, cakefilled, starchecked } from "../../../assets/svgs";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";
import ScalePressable from "../../../components/ScalePressable/ScalePressable";
import { babyDogsprites, teenDogsprites, adultDogsprites } from "../../../assets/Sprites/Pets/Dog";
import { babydinosprites, teendinosprites, adultdinosprites } from "../../../assets/Sprites/Pets/Dino";
import { babycatsprites, teencatsprites, adultcatsprites } from "../../../assets/Sprites/Pets/Cat";

const SPRITE_MAP = {
    '1': { baby: babyDogsprites.Dogmain,  teen: teenDogsprites.Dogmain,  adult: adultDogsprites.Dogmain  },
    '2': { baby: babycatsprites.catmain,  teen: teencatsprites.catmain,  adult: adultcatsprites.catmain  },
    '3': { baby: babydinosprites.dinomain, teen: teendinosprites.dinomain, adult: adultdinosprites.dinomain },
};

const getStage = (ageInDays) => {
    if (ageInDays <= 7)  return 'baby';
    if (ageInDays <= 21) return 'teen';
    return 'adult';
};

export default () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { petname, petsteps, petkey, petcreatedat, pendingpetsteps, pendingfrom } = useSelector((state) => state.petReducer);

    const ageInDays = petcreatedat
        ? Math.min(Math.floor((Date.now() - petcreatedat) / (1000 * 60 * 60 * 24)), 21)
        : 0;
    const stage = getStage(ageInDays);
    const spriteImage = SPRITE_MAP[petkey]?.[stage] ?? babydinosprites.dinomain;
    console.log(petname);
    const { step } = useSelector((state) => state.progressReducer);
    const cloudX = useRef(new Animated.Value(-scale(65))).current;
    const cloudFloat = useRef(new Animated.Value(0)).current;
    const cloudY = cloudFloat.interpolate({ inputRange: [0, 1], outputRange: [-scale(4), scale(4)] });

    const [starTapped, setStarTapped] = useState(false);
    const starFlicker = useRef(new Animated.Value(1)).current;
    const isComplete = step >= petsteps && petsteps > 0;

    useEffect(() => {
        if (Platform.OS === 'android') {
            fetchSteps().then(({ granted, steps }) => {
                if (granted && steps != null) dispatch(setProgressStep(steps));
            });
        }
    }, [dispatch]);

    useEffect(() => {
        if (pendingpetsteps !== null && pendingfrom !== null && Date.now() >= pendingfrom) {
            dispatch(updatePet({ petsteps: pendingpetsteps, pendingpetsteps: null, pendingfrom: null }));
        }
    }, [pendingpetsteps, pendingfrom]);

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

    useEffect(() => {
        if (isComplete && !starTapped) {
            const flicker = Animated.loop(
                Animated.sequence([
                    Animated.timing(starFlicker, { toValue: 0.15, duration: 300, useNativeDriver: true }),
                    Animated.timing(starFlicker, { toValue: 1, duration: 300, useNativeDriver: true }),
                ])
            );
            flicker.start();
            return () => flicker.stop();
        } else {
            starFlicker.setValue(1);
        }
    }, [isComplete, starTapped]);

    return (

        <ImageBackground
            source={images.HomeLayout}
            imageStyle={{ resizeMode: 'cover' }}
            style={styles.container}
        >
            <Pressable onPress={() => { playButtonSound(); }}>
                <TouchableOpacity hitSlop={30} onPress={() => { navigation.replace('PetMenu') }}>
                    <Text style={styles.name}>Hello {petname}</Text>
                    <Text style={styles.welcome}>is happy</Text>
                </TouchableOpacity>
            </Pressable>
            <SpriteLoader spriteImage={spriteImage} />
            
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
            <ScalePressable
                onPress={() => { playButtonSound(); if (isComplete && !starTapped) setStarTapped(true); }}
                pressableStyle={styles.starcontainer}
            >
                <Animated.View style={{ opacity: isComplete && !starTapped ? starFlicker : 1, width: '100%', height: '100%' }}>
                    <ImageBackground
                        source={images.star}
                        style={styles.star}
                        imageStyle={{ resizeMode: 'contain' }}
                    >
                        <SvgXml
                            xml={starTapped ? starchecked : isComplete ? cakefilled : cake}
                            style={styles.cakecontainer}
                            height={50} width={40}
                        />
                    </ImageBackground>
                </Animated.View>
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