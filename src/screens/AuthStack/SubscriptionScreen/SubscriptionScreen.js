import React, { useState } from "react";
import { styles } from "./style";
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, Linking } from "react-native";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import PressableIcon from "../../../components/PressSvg/PressSvg";
import { bestdeal, SubSucribtionAcitveSvg, SubSucribtionInacitveSvg } from "../../../assets/svgs";
import { DeleteMessageModal } from "../../../components/Modal";
import { FlatList } from "react-native-actions-sheet";
import { SubsucripitonArray } from "../../../utils/exports";
import { moderateScale } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import ScalePressable from "../../../components/ScalePressable/ScalePressable";
import { PRIVACY_URL, TERMS_URL } from "../../../utils/extra/links";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";
import WelcomModal from "../../../components/Modal/WelcomModal";

export default () => {
  const [selectedPlan, setSelectedPlan] = useState();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [modal, setModal] = useState(false);
  const [restoreModal, setRestoreModal] = useState(false);
  const [trialModal, setTrialModal] = useState(false);
  const [weeklyModal, setWeeklyModal] = useState(false);
  const [monthlyModal, setMonthlyModal] = useState(false);
  const [yearlyModal, setYearlyModal] = useState(false);
  const handleSubscribe = () => {
    setModal(true);
  };
  const handleRestore = () => {
    setRestoreModal(true);
  };
  const handleTestTrial = () => {
    setTrialModal(true);
  };
  const handleTestWeekly = () => {
    setWeeklyModal(true);
  };
  const handleTestMonthly = () => {
    setMonthlyModal(true);
  };
  const handleTestYearly = () => {
    setYearlyModal(true);
  };
  const renderItem = ({ item }) => {
    const isActive = selectedPlan === item.id;
    return (
      <View style={styles.listContainer}>
        <TouchableOpacity
          onPress={() => { setSelectedPlan(item.id); setIsSubscribed(true) }}
        activeOpacity={0.7}
        >
          <ImageBackground
            source={isActive ? images.ActiveSubscription : images.InActiveSubscription}
            style={styles.img}
            imageStyle={styles.imgStyle}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.trail}>{item.freeTrails}</Text>
            <Text style={styles.prise}>{item.prise}</Text>
            <Text style={styles.Access}>{item.Access}</Text>
          </ImageBackground>
          {item.type === "Yearly" && (
            <SvgXml xml={bestdeal} style={styles.badge} width={moderateScale(56)} height={moderateScale(46)} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={combineStyles.container2}>
      <ImageBackground source={images.yellowBackground} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={combineStyles.regular18}>Subscription</Text>
              <Text style={[combineStyles.regular12, styles.autoRenewText]}>
                Auto-renewable
              </Text>
            </View>

            <View style={styles.subscucriptionContainer}>
              <FlatList
                data={SubsucripitonArray}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
              />

              <Text style={styles.txtStyle}>
                Subscription expired — gameplay is paused. Subscribe to come back!
                You can cancel at any time.
              </Text>
              <PressableIcon
                icon={isSubscribed ? SubSucribtionAcitveSvg : SubSucribtionInacitveSvg}
                width="100%"
                height={60}
                onPress={handleSubscribe}
              />
              <View style={styles.testButtonsRow}>
                <ScalePressable onPress={() => { playButtonSound(); handleTestTrial(); }} style={styles.testBtn}>
                  <Text style={styles.testBtnText}>Test 3 days</Text>
                </ScalePressable>
                <ScalePressable onPress={() => { playButtonSound(); handleTestWeekly(); }} style={styles.testBtn}>
                  <Text style={styles.testBtnText}>Test Weekly</Text>
                </ScalePressable>
                <ScalePressable onPress={() => { playButtonSound(); handleTestMonthly(); }} style={styles.testBtn}>
                  <Text style={styles.testBtnText}>Test Monthly</Text>
                </ScalePressable>
                <ScalePressable onPress={() => { playButtonSound(); handleTestYearly(); }} style={styles.testBtn}>
                  <Text style={styles.testBtnText}>Test Yearly</Text>
                </ScalePressable>
              </View>

              <DeleteMessageModal
                backImg={images.oops}
                paw
                title={"Oops!"}
                subtitle={"Something went wrong \n \n \n Please try again."}
                isVisible={modal}
                centerButton={false}
                rowBtton={false}
                onClose={() => setModal(false)}
              />
              <WelcomModal
                backImg={images.restoregreenbg}
                paw
                title={"Welcome Back!"}
                subtitle={"Full access restored — time to walk and care!"}
                isVisible={restoreModal}
                
                onClose={() => setRestoreModal(false)}
              />
              <WelcomModal
                paw
                backImg={images.purchasedone}
                subtitle={"Enjoy 3 days of full access. Walk and take care of your StepPal!"}
                isVisible={trialModal}
                title={"Welcome!"}
                onClose={() => setTrialModal(false)}
              />
              <WelcomModal
              backImg={images.purchasedone}
              title={"Congratulations!"}
                paw
                subtitle={"Enjoy 7 days of full access. Walk and take care of your StepPal!"}
                isVisible={weeklyModal}
                
                onClose={() => setWeeklyModal(false)}
              />
              <WelcomModal
              backImg={images.purchasedone}
              title={"Congratulations!"}
                paw
                subtitle={"Enjoy 1 month of full access. Walk and take care of your StepPal!"}
                isVisible={monthlyModal}
                
                onClose={() => setMonthlyModal(false)}
              />
              <WelcomModal
              backImg={images.purchasedone}
              title={"Congratulations!"}
                paw
                subtitle={"Enjoy 1 year of full access. Walk and take care of your StepPal!"}
                isVisible={yearlyModal}
                
                onClose={() => setYearlyModal(false)}
              />
            </View>
          </View>
          <ScalePressable onPress={() => { playButtonSound(); handleRestore() }}>
            <Text style={styles.restoreText}>restore Purchase</Text>
          </ScalePressable>
          <View style={styles.linksRow}>
            <ScalePressable onPress={() => { playButtonSound(); Linking.openURL(PRIVACY_URL) }}>
              <Text style={styles.linkText}>
                Privacy policy
              </Text >
            </ScalePressable>
            <ScalePressable onPress={() => { playButtonSound(); Linking.openURL(TERMS_URL) }}>
              <Text style={styles.linkText}>Terms of service</Text>
            </ScalePressable>
          </View>
        </ScrollView>

      </ImageBackground>
    </View>
  );
};