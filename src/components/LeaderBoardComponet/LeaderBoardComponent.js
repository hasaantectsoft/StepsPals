


import { View, Text, ImageBackground, FlatList, Image } from "react-native";
import React from "react";
import { styles } from "./style";
import { images } from "../../assets/images";


const LeaderBoardComponent = ({data,title,titleImage,ContainerStyle,titleStyle}) => {

  const renderItem = ({ item }) => (
    <View style={styles.gravYard}>
      <ImageBackground
        source={item.firstUser?item.firstUser:images.rankingbtn}
        style={[styles.titleButton, styles.rankBtn]}
        imageStyle={styles.img}
      >
 <View style={styles.details}>
<ImageBackground source={images.Capsule} style={styles.rankIcon}>
  <Text style={styles.id}>{item.id}</Text>
</ImageBackground>
{/* <Text style={styles.dot}>..</Text> */}
<Text style={styles.name}>{item.name}</Text>
<Text style={styles.dot}>..</Text>
<Text style={styles.score}>{item.score.toString().slice(0, 3)}</Text>
<Text style={styles.score}>{item.score.toString().slice(0, 2)}</Text>

      </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={[styles.container,ContainerStyle]}>
        <ImageBackground
        source={titleImage}
        style={[styles.titleButton]}
        imageStyle={styles.titleimg}
      />
      <Text style={[styles.Lagendtxt,titleStyle]}>{title}</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listGap}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />

    </View>
  );
};

export default LeaderBoardComponent;