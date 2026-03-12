import { FlatList, Image, ImageBackground, ScrollView, Text, View } from "react-native";
import { combineStyles } from "../../../libs/combineStyle";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";
import { images } from "../../../assets/images";
import { styles } from "./style";
import { PetCollectionArray } from "../../../utils/exports";

export default () => {

    const renderItem = ({ item }) => (
        <View style={styles.CollectionCard}>
             <ImageBackground
            source={images.CollectionCard}
            style={styles.card}
            imageStyle={styles.cardImage}
        >
           <Image source={item.img} style={styles.petimg} />
           <Text style={styles.name}>{item.name}</Text>
           <Text style={styles.date}>{item.date}</Text>
            
        </ImageBackground>
        </View>
    );

    return (
        <View style={combineStyles.container}>
            <SettingsBackground path={images.PetCollecionBackground} />

            <View style={styles.container}>
                <Text style={styles.txt}>
                    There Are No Pets In The Collection Yet
                </Text>

                <ImageBackground
                    source={images.PetCollectionWindow}
                    style={styles.img}
                    imageStyle={styles.imgStyle}
                >
                   <View style={styles.innerContainer}>
                     <FlatList
                        data={PetCollectionArray}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        contentContainerStyle={styles.listContent}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                    />
                   </View>
                </ImageBackground>
            </View>
        </View>
    );
};