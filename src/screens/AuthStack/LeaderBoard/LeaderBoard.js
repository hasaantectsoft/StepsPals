import React, { useState, useEffect, memo } from "react";
import { Image, View, Text, ScrollView } from "react-native";
import { images } from "../../../assets/images";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";
import { styles } from "./Styles";
import LeaderBoardComponent from "../../../components/LeaderBoardComponet/LeaderBoardComponent";
import { BronzeArray, GoldArray, LagendArray, PlatinumArray, SilverArray } from "../../../utils/exports";
import { moderateScale } from "react-native-size-matters";
import { differenceInSeconds } from "date-fns";
import UpgradePetModal from "../../../components/UpgradePetModal/upgradepetmodal";
import { DeleteMessageModal } from "../../../components/Modal";
import PetDieModal from "../../../components/PetDieModal/PetDieModal";


const CountdownTimer = memo(() => {
    const eventEndTime = new Date("2026-03-14T12:00:00");
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const secondsLeft = differenceInSeconds(eventEndTime, now);

            if (secondsLeft <= 0) {
                setTimeLeft("Event ended");
                clearInterval(interval);
                return;
            }

            const days = Math.floor(secondsLeft / (24 * 3600));
            const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
            const minutes = Math.floor((secondsLeft % 3600) / 60);
            const seconds = secondsLeft % 60;

            setTimeLeft(
                `${days}d ${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.timeContainer}>
            <Text style={styles.timeText}>Time until the event ends</Text>
            <Text style={styles.timeValue}>{timeLeft}</Text>
        </View>
    );
});


const LeaderboardContent = memo(() => (
    <ScrollView showsVerticalScrollIndicator={false}>
        <LeaderBoardComponent data={LagendArray} title={"LEGEND"} titleImage={images.Legend} />
        <LeaderBoardComponent
            data={PlatinumArray}
            title={"PLATINUM"}
            titleImage={images.Platinum}
            ContainerStyle={{ marginTop: moderateScale(30) }}
            titleStyle={{ color: "#65839D" }}
        />
        <LeaderBoardComponent
            data={GoldArray}
            title={"GOLD"}
            titleImage={images.GoldBtn}
            ContainerStyle={{ marginTop: moderateScale(30) }}
            titleStyle={{ color: "#985011" }}
        />
        <LeaderBoardComponent
            data={SilverArray}
            title={"SILVER"}
            titleImage={images.SilverBtn}
            ContainerStyle={{ marginTop: moderateScale(30) }}
            titleStyle={{ color: "#526976" }}
        />
        <LeaderBoardComponent
            data={BronzeArray}
            title={"BRONZE"}
            titleImage={images.Bronze}
            ContainerStyle={{ marginTop: moderateScale(30), marginBottom: moderateScale(120) }}
            titleStyle={{ color: "#FFFFFF" }}
        />
    </ScrollView>
));

export default () => {
    return (
        <View style={styles.container}>
            <SettingsBackground path={images.RankingBackground} />
            <Image source={images.RankingTitle} style={styles.titleLogo} />
            <CountdownTimer />
            <LeaderboardContent />
            <UpgradePetModal isVisible={true} showPet={false}
                cup={images.GoldenCup} title={"Weekly Results"}
                subtitle={"Legend League"}
                btn={false}
                bottomtext={"Total score last week: 182,450 steps"}
                subtitleStyle={styles.subtitleStyle}
                backImg={images.GoldenBackground}
            />

            
        </View>
    );
};