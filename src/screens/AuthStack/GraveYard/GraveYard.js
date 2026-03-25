import React, { useState, useMemo } from "react";
import { FlatList, ImageBackground, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./Styles";
import { images } from "../../../assets/images";
import { combineStyles } from "../../../libs/combineStyle";
import LoaderKitView from "react-native-loader-kit";

const PAGE_SIZE = 9;

export default () => {
  const entries = useSelector((state) => state.graveyardReducer?.entries ?? []);
  const [page, setPage] = useState(1);
  const visibleData = useMemo(() => entries.slice(0, page * PAGE_SIZE), [entries, page]);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading || visibleData.length >= entries.length) return;
    setLoading(true);
    setTimeout(() => {
      setPage((p) => p + 1);
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

    if (entries.length > 0 && visibleData.length >= entries.length) {
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

        {entries.length === 0 ? (
          <Text style={styles.subtitle}>
            You haven't had a Pet die yet. Keep it up!
          </Text>
        ) : (
          <FlatList
            data={visibleData}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gravYardContainer}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ImageBackground>
    </View>
  );
};