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
// need to add corrcet url here
const PRIVACY_URL = "https://steppals.com/privacy";
const TERMS_URL = "https://steppals.com/terms";

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
  //   console.log(notifGranted)

  return (
    <ImageBackground
      source={require("../../../assets/images/required.png")}
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
            source={notifGranted ? require("../../../assets/images/permisionnotifif.png") : require("../../../assets/images/healthkitpermsiom.png")}
            height={scale(100)}
            resizeMode="contain"
            style={styles.permissionsImage}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRequestHealth} disabled={healthGranted}>
          <Image
            source={healthGranted ? require("../../../assets/images/permissionenabled.png") : require("../../../assets/images/healthkitpermsiomdis.png")}
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
            text="NEXT"
            onPress={() => {
                dispatch(setPetName(petName ?? ''));
                dispatch(setPetKey(String(pet?.id ?? '')));
                dispatch(setPetSteps(stepGoal ?? 242));
                dispatch(setSignedIn(true));
                navigation.reset({ index: 0, routes: [{ name: "Main" }] });
              }}
            disabled={false}
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
