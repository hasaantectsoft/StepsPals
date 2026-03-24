import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Keyboard, Image } from 'react-native';
import { scale } from 'react-native-size-matters';
import InternetModal from '../InternetModal/InternetModal';
import NetInfo from '@react-native-community/netinfo';
import { DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useKeyboard from "../../utils/extra/usekeyboard"
import {  playbottomtabsound, playButtonSound } from '../../utils/SoundManager/SoundManager';
import ScalePressable from '../ScalePressable/ScalePressable';


const BottomTabs = ({ activeTab, onTabPress }) => {
    
    const [isConnectedModal, setIsConnectedModal] = useState(false);
    const [hideModal, setHideModal] = useState(false);
    const isKeyboardVisible = useKeyboard();
   
    const tabIcons = [
        { name: 'Home', icon: require('../../assets/images/home.png') ,inactiveIcon: require('../../assets/images/homeinactive.png') },
        { name: 'Statistics', icon: require('../../assets/images/stats.png') ,inactiveIcon: require('../../assets/images/stats_inactive.png') },

        { name: 'GraveYard', icon: require('../../assets/images/graveyard.png') ,inactiveIcon: require('../../assets/images/graveyard_inactive.png') },
        { name: 'LeaderBoard', icon: require('../../assets/images/tropy.png') ,inactiveIcon: require('../../assets/images/inactive_trophy.png') },
        { name: 'Settings', icon: require('../../assets/images/settings.png') ,inactiveIcon: require('../../assets/images/settings_inactive.png') },

    ];
    const checkConnection = () => {
        return NetInfo.fetch().then(state => {
            const connected = !!(state.isConnected || state.isInternetReachable);
            setIsConnectedModal(!connected);
            return connected;
        }).catch(() => false);
    };

    useEffect(() => {
        let unsubscribe;
        try {
            unsubscribe = NetInfo.addEventListener(state => {
                const connected = !!(state.isConnected || state.isInternetReachable);
                setIsConnectedModal(!connected);
            });
        } catch (error) {}
        checkConnection();
        return () => {
            if (unsubscribe) unsubscribe();
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
                        {isConnectedModal && !hideModal && (
                            <InternetModal
                              isVisible={isConnectedModal}
                              onRetry={checkConnection}
                            />
                        )}

                        {tabIcons.map(tab => (
                            <ScalePressable
                                key={tab.name}
                                style={[
                                    styles.tabItem,

                                ]}
                                onPress={() => {playbottomtabsound();onTabPress(tab.name);}}
                            >
                                <Image
                                    source={activeTab === tab.name ? tab.inactiveIcon : tab.icon}
                                    style={[styles.tabIcon, { opacity: activeTab === tab.name ? 1 : 1 }]}
                                    resizeMode="contain"
                                />


                            </ScalePressable>
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
        paddingTop: scale(20),
        height: scale(100),
        // paddingBottom:scale(30)
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: (39),
        
    },
    tabIcon: {
        width: scale(62),
        height: scale(62),
        resizeMode: 'contain',
    },
    tabText: {
        fontSize: scale(10),
        // fontFamily: typography.body.fontFamily,
    },
});

export default BottomTabs;