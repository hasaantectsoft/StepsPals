import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected && state.isInternetReachable);
            setIsLoading(false);
        });

        const checkConnection = async () => {
            const state = await NetInfo.fetch();
            setIsConnected(state.isConnected && state.isInternetReachable);
            setIsLoading(false);
        };

        checkConnection();

        return () => unsubscribe();
    }, []);

    return { isConnected, isLoading };
};
