import { FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { combineStyles } from "../../../libs/combineStyle";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";
import { images } from "../../../assets/images";
import { styles } from "./style";
import { useSelector } from "react-redux";

const PET_IMAGE = { '1': images.Dog, '2': images.Cat, '3': images.Dino };
const formatDate = (ms) => {
    if (!ms) return '';
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}.${mm}.${yy}`;
};

export default function CollectionScreen() {
    const pets = useSelector((s) => s.petCollectionReducer?.pets ?? []);
    const renderItem = ({ item }) => (
        <View style={styles.CollectionCard}>
            <TouchableOpacity activeOpacity={0.6}>
                <ImageBackground
                    source={images.CollectionCard}
                    style={styles.card}
                    imageStyle={styles.cardImage}
                >
                    <Image source={PET_IMAGE[String(item.petkey)]} style={styles.petimg} />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.date}>{formatDate(item.createdAt)}</Text>

                </ImageBackground>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={combineStyles.container}>
            <SettingsBackground path={images.PetCollecionBackground} />

            <View style={styles.container}>
                {pets.length === 0 && (
                    <Text style={styles.txt}>
                        There Are No Pets In The Collection Yet
                    </Text>
                )}

                <ImageBackground
                    source={images.PetCollectionWindow}
                    style={styles.img}
                    imageStyle={styles.imgStyle}
                >
                    <View style={styles.innerContainer}>
                        <FlatList
                            data={pets}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={3}
                            contentContainerStyle={styles.listContent}
                            columnWrapperStyle={styles.row}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
}