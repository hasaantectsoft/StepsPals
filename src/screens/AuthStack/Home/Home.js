import React, { useCallback, useEffect, useRef, useState } from "react";
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
import MessageBox from "../../../components/MessageBox/MessageBox";
import useHomeScreen from "../../../utils/hooks/useHomeScreen";
import { careOffsets } from "../../../utils/extra/offsets";
import { careMap } from "../../../utils/extra/caremap";
import { careDurations } from "../../../utils/extra/delay";
import ActivePetSprite from "../../../components/PetSprites/ActivePetSprite";
import { getPetDeathGhostComponent } from "../../../components/PetSprites/petSpriteMap";
import { getCondition } from "../../../utils/petCondition";
import { useDispatch, useSelector } from "react-redux";
import { WELCOME_BY_HEALTH } from "../../../utils/exports";
import PetDieModal from "../../../components/PetDieModal/PetDieModal";
import UpgradePetModal from "../../../components/UpgradePetModal/upgradepetmodal";
import { Theme } from "../../../libs";
import { setHasShown21DayModal, setHasShown7DayModal } from "../../../redux/slices/petslice";
export default function HomeScreen() {
    const {
        navigation, petname, petsteps, step, isComplete, starTapped, setStarTapped,
        cloudX, cloudY, starFlicker,
    } = useHomeScreen();
    const dispatch = useDispatch();
    const { missedDays, petkey, petcreatedat, hasShown7DayModal, hasShown21DayModal } = useSelector((s) => s.petReducer);
    const isPetDead = missedDays >= 3;
    const welcomeText = WELCOME_BY_HEALTH[getCondition(missedDays ?? 0)] ?? "is happy";
    const [allCareChecked, setAllCareChecked] = useState(false);
    const [activeCareKey, setActiveCareKey] = useState(null);
    const [disabledMessage, setDisabledMessage] = useState("");
    const [messageFromStar, setMessageFromStar] = useState(false);
    const [showPetDieModal, setShowPetDieModal] = useState(false);
    const careTimeoutRef = useRef(null);
    const [upgradeModal, setUpgradeModal] = useState(null); // 'stage7' | 'stage21' | 'add' | null
    const messageTimeoutRef = useRef(null);
    const petDieModalTimeoutRef = useRef(null);

    const showDisabledMessage = useCallback((text, fromStar = false) => {
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        setDisabledMessage(text);
        setMessageFromStar(fromStar);
        messageTimeoutRef.current = setTimeout(() => { setDisabledMessage(""); setMessageFromStar(false); }, 3000);
    }, []);

    useEffect(() => () => { if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current); }, []);

    useEffect(() => {
        if (!isPetDead) {
            setShowPetDieModal(false);
            return;
        }
        petDieModalTimeoutRef.current = setTimeout(() => setShowPetDieModal(true), 2000);
        return () => { if (petDieModalTimeoutRef.current) clearTimeout(petDieModalTimeoutRef.current); };
    }, [isPetDead]);

    useEffect(() => {
        if (!petcreatedat || isPetDead) return;
        const days = Math.floor((Date.now() - petcreatedat) / 86400000);
        if (days >= 7 && days < 21 && !hasShown7DayModal) {
            dispatch(setHasShown7DayModal(true));
            setUpgradeModal('stage7');
        }
        if (days >= 21 && !hasShown21DayModal) {
            dispatch(setHasShown21DayModal(true));
            setUpgradeModal('stage21');
        }
    }, [dispatch, hasShown21DayModal, hasShown7DayModal, isPetDead, petcreatedat]);
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

    const DeathGhostSprite = getPetDeathGhostComponent(petkey);
    const canCheckStar = isComplete && allCareChecked && !starTapped;
    const getStarDisabledMessage = () => {
        if (starTapped) return "You already claimed your star reward!";
        if (!isComplete) return "Reach your step goal to unlock the star!";
        if (!allCareChecked) return "Complete all care actions (feed, water, clean) first!";
        return "";
    };
    return (
        <ImageBackground source={images.HomeLayout} imageStyle={{ resizeMode: 'cover' }} style={styles.container}>
            <Pressable
                style={styles.headerPressArea}
                hitSlop={40}
                onPress={() => { playButtonSound(); navigation.navigate('PetMenu'); }}>
                <Text style={styles.name}>Hello {petname}</Text>
                <Text style={styles.welcome}>{welcomeText}</Text>
                {isPetDead && <DeathGhostSprite spriteScale={3} offsetY={scale(18)} offsetX={scale(130)} />}

            </Pressable>
            <SpriteLoader>
                <ActivePetSprite spriteScale={3} />
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
                onDisabledCarePress={showDisabledMessage}
            />
            {disabledMessage && messageFromStar ? (
                <View style={styles.starMessageWrap}>
                    <MessageBox star text={disabledMessage} numberOfLines={3} />
                </View>
            ) : null}
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
                        if (!canCheckStar) {
                            showDisabledMessage(getStarDisabledMessage(), true);
                            return;
                        }
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
            <PetDieModal isVisible={showPetDieModal} onClose={() => setShowPetDieModal(false)} />
            
            {/* grown up modal */}
            <UpgradePetModal
                isVisible={upgradeModal === 'stage7'}
                showPet={true}
                btn={false}
                title={'Good job!'}
                subtitle={'Your pet has grown up!'}
                bottomtext={`You’ve taken care of \n${petname}\n for 7 days!`}
                okPressed={() => setUpgradeModal(null)}
            />
            {/* fully grown modal */}
            <UpgradePetModal
                isVisible={upgradeModal === 'stage21'}
                showPet={true}
                btn={false}
                title={'Congratulations!'}
                subtitle={`${petname} has fully grown!`}
                bottomtext={`Keep nurturing ${petname} to stay on track and maintain your streak!`}
                okPressed={() => setUpgradeModal('add')}
            />
            {/* add to collection modal (after 7/21 modal) */}
            <UpgradePetModal
                isVisible={upgradeModal === 'add'}
                show_continue_button={false}
                showPet={true}
                btn={true}
                onClose={() => setUpgradeModal(null)}
            />

            <SvgXml style={styles.windowFrameImage} height={scale(100)} width={scale(120)} xml={windowframe} />
     </ImageBackground>
    );
}

