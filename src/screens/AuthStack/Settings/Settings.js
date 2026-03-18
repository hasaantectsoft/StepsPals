import React, { useEffect, useState } from "react";
import { styles } from "./Styles";
import { ImageBackground, Linking, Platform, Text, View, ScrollView, Pressable, BackHandler, TouchableOpacity } from "react-native";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import { DeleteButtonSvg, PrivacyPolicyBtnSvg, RestorePurchaceBtnSvg, SignInWithAppleBtnSvg, SignInWithGoogleBtnSvg, SupportSvg } from "../../../assets/svgs";
import PressableIcon from "../../../components/PressSvg/PressSvg";
import { moderateScale } from "react-native-size-matters";
import { DeleteMessageModal } from "../../../components/Modal";
import { PRIVACY_URL } from "../../../utils/extra/links";
import { playButtonSound, startAppSound, stopBackgroundSound } from "../../../utils/SoundManager/SoundManager";
import { useDispatch, useSelector } from "react-redux";
import { setMusicSound, setSound } from "../../../redux/slices/soundSlice";
import { updatePet } from "../../../redux/slices/petslice";
import { resetApp } from "../../../redux/resetApp";
import AnimatedSwitch from "../../../components/Switch/Switch";
import { useNavigation } from "@react-navigation/native";
import { addPetToCollection } from "../../../redux/slices/petCollectionSlice";
import { LegendRankingModal, PlatinumRankingModal, GoldRankingModal, SilverRankingModal, BronzeRankingModal, UnrankedRankingModal } from "../../../components/RankingModals";
import Misseddaysmodal from "../../../components/Misseddaysmodal/missiedonedaymodal";
import Missed2daysmodal from "../../../components/Misseddaysmodal/missed2daysmodal";
import UpgradePetModal from "../../../components/UpgradePetModal/upgradepetmodal";
const MS_PER_DAY = 86400000;
export default () => {
    const { MusicSound, Sound } = useSelector(state => state.soundReducer);
    const { missedDays, petcreatedat, petname, petkey } = useSelector(state => state.petReducer);
    const collectionCount = useSelector((s) => s.petCollectionReducer?.pets?.length ?? 0);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [DisconnectModal, setIsDisConnectModal] = useState(false);
    const [ProgressModal, setIsProgressModal] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (MusicSound) {
            startAppSound();
        } else {
            stopBackgroundSound();
        }
    }, [MusicSound]);

    const handleButtonPress = () => {
        if (Sound) {
            playButtonSound();
        }
    };


    const handelModal = async () => {
        setIsDeleteModalVisible(false);
        setIsProgressModal(true);
        await resetApp(dispatch, { petname, petkey, petcreatedat });
        if (Platform.OS === 'android') {
            setTimeout(() => BackHandler.exitApp(), 250);
        }
    };
    const navigation = useNavigation();
    const setHealth = (days) => {
        handleButtonPress();
        dispatch(updatePet({ missedDays: days, petisdead: days >= 3 }));
    };
    const setAge = (daysAgo) => {
        handleButtonPress();
        const created = Date.now() - daysAgo * MS_PER_DAY;
        dispatch(updatePet({ petcreatedat: created }));
    };

    const addTestPetToCollection = () => {
        handleButtonPress();
        const testId = `test-${Date.now()}`;
        const nextKey = String(((Number(petkey) || 1) % 3) + 1);
        dispatch(addPetToCollection({
            id: testId,
            name: `Test Pet ${collectionCount + 1}`,
            petkey: nextKey,
            createdAt: Date.now(),
            stage: "adult",
        }));
    };
    const [isLegendRankingModalVisible, setIsLegendRankingModalVisible] = useState(false);
    const [isPlatinumRankingModalVisible, setIsPlatinumRankingModalVisible] = useState(false);
    const [isGoldRankingModalVisible, setIsGoldRankingModalVisible] = useState(false);
    const [isSilverRankingModalVisible, setIsSilverRankingModalVisible] = useState(false);
    const [isBronzeRankingModalVisible, setIsBronzeRankingModalVisible] = useState(false);
    const [isUnrankedRankingModalVisible, setIsUnrankedRankingModalVisible] = useState(false);
    const [isMissedDaysModalVisible, setIsMissedDaysModalVisible] = useState(false);
    const [isMissed2DaysModalVisible, setIsMissed2DaysModalVisible] = useState(false);
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
    return (
        <View style={[combineStyles.combineStyles]}>
            <ImageBackground source={images.yellowBackground} style={styles.backgroundImage}>
                <Text style={styles.title}>Settings</Text>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.main}>

                        <View style={[combineStyles.rowSpacebetween, { left: moderateScale(10) }]}>
                            <Text style={styles.textStyle}>Music</Text>

                            <AnimatedSwitch
                                key="music-switch"
                                value={MusicSound}
                                images={images}
                                onValueChange={(newVal) => {
                                    dispatch(setMusicSound(newVal));
                                }}
                            />
                        </View>

                        <View style={[combineStyles.rowSpacebetween, { left: moderateScale(10) }]}>
                            <Text style={{ ...combineStyles.regular18, top: moderateScale(8) }}>Sounds</Text>
                            <AnimatedSwitch
                                key="sound-switch"
                                value={Sound}
                                images={images}
                                onValueChange={(newVal) => dispatch(setSound(newVal))}
                            />
                        </View>

                        <View style={styles.devSection}>
                            <Text style={styles.devLabel}>Pet test (conditions / age)</Text>
                            <View style={styles.devRow}>
                                <Text style={styles.devSub}>Health: </Text>
                                {[0, 1, 2, 3].map((d) => (
                                    <Pressable key={d} onPress={() => setHealth(d)} style={styles.devBtn}>
                                        <Text style={styles.devBtnText}>{d === 0 ? 'Ok' : d === 1 ? 'Sick' : d === 2 ? 'VS' : 'Dead'}</Text>
                                    </Pressable>
                                ))}
                            </View>
                            <View style={styles.devRow}>
                                <Text style={styles.devSub}>Age: </Text>
                                <Pressable onPress={() => setAge(0)} style={styles.devBtn}><Text style={styles.devBtnText}>Baby</Text></Pressable>
                                <Pressable onPress={() => setAge(8)} style={styles.devBtn}><Text style={styles.devBtnText}>Teen</Text></Pressable>
                                <Pressable onPress={() => setAge(22)} style={styles.devBtn}><Text style={styles.devBtnText}>Adult</Text></Pressable>
                            </View>
                            <View style={styles.devRow}>
                                <Text style={styles.devSub}>Coll:</Text>
                                <Text style={styles.devHint}>{collectionCount} pets</Text>
                                <Pressable onPress={addTestPetToCollection} style={styles.devBtn}>
                                    <Text style={styles.devBtnText}>+1 Pet</Text>
                                </Pressable>
                            </View>
                            <Text style={styles.devHint}>Health {missedDays} · Age {petcreatedat ? Math.min(Math.floor((Date.now() - petcreatedat) / MS_PER_DAY), 21) : '-'}d</Text>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('SubscriptionScreen')}>
                            <Text>Subscription Screen Testing</Text>
                           
                        </TouchableOpacity>
                        <Pressable onPress={() => setIsLegendRankingModalVisible(true)}><Text>Legend Ranking Modal</Text></Pressable>
                            <Pressable onPress={() => setIsMissed2DaysModalVisible(true)}><Text>Missed 2 Days Modal</Text></Pressable>
                            <Pressable onPress={() => setIsPlatinumRankingModalVisible(true)}><Text>Platinum Ranking Modal</Text></Pressable>
                            <Pressable onPress={() => setIsGoldRankingModalVisible(true)}><Text>Gold Ranking Modal</Text></Pressable>
                            <Pressable onPress={() => setIsSilverRankingModalVisible(true)}><Text>Silver Ranking Modal</Text></Pressable>
                            <Pressable onPress={() => setIsBronzeRankingModalVisible(true)}><Text>Bronze Ranking Modal</Text></Pressable>
                            <Pressable onPress={() => setIsUnrankedRankingModalVisible(true)}><Text>Unranked Ranking Modal</Text></Pressable>
                            <Pressable onPress={() => setIsMissedDaysModalVisible(true)}><Text>Missed Days Modal</Text></Pressable>
                            <Pressable onPress={() => setIsUpgradeModalVisible(true)}><Text>Upgrade Pet Modal</Text></Pressable>
                        <View style={styles.buttonContainer}>
                            {
                                Platform.OS === "ios" ?
                                    <PressableIcon icon={SignInWithAppleBtnSvg} width={"100%"} height={60} onPress={() => { playButtonSound() }} />
                                    :
                                    <PressableIcon icon={SignInWithGoogleBtnSvg} width={"100%"} height={60} onPress={() => { playButtonSound() }} />

                            }
                            <PressableIcon onPress={() => { Linking.openURL(PRIVACY_URL) }} icon={PrivacyPolicyBtnSvg} width={"100%"} height={60} />
                            <PressableIcon icon={SupportSvg} width={"100%"} height={60} />
                            <PressableIcon icon={RestorePurchaceBtnSvg} width={"100%"} height={60} />
                            <PressableIcon icon={DeleteButtonSvg} width={"100%"} height={60} onPress={() => setIsDeleteModalVisible(true)} />
                            <Text style={styles.version}>Ver. 0.025</Text>

                        </View>
                    </View>
                </ScrollView>
                <Missed2daysmodal petname={petname} isVisible={isMissed2DaysModalVisible} onClose={() => setIsMissed2DaysModalVisible(false)} />
                <Misseddaysmodal petname={petname} isVisible={isMissedDaysModalVisible} onClose={() => setIsMissedDaysModalVisible(false)} />
                <DeleteMessageModal isVisible={isDeleteModalVisible} onClose={() => setIsDeleteModalVisible(false)} subtitle={"Are you sure you want to delete your account?"} btn1text={"No"} btn2text={"Yes"} onpressButton2={handelModal} modalStyle={styles.modalStyle} />
                <DeleteMessageModal isVisible={DisconnectModal} onClose={() => setIsDisConnectModal(false)} subtitle={"Disconnecting unlinks the game progress on other devices.Are you sure you want to continue?"} btn1text={"Cancel"} btn2text={"Disconnect"} onpressButton2={() => setIsDisConnectModal(false)} title={"Disconnect?"} swap={true} />
                <DeleteMessageModal isVisible={ProgressModal} onpressCenterButton={() => { setIsProgressModal(false); setIsDisConnectModal(true) }} subtitle={"Account deletion in progress?"} centerButtonTxt={"Ok"} centerButton={true} rowBtton={false} modalStyle={styles.modalStyle} />
                <LegendRankingModal isVisible={isLegendRankingModalVisible} onClose={() => { setIsLegendRankingModalVisible(false) }} steps={182450} />
                <PlatinumRankingModal isVisible={isPlatinumRankingModalVisible} onClose={() => { setIsPlatinumRankingModalVisible(false) }} steps={182450} />
                <GoldRankingModal isVisible={isGoldRankingModalVisible} onClose={() => { setIsGoldRankingModalVisible(false) }} steps={182450} />
                <SilverRankingModal isVisible={isSilverRankingModalVisible} onClose={() => { setIsSilverRankingModalVisible(false) }} steps={182450} />
                <BronzeRankingModal isVisible={isBronzeRankingModalVisible} onClose={() => { setIsBronzeRankingModalVisible(false) }} steps={182450} />
                <UnrankedRankingModal isVisible={isUnrankedRankingModalVisible} onClose={() => { setIsUnrankedRankingModalVisible(false) }} steps={182450} />
                <UpgradePetModal isVisible={isUpgradeModalVisible} onClose={() => setIsUpgradeModalVisible(false)} />
            </ImageBackground>
        </View>
    )
}