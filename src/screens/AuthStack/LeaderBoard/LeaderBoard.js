import React from "react";

import { Image, ImageBackground, View, Text } from "react-native";
import { images } from "../../../assets/images";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";
import { styles } from "./Styles";
import LeaderBoardComponent from "../../../components/LeaderBoardComponet/LeaderBoardComponent";
import { BronzeArray, GoldArray, LagendArray, PlatinumArray, SilverArray } from "../../../utils/exports";
import { ScrollView } from "react-native-actions-sheet";
import { moderateScale } from "react-native-size-matters";
export default () => {
    return (

        <View style={styles.container}>
            < SettingsBackground path={images.RankingBackground} />
            <Image source={images.RankingTitle} style={styles.titleLogo} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <LeaderBoardComponent data={LagendArray} title={"LEGEND"} titleImage={images.Legend}/>
                <LeaderBoardComponent data={PlatinumArray} title={"PLATINUM"} titleImage={images.Platinum} ContainerStyle={{marginTop:moderateScale(30)}} />
                <LeaderBoardComponent data={GoldArray} title={"GOLD"} titleImage={images.GoldBtn}  ContainerStyle={{marginTop:moderateScale(30)}}/>
                <LeaderBoardComponent data={SilverArray} title={"SILVER"} titleImage={images.SilverBtn} ContainerStyle={{marginTop:moderateScale(30)}} />
                <LeaderBoardComponent data={BronzeArray} title={"BRONZE"} titleImage={images.Bronze} ContainerStyle={{marginTop:moderateScale(30),marginBottom:moderateScale(120)}} />
            </ScrollView>
        </View>
    )
}