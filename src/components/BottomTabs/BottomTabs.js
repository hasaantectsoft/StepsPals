import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Keyboard, Image } from 'react-native';
import { scale } from 'react-native-size-matters';
// import InternetModal from '../InternetModal/InternetModal';
import NetInfo from '@react-native-community/netinfo';
import { DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useKeyboard from "../../utils/extra/usekeyboard"
import { playBackgroundSound, playButtonSound } from '../../utils/SoundManager/SoundManager';


const BottomTabs = ({ activeTab, onTabPress }) => {
    
    const [isConnectedModal, setIsConnectedModal] = useState(false);
    const [hideModal, setHideModal] = useState(false);
    const isKeyboardVisible = useKeyboard();
   
    const tabIcons = [
        { name: 'Home', icon: require('../../assets/images/home.png') },
        { name: 'Statistics', icon: require('../../assets/images/stats.png') },

        { name: 'GraveYard', icon: require('../../assets/images/graveyard.png') },
        { name: 'LeaderBoard', icon: require('../../assets/images/tropy.png') },
        { name: 'Settings', icon: require('../../assets/images/settings.png') },

    ];
    useEffect(() => {
        const checkConnection = () => {
            NetInfo.fetch().then(state => {
                const connected = !!(state.isConnected || state.isInternetReachable);
                setIsConnectedModal(!connected);
            }).catch(error => {
            });
        };
        let unsubscribe;
        try {
            unsubscribe = NetInfo.addEventListener(state => {
                const connected = !!(state.isConnected || state.isInternetReachable);
                setIsConnectedModal(!connected);
            });
        } catch (error) {
        }
        checkConnection();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    useEffect(() => {
        const sub = DeviceEventEmitter.addListener('HideInternetModal', (val) => {
            setHideModal(!!val);
        });
        return () => {
            try { sub.remove(); } catch { }
        };
    }, []);

    return (
        <SafeAreaView edges={['bottom']} style={styles.safeArea} pointerEvents="box-none">
            {
                isKeyboardVisible ? null :


                    <View style={styles.container}>
                        {/* {isConnectedModal && !hideModal && (
                            <InternetModal
                                isVisible={isConnectedModal}
                                handleRetry={() => checkInternet()}
                                title={'No Internet Connection'}
                                description={
                                    "Oops! We can't load the content until the internet connection is restored."
                                }
                                shortDescription={'Please check your connection.'}
                                btnTxt={'Retry'}
                                btntext2={'View draft'}
                            />
                        )} */}

                        {tabIcons.map(tab => (
                            <TouchableOpacity
                                key={tab.name}
                                style={[
                                    styles.tabItem,

                                ]}
                                onPress={() => {onTabPress(tab.name);playButtonSound()}}
                            >
                                <Image
                                    source={tab.icon}
                                    style={[styles.tabIcon, { opacity: activeTab === tab.name ? 1 : 0.6 }]}
                                    resizeMode="contain"
                                />


                            </TouchableOpacity>
                        ))}
                    </View>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        zIndex: 99999,
        elevation: 99999,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        shadowRadius: 5,
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingTop: scale(2),
        height: scale(70),
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: (39)
    },
    tabIcon: {
        width: scale(50),
        height: scale(50),
        resizeMode: 'contain',
    },
    tabText: {
        fontSize: scale(10),
        // fontFamily: typography.body.fontFamily,
    },
});

export default BottomTabs;