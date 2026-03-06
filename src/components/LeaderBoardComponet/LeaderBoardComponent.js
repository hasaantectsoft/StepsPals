import { View, Text, ImageBackground, FlatList } from "react-native";
import React from "react";
import { styles } from "./style";
import { images } from "../../assets/images";
import { LagendArray } from "../../utils/exports";

const LeaderBoardComponent = () => {

  const renderItem = ({ item }) => (
    <View>
      <ImageBackground
        source={images.rankingbtn}
        style={{width:"100%",height:90}}
      >
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.Legend}
        style={styles.titleButton}
        imageStyle={styles.titleimg}
      />
      
      <Text style={styles.Lagendtxt}>LEGEND</Text>

      <FlatList
        data={LagendArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default LeaderBoardComponent;