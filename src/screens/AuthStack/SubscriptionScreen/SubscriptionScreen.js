import React, { useState } from "react";
import { styles } from "./style";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
import PressableIcon from "../../../components/PressSvg/PressSvg";
import {
  SubSucribtionAcitveSvg,
  SubSucribtionInacitveSvg,
} from "../../../assets/svgs";
import { DeleteMessageModal } from "../../../components/Modal";
import { FlatList } from "react-native-actions-sheet";
import { SubsucripitonArray } from "../../../utils/exports";
import { moderateScale } from "react-native-size-matters";

export default () => {
  const [selectedPlan, setSelectedPlan] = useState(); // active plan
  const [isSubscribed, setIsSubscribed] = useState(false); // subscribe toggle
  const [modal,setModal]=useState(false)

  const handleSubscribe = () => {
setModal(true);

    
  };


  const renderItem = ({ item }) => {
  const isActive = selectedPlan === item.id; // check if this plan is active

  return (
    <View style={styles.listContainer}>
      <TouchableOpacity
        onPress={() => {setSelectedPlan(item.id);setIsSubscribed(true)}}
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
      </TouchableOpacity>
    </View>
  );
};

  return (
    <View style={combineStyles.container2}>
      <ImageBackground source={images.yellowBackground} style={styles.backgroundImage}>
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
       keyExtractor={(item)=>item.id.toString()}
       contentContainerStyle={{gap:moderateScale(15),right:moderateScale(15)}}
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


  // return(
  //  <View style={combineStyles.combineStyles}>

  //  <ImageBackground source={images.yellowBackground} style={styles.backgroundImage}>

  // </ImageBackground>
  //  </View>

  // );
};