import React from "react";
import { Animated, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
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
import UpgradePetModal from "../../../components/UpgradePetModal/upgradepetmodal";

export default function HomeScreen() {
    const {
        navigation, petname, petsteps, step,
        spriteImage, isComplete, starTapped, setStarTapped,
        cloudX, cloudY, starFlicker,
    } = useHomeScreen();

    return (
        <ImageBackground source={images.HomeLayout} imageStyle={{ resizeMode: 'cover' }} style={styles.container}>

            <TouchableOpacity hitSlop={30} onPress={() => { playButtonSound(); navigation.replace('PetMenu'); }}>
                <Text style={styles.name}>Hello {petname}</Text>
                <Text style={styles.welcome}>is happy</Text>
            </TouchableOpacity>

            <SpriteLoader spriteImage={spriteImage} />

            <RetroStepsBar
                top={scale(92)} right={scale(100)} left={scale(100)} bottom={scale(100)}
                width={scale(280)} height={scale(40)} borderRadius={scale(20)}
                steps={step} goal={petsteps}
            />

            <View style={styles.collectioncontainer}>
                <TouchableOpacity onPress={() => { playButtonSound(); navigation.navigate('Collecition'); }}>
                    <Image source={images.collection} style={{ width: scale(45), height: scale(45) }} />
                </TouchableOpacity>
                <SvgXml height={scale(45)} width={scale(45)} xml={newfeature} />
            </View>

            <ScalePressable
                pressableStyle={styles.starcontainer}
                onPress={() => { playButtonSound(); if (isComplete && !starTapped) setStarTapped(true); }}
            >
                <Animated.View style={{ opacity: isComplete && !starTapped ? starFlicker : 1, width: '100%', height: '100%' }}>
                    <ImageBackground source={images.star} style={styles.star} imageStyle={{ resizeMode: 'contain' }}>
                        <SvgXml
                            xml={starTapped ? starchecked : isComplete ? cakefilled : cake}
                            style={styles.cakecontainer}
                            height={50} width={40}
                        />
                    </ImageBackground>
                </Animated.View>
            </ScalePressable>

            <ImageBackground source={images.windowBottom} imageStyle={styles.winowframe} style={styles.windowContainer}>
                <Animated.Image
                    source={images.Cloud}
                    resizeMode="contain"
                    style={[styles.cloudImage, { transform: [{ translateX: cloudX }, { translateY: cloudY }] }]}
                />
            </ImageBackground>

            <SvgXml style={styles.windowFrameImage} height={scale(100)} width={scale(120)} xml={windowframe} />
            {/* <UpgradePetModal
                title={"Great job!"}
                bottomtext={" You've taken good care of your Pet today, and it's happy."}
                cup={images.StarEye}
                backImg={images.TrophyBack}
                isVisible={true}
                showPet={false}
                btn={false}
                containerStyle={styles.upgradeModalContainer}
                subtitleShow={false}
                keepGoing={true}
                imageStyle={styles.imageStyle}
                titleStyle={styles.titleStyle}
            /> */}
        </ImageBackground>
    );
}
