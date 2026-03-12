import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import { setProgressStep } from "../../redux/slices/progressSlice";
import { updatePet } from "../../redux/slices/petslice";
import { fetchSteps } from "../handler/fetchsteps";
import { getCondition, getSpriteByCondition } from "../petCondition";
import { babyDogsprites, teenDogsprites, adultDogsprites } from "../../assets/Sprites/Pets/Dog";
import { babydinosprites, teendinosprites, adultdinosprites } from "../../assets/Sprites/Pets/Dino";
import { babycatsprites, teencatsprites, adultcatsprites } from "../../assets/Sprites/Pets/Cat";

const SPRITE_MAP = {
    '1': { baby: babyDogsprites,  teen: teenDogsprites,  adult: adultDogsprites  },
    '2': { baby: babycatsprites,  teen: teencatsprites,  adult: adultcatsprites  },
    '3': { baby: babydinosprites, teen: teendinosprites, adult: adultdinosprites },
};

const getStage = (days) => {
    if (days <= 7)  return 'baby';
    if (days <= 21) return 'teen';
    return 'adult';
};

export default function useHomeScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { petname, petsteps, petkey, petcreatedat, pendingpetsteps, pendingfrom, missedDays, lastCheckedDate } =
        useSelector((s) => s.petReducer);
    const { step } = useSelector((s) => s.progressReducer);
    const ageInDays = petcreatedat
        ? Math.min(Math.floor((Date.now() - petcreatedat) / 86400000), 21)
        : 0;
    const stage      = getStage(ageInDays);
    const condition  = getCondition(missedDays);
    const spriteSet  = SPRITE_MAP[petkey]?.[stage] ?? babydinosprites;
    const spriteImage = getSpriteByCondition(spriteSet, petkey, condition);
    const [starTapped, setStarTapped] = useState(false);
    const isComplete = step >= petsteps && petsteps > 0;
    const cloudX     = useRef(new Animated.Value(-scale(65))).current;
    const cloudFloat = useRef(new Animated.Value(0)).current;
    const cloudY = cloudFloat.interpolate({ inputRange: [0, 1], outputRange: [-scale(4), scale(4)] });
    const starFlicker = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (Platform.OS === 'android') {
            fetchSteps().then(({ granted, steps }) => {
                if (granted && steps != null) dispatch(setProgressStep(steps));
            });
        }
    }, [dispatch]);
    useEffect(() => {
        if (pendingpetsteps !== null && pendingfrom !== null && Date.now() >= pendingfrom) {
            dispatch(updatePet({ petsteps: pendingpetsteps, pendingpetsteps: null, pendingfrom: null }));
        }
    }, [pendingpetsteps, pendingfrom]);
    useEffect(() => {
        if (!petcreatedat) return;
        const today = new Date().toISOString().split('T')[0];
        if (lastCheckedDate === today) return;
        const newMissedDays = step >= petsteps && petsteps > 0 ? 0 : missedDays + 1;
        dispatch(updatePet({ missedDays: newMissedDays, lastCheckedDate: today, petisdead: newMissedDays >= 3 }));
    }, [petcreatedat]);
    useEffect(() => {
        const anim = Animated.loop(Animated.sequence([
            Animated.timing(cloudX, { toValue: scale(117), duration: 3000, easing: Easing.linear, useNativeDriver: true }),
            Animated.timing(cloudX, { toValue: -scale(65), duration: 0, useNativeDriver: true }),
        ]));
        const floatAnim = Animated.loop(Animated.sequence([
            Animated.timing(cloudFloat, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(cloudFloat, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]));
        anim.start(); floatAnim.start();
        return () => { anim.stop(); floatAnim.stop(); };
    }, [cloudX, cloudFloat]);
    useEffect(() => {
        if (isComplete && !starTapped) {
            const flicker = Animated.loop(Animated.sequence([
                Animated.timing(starFlicker, { toValue: 0.15, duration: 300, useNativeDriver: true }),
                Animated.timing(starFlicker, { toValue: 1,    duration: 300, useNativeDriver: true }),
            ]));
            flicker.start();
            return () => flicker.stop();
        } else {
            starFlicker.setValue(1);
        }
    }, [isComplete, starTapped]);

    return {
        navigation, petname, petsteps, step,
        spriteImage, isComplete, starTapped, setStarTapped,
        cloudX, cloudY, starFlicker,
    };
}
