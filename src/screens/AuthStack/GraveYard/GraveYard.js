import React, { useState } from "react";
import { styles } from "./Styles";
import {
  FlatList,
  ImageBackground,
  Text,
  View,
} from "react-native";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import { GrayyardArray } from "../../../utils/exports";
import LoaderKitView from "react-native-loader-kit";
import PetDieModal from "../../../components/PetDieModal/PetDieModal";

export default () => {
  const [page, setPage] = useState(1);
  const [visibleData, setVisibleData] = useState(
    GrayyardArray.slice(0, 20)
  );
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading) return;

    const nextPage = page + 1;
    const newItems = GrayyardArray.slice(0, nextPage * 9);

    if (newItems.length === visibleData.length) return;

    setLoading(true);

    setTimeout(() => {
      setVisibleData(newItems);
      setPage(nextPage);
      setLoading(false);
    }, 500);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <ImageBackground source={item.img ? item.img : images.PetGravYard} style={styles.gravYard}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.borndate}>{item.bornDate}</Text>
        <Text style={styles.diedate}>{item.dieDate}</Text>
      </ImageBackground>
    </View>
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <LoaderKitView
          style={{ width: 50, height: 50, alignSelf: "center", marginVertical: 20 }}
          name={"BallSpinFadeLoader"}
          animationSpeedMultiplier={1.0}
          color={"white"}
        />
      );
    }

    if (visibleData.length === GrayyardArray.length) {
      return (
        <Text style={styles.bottomText}>
          Your earliest pets now rest in memory beyond the graveyard…
        </Text>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.GravyardBackground}
        style={combineStyles.backGroundImg}
      >
        <Text style={styles.header}>Graveyard</Text>

        {GrayyardArray.length === 0 ? (
          <Text style={styles.subtitle}>
            You haven't had a Pet die yet. Keep it up!
          </Text>
        ) : (
          <FlatList
            data={visibleData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gravYardContainer}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        )}
            {/* <PetDieModal isVisible={true}  /> */}

      </ImageBackground>
    </View>
  );
};