import React, { useMemo } from "react";
import { ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Styles } from "./Styles";
import { images } from "../../../assets/images";

export default () => {
  const { petcreatedat, missedDays } = useSelector((s) => s.petReducer ?? {});
  const collectionPets = useSelector((s) => s.petCollectionReducer?.pets ?? []);
  const graveyardEntries = useSelector((s) => s.graveyardReducer?.entries ?? []);

  const stats = useMemo(() => {
    const daysAlive = petcreatedat ? Math.floor((Date.now() - petcreatedat) / 86400000) + 1 : 0;
    const currentStreak = missedDays > 0 ? 0 : Math.max(daysAlive, 0);
    const bestFromCollection = collectionPets.reduce((best, p) => {
      if (p?.stage === "adult") return Math.max(best, 21);
      if (p?.stage === "teen") return Math.max(best, 7);
      return best;
    }, 0);
    const bestStreak = Math.max(bestFromCollection, currentStreak);
    const fullyGrownPets = collectionPets.filter((p) => p?.stage === "adult").length;

    return [
      { title: "Best Streak", value: bestStreak },
      { title: "Current Streak", value: currentStreak },
      { title: "Total Missed Days", value: missedDays ?? 0 },
      { title: "Dead Pets", value: graveyardEntries.length },
      { title: "Fully Grown Pets", value: fullyGrownPets },
    ];
  }, [petcreatedat, missedDays, collectionPets, graveyardEntries.length]);

  return (
    <ImageBackground source={require("../../../assets/images/Statistics.png")} style={Styles.imgbg}>
      <SafeAreaView edges={["top"]} style={Styles.container}>
        <Text style={Styles.title}>Statistics</Text>
        <ImageBackground source={images.stw} style={Styles.stwImage} imageStyle={Styles.stwImageInner}>
          {stats.map((stat, index) => (
            <Text key={index} style={Styles.stats}>{stat.title}: {stat.value}</Text>
          ))}
        </ImageBackground>
      </SafeAreaView>
    </ImageBackground>
  );
}