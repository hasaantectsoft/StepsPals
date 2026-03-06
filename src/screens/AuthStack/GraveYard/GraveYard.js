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

export default () => {
    const [page, setPage] = useState(1);
    const [visibleData, setVisibleData] = useState(
        GrayyardArray.slice(0, 10)
    );
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
        if (loading) return

            ;

        const nextPage = page + 1;
        const newItems = GrayyardArray.slice(0, nextPage * 10);

        if (newItems.length === visibleData.length) return;

        setLoading(true);

        setTimeout(() => {
            setVisibleData(newItems);
            setPage(nextPage);
            setLoading(false);
        }, 500);
    };

    const renderItem = ({ item }) => (
        <View>
            <ImageBackground source={images.PetGravYard} style={styles.gravYard}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.borndate}>{item.bornDate}</Text>
                <Text style={styles.diedate}>{item.dieDate}</Text>
            </ImageBackground>
        </View>
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={images.GravyardBackground}
                style={[combineStyles.backGroundImg]}
            >
                <Text style={styles.header}>Graveyard</Text>
                {
                    GrayyardArray.length == 0 ?

                        <Text style={styles.subtitle}>
                            You haven't had a Pet die yet. Keep it up!
                        </Text>
                        :
                        <FlatList
                            data={visibleData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.gravYardContainer}
                            onEndReached={loadMore}
                            numColumns={3}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                loading ? <LoaderKitView
                                    style={{ width: 50, height: 50, }}
                                    name={'BallSpinFadeLoader'}
                                    animationSpeedMultiplier={1.0}
                                    color={'white'}
                                /> : null
                            }
                            showsVerticalScrollIndicator={false}
                        />
                }
            </ImageBackground>
        </View>
    );
};