import React, { useState } from "react";
import { styles } from "./style";
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, Linking } from "react-native";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
import PressableIcon from "../../../components/PressSvg/PressSvg";
import { bestdeal, SubSucribtionAcitveSvg, SubSucribtionInacitveSvg } from "../../../assets/svgs";
import { DeleteMessageModal } from "../../../components/Modal";
import { FlatList } from "react-native-actions-sheet";
import { SubsucripitonArray } from "../../../utils/exports";
import { moderateScale } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { retro } from "../../../utils/extra/delay";
import ScalePressable from "../../../components/ScalePressable/ScalePressable";
import { PRIVACY_URL, TERMS_URL } from "../../../utils/extra/links";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";
import WelcomModal from "../../../components/Modal/WelcomModal";

export default () => {
  const [selectedPlan, setSelectedPlan] = useState();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [modal, setModal] = useState(false)
  const [restoreModal, setRestoreModal] = useState(false)
  const handleSubscribe = () => {
    setModal(true);
  };
  const handleRestore = () => {
    setRestoreModal(true);
  };
  const renderItem = ({ item }) => {
    const isActive = selectedPlan === item.id;
    return (
      <View style={styles.listContainer}>
        <TouchableOpacity
          onPress={() => { setSelectedPlan(item.id); setIsSubscribed(true) }}
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
              <Text style={[combineStyles.regular12, { color: Theme.colors.ligtBrown }]}>
                Auto-renewable
              </Text>
            </View>

            <View style={styles.subscucriptionContainer}>
              <FlatList
                data={SubsucripitonArray}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[styles.listContent, { gap: moderateScale(15), paddingRight: moderateScale(15) }]}
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
                subtitle={"Enjoy 3 days of full access. Walk and take care of your StepPal!"}
                isVisible={restoreModal}
                
                onClose={() => setRestoreModal(false)}
              />
            </View>
          </View>
          <ScalePressable onPress={() => { playButtonSound(); handleRestore() }}>
          <Text style={{
            fontSize: 8,
            fontFamily: retro,
            textAlign: "center",
            marginVertical: moderateScale(20)
          }}>
            restore Purchase
          </Text>
          </ScalePressable>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: moderateScale(20),
            gap: moderateScale(20)
          }}>
            <ScalePressable onPress={() => { playButtonSound(); Linking.openURL(PRIVACY_URL) }}>
              <Text style={{
                fontFamily: retro,
                fontSize: 6,
              }}>
                Privacy policy
              </Text >
            </ScalePressable>
            <ScalePressable onPress={() => { playButtonSound(); Linking.openURL(TERMS_URL) }}>
              <Text style={{
                fontFamily: retro,
                fontSize: 6,
              }}>Terms of service</Text>
            </ScalePressable>
          </View>
        </ScrollView>

      </ImageBackground>
    </View>
  );
};