import React, { useEffect, useState } from "react";
import { styles } from "./Styles";
import { ImageBackground, Linking, Platform, Text, View } from "react-native";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import { DeleteButtonSvg, PrivacyPolicyBtnSvg, RestorePurchaceBtnSvg, SignInWithAppleBtnSvg, SignInWithGoogleBtnSvg, switchOff, switchOn } from "../../../assets/svgs";
import PressableIcon from "../../../components/PressSvg/PressSvg";
import { moderateScale } from "react-native-size-matters";
import { DeleteMessageModal } from "../../../components/Modal";
import { PRIVACY_URL } from "../../../utils/extra/links";
import { playButtonSound, startAppSound, stopBackgroundSound } from "../../../utils/SoundManager/SoundManager";
import { useDispatch, useSelector } from "react-redux";
import { setMusicSound, setSound } from "../../../redux/slices/soundSlice";
import { useNavigation } from '@react-navigation/native';
import { setSignedIn } from '../../../redux/slices/authSlice';
export default () => {

    const { MusicSound, Sound } = useSelector(state => state.soundReducer);
    const [MusicIsOn, setMusicIsOn] = useState(MusicSound);
    const [SoundIsOn, setSoundIsOn] = useState(Sound);
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
        setIsDeleteModalVisible(false)
        setIsProgressModal(true)
        // mark user as signed out so App navigation shows UnAuthStack
        dispatch(setSignedIn(false));
        // try to reset root navigator to landing (if available)
        try {
            const parent = navigation.getParent();
            if (parent && typeof parent.reset === 'function') {
                parent.reset({ index: 0, routes: [{ name: 'Landing' }] });
            } else if (typeof navigation.reset === 'function') {
                navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
            }
        } catch (e) {
            // silent catch - navigation reset is best-effort
        }
    }
    return (
        <View style={[combineStyles.combineStyles]}>
            <ImageBackground source={images.yellowBackground} style={styles.backgroundImage}>
                <View style={styles.main}>
                    <Text style={{ ...combineStyles.regular26, textAlign: "center" }}>Settings</Text>
                    <View style={[combineStyles.rowSpacebetween, { left: moderateScale(10) }]}>
                        <Text style={styles.textStyle}>Music</Text>
                        <PressableIcon
                            icon={MusicSound ? switchOn : switchOff} 
                            width={100}
                            height={50}
                            onPress={() => {
                                handleButtonPress(); 
                                dispatch(setMusicSound(!MusicSound)); 
                            }}
                        />
                    </View>

                    <View style={[combineStyles.rowSpacebetween, { left: moderateScale(10) }]}>
                        <Text style={{ ...combineStyles.regular18, top: moderateScale(8) }}>Sound</Text>
                        <PressableIcon
                            icon={Sound ? switchOn : switchOff} 
                            width={100}
                            height={50}
                            onPress={() => {
                                    handleButtonPress(); 
                                dispatch(setSound(!Sound)); 
                            }}
                        />
                    </View>


                    <View style={styles.buttonContainer}>
                        {
                            Platform.OS === "ios" ?
                                <PressableIcon icon={SignInWithAppleBtnSvg} width={"100%"} height={60} onPress={() => { playButtonSound() }} />
                                :
                                <PressableIcon icon={SignInWithGoogleBtnSvg} width={"100%"} height={60} onPress={() => { playButtonSound() }} />

                        }
                        <PressableIcon onPress={() => { Linking.openURL(PRIVACY_URL) }} icon={PrivacyPolicyBtnSvg} width={"100%"} height={60} />
                        <PressableIcon icon={RestorePurchaceBtnSvg} width={"100%"} height={60} />
                        <PressableIcon icon={DeleteButtonSvg} width={"100%"} height={60} onPress={() => setIsDeleteModalVisible(true)} />
                    </View>
                </View>
                <DeleteMessageModal isVisible={isDeleteModalVisible} onClose={() => setIsDeleteModalVisible(false)} subtitle={"Are you sure you want to delete your account?"} btn1text={"No"} btn2text={"Yes"} onpressButton2={handelModal} />
                <DeleteMessageModal  isVisible={DisconnectModal} onClose={() => setIsDisConnectModal(false)} subtitle={"Disconnecting unlinks the game progress on other devices.Are you sure you want to continue?"} btn1text={"Cancel"} btn2text={"Disconnect"} onpressButton2={() => setIsDisConnectModal(false)} title={"Disconnect?"} />
                <DeleteMessageModal isVisible={ProgressModal} onpressCenterButton={() => { setIsProgressModal(false); setIsDisConnectModal(true) }} subtitle={"Account deletion in progress?"} centerButtonTxt={"Ok"} centerButton={true} rowBtton={false} />
            </ImageBackground>
        </View>
    )
}