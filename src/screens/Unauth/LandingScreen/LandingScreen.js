import { ImageBackground, View } from "react-native";
import { useState, useEffect } from "react";
import { Styles } from "./styles";
import { SvgXml } from "react-native-svg";
import { logo } from "../../../assets/svgs";
import { useNetworkStatus } from "../../../utils/hooks/useNetworkStatus";
import NetInfo from "@react-native-community/netinfo";
import {  RetryingState, ConnectedState, NoInternetState } from "../../../components/LandingPageComponents";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { images } from "../../../assets/images";

export default function LandingScreen({  }) {
    const [isRetrying, setIsRetrying] = useState(false);
    const [retryFailed, setRetryFailed] = useState(false);
    const stack=useSelector(state=>state.authReducer?.isSignedIn);
    const isNewUser = useSelector(state => state.tutorialReducer?.isnewuser);
    const { isConnected } = useNetworkStatus();
    const navigation = useNavigation();

    useEffect(() => {
        if (isConnected) {
            setRetryFailed(false);
        }
    }, [isConnected]);

    useEffect(() => {
        if (typeof isNewUser !== 'undefined' && isNewUser === false) {
            if (stack) {
                navigation.replace('Main', { screen: 'Home' });
            } 
        }
    }, [isNewUser, stack, navigation]);

    const handleRetry = async () => {
        setIsRetrying(true);
        setRetryFailed(false);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const state = await NetInfo.fetch();
            const connected = state.isConnected && state.isInternetReachable;

            if (!connected) {
                setRetryFailed(true);
            }
        } finally {
            setIsRetrying(false);
        }
    };

    const handleStart = () => {
        console.log("Starting app...",stack);
        if(stack){
            navigation.replace('Main', { screen: 'Home' });
            return;
        }
        else{
            navigation.replace('PetSelection');
        }
    };

    

    return (
        <View style={Styles.container}>
            <ImageBackground
                source={images.required}
                style={Styles.imgbg}
                resizeMode="cover"
            >
                <SvgXml xml={logo} height={300} width={300} />
                {isRetrying ? (
                    <RetryingState />
                ) : isConnected ? (
                    <ConnectedState onStart={handleStart} />
                ) : (
                    <NoInternetState onRetry={handleRetry}  />
                )}
            </ImageBackground>
        </View>
    );
}