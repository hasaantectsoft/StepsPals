import {
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useRoute } from "@react-navigation/native";
import { checkNotifications } from "react-native-permissions";
import { styles } from "./styles";
import { Header, NextButton } from "../../../components";
import { useNavigation } from "@react-navigation/native";
import { setSignedIn } from "../../../redux/slices/authSlice";
import { permissionUtils } from "../../../utils";
import { scale } from "react-native-size-matters";
import { setPetName, setPetKey, setPetSteps } from "../../../redux/slices/petslice";
import { PRIVACY_URL, TERMS_URL } from "../../../utils/extra/links";
import { setIsMain } from "../../../redux/slices/ismain";
import { setNewUser } from "../../../redux/slices/tutorialslice";
import { images } from "../../../assets/images";
export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { pet, petName, stepGoal } = useRoute().params || {};
  const [notifGranted, setNotifGranted] = useState(false);
  const [healthGranted, setHealthGranted] = useState(false);
  const refreshNotif = useCallback(() => {
    checkNotifications().then(({ status }) =>
      setNotifGranted(status === "granted")
    );
  }, []);

  useEffect(() => {
    refreshNotif();
  }, [refreshNotif]);

  const onRequestNotification = async () => {
    const granted = await permissionUtils.requestNotificationPermission();
    setNotifGranted(granted);
    console.log(notifGranted)

  };

  const onRequestHealth = async () => {
    const granted = await permissionUtils.requestHealthPermission();
    setHealthGranted(granted);
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
        <TouchableOpacity onPress={onRequestHealth} disabled={healthGranted}>
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
