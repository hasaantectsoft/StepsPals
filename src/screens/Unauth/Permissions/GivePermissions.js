import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  AppState,
} from "react-native";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { checkNotifications, checkMultiple, PERMISSIONS } from "react-native-permissions";
import { styles } from "./styles";
import { Header, NextButton } from "../../../components";
import { useNavigation } from "@react-navigation/native";
import { setSignedIn } from "../../../redux/slices/authSlice";
import { permissionUtils } from "../../../utils";
import { scale } from "react-native-size-matters";
import { setPetName, setPetKey, setPetSteps, setPetCreatedAt } from "../../../redux/slices/petslice";
import { setProgressStep } from "../../../redux/slices/progressSlice";
import { PRIVACY_URL, TERMS_URL } from "../../../utils/extra/links";
import { setIsMain } from "../../../redux/slices/ismain";
import { setNewUser } from "../../../redux/slices/tutorialslice";
import { images } from "../../../assets/images";
import { fetchSteps } from "../../../utils/handler/fetchsteps";
export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  
  const { pet, petName, stepGoal } = useRoute().params || {};
  const [notifGranted, setNotifGranted] = useState(false);
  const [healthGranted, setHealthGranted] = useState(false);
  const [notifRejectionCount, setNotifRejectionCount] = useState(0);
  
  const refreshNotif = useCallback(() => {
    checkNotifications().then(({ status }) => {
      setNotifGranted(status === "granted");
    });
  }, []);

  const refreshHealthPermissions = useCallback(() => {
    if (Platform.OS === 'ios') {
      checkMultiple([PERMISSIONS.IOS.HEALTH]).then((statuses) => {
        setHealthGranted(statuses[PERMISSIONS.IOS.HEALTH] === 'granted');
      });
    }
  }, []);

  useEffect(() => {
    refreshNotif();
    refreshHealthPermissions();
  }, [refreshNotif, refreshHealthPermissions]);

  // Handle app state changes (when app returns from background/settings)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = useCallback((nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to foreground, refresh permissions with delay
      setTimeout(() => {
        refreshNotif();
        refreshHealthPermissions();
      }, 1000);
    }
    appState.current = nextAppState;
  }, [refreshNotif, refreshHealthPermissions]);

  // Refresh permissions when screen comes back into focus (after user goes to settings)
  useFocusEffect(
    useCallback(() => {
      // Add a delay to ensure system has updated permissions
      const timer = setTimeout(() => {
        refreshNotif();
        refreshHealthPermissions();
      }, 800);

      return () => clearTimeout(timer);
    }, [refreshNotif, refreshHealthPermissions])
  );

  const onRequestNotification = async () => {
    // If rejected 2 times already, open app settings
    if (notifRejectionCount >= 2) {
      Linking.openSettings();
      return;
    }

    const granted = await permissionUtils.requestNotificationPermission();
    if (granted) {
      setNotifGranted(granted);
      setNotifRejectionCount(0);
    } else {
      // User rejected, increment counter
      setNotifRejectionCount(prev => prev + 1);
    }
  };

  const onRequestHealth = async () => {
    const granted = await permissionUtils.requestHealthPermission();
    setHealthGranted(granted);
  };
  const onRequestHealthAndroid = async () => {
    const { granted, steps } = await fetchSteps();
    setHealthGranted(granted);
    if (granted && steps != null) dispatch(setProgressStep(steps));
  };

  return (
    <ImageBackground
      source={images.required}
      style={styles.wrapper}
      resizeMode="cover"
    >
      <View style={styles.headerContainer}>
        <Header
          title="We need some"
          subtitle="Permissions"
          onBackPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onRequestNotification} disabled={notifGranted}>
          <Image
            source={notifGranted ?images.permisionnotifif : images.healthkitpermsiom}
            height={scale(100)}
            resizeMode="contain"
            style={styles.permissionsImage}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={Platform.OS==='ios' ? onRequestHealth : onRequestHealthAndroid} disabled={healthGranted}>
          <Image
            source={healthGranted ? images.permissionenabled : images.healthkitpermsiomdis}
            height={scale(100)}
            resizeMode="contain"
            style={styles.permissionsImage}
          />
        </TouchableOpacity>
        <Text style={styles.explanationText}>
          StepPals requires Health access to function. Without step data, your
          Pet can't track progress and the core experience is unavailable.
        </Text>
        <Text style={styles.explanationText}>
          You can always manage permissions later in your device Settings.
        </Text>

        <View style={styles.buttonWrap}>
          <NextButton
            text={"NEXT"}
            onPress={() => {
                dispatch(setPetName(petName ?? ''));
                dispatch(setPetKey(String(pet?.id ?? '')));
                dispatch(setPetSteps(stepGoal ?? 242));
                dispatch(setPetCreatedAt(Date.now()));
                dispatch(setSignedIn(true));
                dispatch(setIsMain(true));
                dispatch(setNewUser(true));
                navigation.reset({ index: 0, routes: [{ name: "Main" }] });
              }}
            disabled={!notifGranted || !healthGranted ? true : false}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_URL)}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)}>
          <Text style={styles.footerLink}>Terms of Use</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
