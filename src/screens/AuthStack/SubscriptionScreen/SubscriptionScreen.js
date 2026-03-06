import React, { useState } from "react";
import { styles } from "./style";
import { ImageBackground, View, Text } from "react-native";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
import PressableIcon from "../../../components/PressSvg/PressSvg";
import {
  AnuualActivePlanSvg,
  AnuualPlanSvg,
  MonthlyActivePlanSvg,
  MonthlyPlanSvg,
  WeeklyActivePlanSvg,
  WeeklyPlanSvg,
  SubSucribtionAcitveSvg,
  SubSucribtionInacitveSvg,
} from "../../../assets/svgs";
import { DeleteMessageModal } from "../../../components/Modal";

export default () => {
  const [selectedPlan, setSelectedPlan] = useState(null); // active plan
  const [isSubscribed, setIsSubscribed] = useState(false); // subscribe toggle
  const [modal,setModal]=useState(false)

  const handleSubscribe = () => {
setModal(true);

    
  };

  return (
    <View style={combineStyles.combineStyles}>
      <ImageBackground source={images.yellowBackground} style={styles.backgroundImage}>
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={combineStyles.regular18}>Subscription</Text>
            <Text style={[combineStyles.regular12, { color: Theme.colors.ligtBrown }]}>
              Auto-renewable
            </Text>
          </View>

          <View style={styles.subscucriptionContainer}>
            {/* Annual Plan */}
            <PressableIcon
              icon={selectedPlan === "annual" ? AnuualActivePlanSvg : AnuualPlanSvg}
              width="100%"
              height={120}
              container={styles.svgContainer}
              onPress={() =>{ setSelectedPlan("annual");setIsSubscribed(true)}}
            />

            {/* Monthly Plan */}
            <PressableIcon
              icon={selectedPlan === "monthly" ? MonthlyActivePlanSvg : MonthlyPlanSvg}
              width="100%"
              height={120}
              container={styles.svgContainer}
              onPress={() => {setSelectedPlan("monthly");setIsSubscribed(true)}}
            />

            {/* Weekly Plan */}
            <PressableIcon
              icon={selectedPlan === "weekly" ? WeeklyActivePlanSvg : WeeklyPlanSvg}
              width="100%"
              height={120}
              container={styles.svgContainer}
              onPress={() => {setSelectedPlan("weekly");setIsSubscribed(true)}}
            />

            <Text style={styles.txtStyle}>
              Subscription expired — gameplay is paused. Subscribe to come back!
              You can cancel at any time.
            </Text>

            {/* Subscribe Button (depends on plan selection) */}
            <PressableIcon
              icon={isSubscribed ? SubSucribtionAcitveSvg : SubSucribtionInacitveSvg}
              width="100%"
              height={60}
              onPress={handleSubscribe}
            />

            <DeleteMessageModal title={"Oops!"} subtitle={"Something went wrong \n \n \n Please try again."} isVisible={modal} centerButton={false} rowBtton={false} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};