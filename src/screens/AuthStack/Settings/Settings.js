import React, { useEffect, useState } from "react";
import { styles } from "./Styles";
import { ImageBackground, Linking, Platform, Text, View, ScrollView, Pressable } from "react-native";
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
import { useNavigation } from '@react-navigation/native';
import { setSignedIn } from '../../../redux/slices/authSlice';
import { updatePet } from '../../../redux/slices/petslice';
import AnimatedSwitch from "../../../components/Switch/Switch";
import { DeathGhostSprite } from "../../../components/PetSprites/DeathGhost";

const MS_PER_DAY = 86400000;

export default () => {
    const { MusicSound, Sound } = useSelector(state => state.soundReducer);
    const { missedDays, petcreatedat } = useSelector(state => state.petReducer);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [DisconnectModal, setIsDisConnectModal] = useState(false);
    const [ProgressModal, setIsProgressModal] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();


    useEffect(() => {
        if (MusicSound) {
            startAppSound(); // starts looping music
        } else {
            stopBackgroundSound(); // stops music
        }
    }, [MusicSound]);

    // Play button sound only if Sound is true
    const handleButtonPress = () => {
        if (Sound) {
            playButtonSound();
        }
    };


    const handelModal = () => {
        setIsDeleteModalVisible(false);
        setIsProgressModal(true);
        dispatch(setSignedIn(false));
        try {
            const parent = navigation.getParent();
            if (parent && typeof parent.reset === 'function') {
                parent.reset({ index: 0, routes: [{ name: 'Landing' }] });
            } else if (typeof navigation.reset === 'function') {
                navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
            }
        } catch (e) { /* best-effort */ }
    };

    const setHealth = (days) => {
        handleButtonPress();
        dispatch(updatePet({ missedDays: days, petisdead: days >= 3 }));
    };
    const setAge = (daysAgo) => {
        handleButtonPress();
        const created = Date.now() - daysAgo * MS_PER_DAY;
        dispatch(updatePet({ petcreatedat: created }));
    };
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
                        <Text style={styles.devHint}>Health {missedDays} · Age {petcreatedat ? Math.min(Math.floor((Date.now() - petcreatedat) / MS_PER_DAY), 21) : '-'}d</Text>
                    </View>

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
                <DeleteMessageModal isVisible={isDeleteModalVisible} onClose={() => setIsDeleteModalVisible(false)} subtitle={"Are you sure you want to delete your account?"} btn1text={"No"} btn2text={"Yes"} onpressButton2={handelModal} modalStyle={styles.modalStyle} />
                <DeleteMessageModal isVisible={DisconnectModal} onClose={() => setIsDisConnectModal(false)} subtitle={"Disconnecting unlinks the game progress on other devices.Are you sure you want to continue?"} btn1text={"Cancel"} btn2text={"Disconnect"} onpressButton2={() => setIsDisConnectModal(false)} title={"Disconnect?"} swap={true} />
                <DeleteMessageModal isVisible={ProgressModal} onpressCenterButton={() => { setIsProgressModal(false); setIsDisConnectModal(true) }} subtitle={"Account deletion in progress?"} centerButtonTxt={"Ok"} centerButton={true} rowBtton={false} modalStyle={styles.modalStyle} />
            </ImageBackground>
        </View>
    )
}