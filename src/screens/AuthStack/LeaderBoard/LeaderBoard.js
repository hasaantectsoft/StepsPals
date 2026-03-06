import React from "react";

import { Image, ImageBackground, View, Text } from "react-native";
import { images } from "../../../assets/images";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";
import { styles } from "./Styles";
import LeaderBoardComponent from "../../../components/LeaderBoardComponet/LeaderBoardComponent";
export default () => {
    return (

        <View style={styles.container}>
            < SettingsBackground path={images.RankingBackground} />
            <Image source={images.RankingTitle} style={styles.titleLogo} />
            <LeaderBoardComponent/>
            {/* <ImageBackground source={images.Legend} style={styles.titleButton} imageStyle={styles.titleimg} />
            <Text style={styles.Lagendtxt}>LEGEND</Text>

            <ImageBackground source={images.GoldBtn} style={styles.titleButton} imageStyle={styles.titleimg} />
            <Text style={styles.Lagendtxt}>GOLD</Text>


            <ImageBackground source={images.Bronze} style={styles.titleButton} imageStyle={styles.titleimg} />
            <Text style={styles.Lagendtxt}>BRONZE</Text>


            <ImageBackground source={images.Platinum} style={styles.titleButton} imageStyle={styles.titleimg} />
            <Text style={styles.Lagendtxt}>PLATINUM</Text>


            <ImageBackground source={images.SilverBtn} style={styles.titleButton} imageStyle={styles.titleimg} />
            <Text style={styles.Lagendtxt}>SILVER</Text> */}
        </View>
    )
}