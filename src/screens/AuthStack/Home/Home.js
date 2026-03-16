import React, { useRef, useState } from "react";
import { Animated, Image, ImageBackground, Pressable, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { scale } from "react-native-size-matters";
import { styles } from "./Styles";
import { images } from "../../../assets/images";
import { cake, cakefilled, newfeature, starchecked, windowframe } from "../../../assets/svgs";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";
import SpriteLoader from "../../../components/SprieLoader";
import RetroStepsBar from "../../../components/Retroprogreebar/Retrostepsbar";
import ScalePressable from "../../../components/ScalePressable/ScalePressable";
import useHomeScreen from "../../../utils/hooks/useHomeScreen";
import { CatBabySprite_main } from "../../../components/PetSprites/Pets/Cat";
import { careOffsets } from "../../../utils/extra/offsets";
import { careMap } from "../../../utils/extra/caremap";
import { careDurations } from "../../../utils/extra/delay";
import { DogTeenSprite_sick } from "../../../components/PetSprites/Pets/Dog/Teen";

export default function HomeScreen() {
    const {
        navigation, petname, petsteps, step, isComplete, starTapped, setStarTapped,
        cloudX, cloudY, starFlicker,
    } = useHomeScreen();
    const [allCareChecked, setAllCareChecked] = useState(false);
    const [activeCareKey, setActiveCareKey] = useState(null);
    const careTimeoutRef = useRef(null);
    const playCareOnce = (key) => {
        if (!key) return;
        setActiveCareKey(key);
        if (careTimeoutRef.current) {
            clearTimeout(careTimeoutRef.current);
        }
        const duration = careDurations[key];
        if (!duration) return;
        careTimeoutRef.current = setTimeout(() => {
            setActiveCareKey((k) => (k === key ? null : k));
        }, duration);
    };

    const ActiveCareSprite = activeCareKey ? careMap[activeCareKey] : null;
    const handleCareActionChange = (key) => {
        if (starTapped && activeCareKey === "treat") return;
        playCareOnce(key);
    };

    const canCheckStar = isComplete && allCareChecked && !starTapped;
    return (
        <ImageBackground source={images.HomeLayout} imageStyle={{ resizeMode: 'cover' }} style={styles.container}>
            <Pressable
                style={styles.headerPressArea}
                hitSlop={40}
                onPress={() => { playButtonSound(); navigation.navigate('PetMenu'); }}>
                <Text style={styles.name}>Hello {petname}</Text>
                <Text style={styles.welcome}>is happy</Text>
            </Pressable>
            <SpriteLoader>
                <DogTeenSprite_sick spriteScale={3} />
                {ActiveCareSprite && (
                    <ActiveCareSprite
                        spriteScale={3.5}
                        offsetY={careOffsets[activeCareKey] || 0}
                    />
                )}
            </SpriteLoader>
            <RetroStepsBar
                top={scale(92)} right={scale(100)} left={scale(100)} bottom={scale(100)}
                width={scale(280)} height={scale(40)} borderRadius={scale(20)}
                steps={step} goal={petsteps}
                onAllCareCheckedChange={setAllCareChecked}
                onCareActionChange={handleCareActionChange}
            />
            <View style={styles.collectioncontainer}>
                <ScalePressable onPress={() => { playButtonSound(); navigation.navigate('Collecition'); }}>
                    <Image source={images.collection} style={{ width: scale(45), height: scale(45) }} />
                </ScalePressable>
                <SvgXml height={scale(45)} width={scale(45)} xml={newfeature} />
            </View>

            <View style={[styles.starcontainer, { overflow: 'visible' }]}>
                <ScalePressable
                    onPress={() => {
                        playButtonSound();
                        if (!canCheckStar) return;
                        setStarTapped(true);
                        playCareOnce("treat");
                    }}
                >
                    <Animated.View style={{ opacity: !starTapped && canCheckStar ? starFlicker : 1, width: '100%', height: '100%' }}>
                        <ImageBackground source={images.star} style={styles.star} imageStyle={{ resizeMode: 'contain' }}>
                            <SvgXml
                                xml={starTapped ? starchecked : isComplete ? cakefilled : cake}
                                style={styles.cakecontainer}
                                height={50} width={40}
                            />
                        </ImageBackground>
                    </Animated.View>
                </ScalePressable>
            </View>
            <ImageBackground source={images.windowBottom} imageStyle={styles.winowframe} style={styles.windowContainer}>
                <Animated.Image
                    source={images.Cloud}
                    resizeMode="contain"
                    style={[styles.cloudImage, { transform: [{ translateX: cloudX }, { translateY: cloudY }] }]}
                />           
            </ImageBackground>
            <SvgXml style={styles.windowFrameImage} height={scale(100)} width={scale(120)} xml={windowframe} />

        </ImageBackground>
    );
}

