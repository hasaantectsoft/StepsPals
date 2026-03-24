import { FlatList, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { combineStyles } from "../../../libs/combineStyle";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";
import { images } from "../../../assets/images";
import { styles } from "./style";
import { DeleteMessageModal } from "../../../components/Modal";
import { useState } from "react";
import { useSelector } from "react-redux";

export default () => {

    const petCollection = useSelector((s) => s.petCollectionReducer?.pets ?? []);
    const collectionCount = petCollection.length;

    const [replacePetModal, setReplacePetModal] = useState(false);

    console.log("collectionCount", petCollection);

    // Format timestamp to readable date (DD.MM.YY)
    const formatDate = (ts) => {
        if (!ts) return '--.--.--';
        const d = new Date(ts);
        return [d.getDate(), d.getMonth() + 1, String(d.getFullYear()).slice(-2)]
            .map((n) => String(n).padStart(2, '0'))
            .join('.');
    };

    // Map ID to pet image
    const getPetImage = (id) => {
        if (id === 1) return images.Dog;
        if (id === 2) return images.Cat;
        return images.Dino;
    };

    // Create display array with 24 items (fill empty slots with null)
    const displayData = [...petCollection];
    while (displayData.length < 24) {
        displayData.push(null);
    }

    const handelModal=()=>{
            setReplacePetModal(false)
    }
    const renderItem = ({ item }) => (
        <View style={styles.CollectionCard}>
            {item ? (
                <TouchableOpacity activeOpacity={0.6} onPress={() => setReplacePetModal(false)}>
                    <ImageBackground
                        source={images.CollectionCard}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                    >
                        <Image source={getPetImage(item.id)} style={styles.petimg} />
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            ) : (
                <ImageBackground
                    source={images.CollectionCard}
                    style={styles.card}
                    imageStyle={styles.cardImage}
                />
            )}
        </View>
    );

    return (
        <View style={combineStyles.container}>
            <SettingsBackground path={images.PetCollecionBackground} />

            <View style={styles.container}>
                {collectionCount === 0 ? (
                    <Text style={styles.txt}>
                        There Are No Pets In The Collection Yet
                    </Text>
                ) : (
                    <Text style={styles.txt}>
                        Pet Collection ({collectionCount})
                    </Text>
                )}

                <ImageBackground
                    source={images.PetCollectionWindow}
                    style={styles.img}
                    imageStyle={styles.imgStyle}
                >
                    <View style={styles.innerContainer}>
                        <FlatList
                            data={displayData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => (item?.id ? item.id.toString() : `empty-${index}`)}
                            numColumns={3}
                            contentContainerStyle={styles.listContent}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                     <DeleteMessageModal isVisible={replacePetModal} onClose={() => setReplacePetModal(false)} subtitle={"Would you like to choose new pet?"} btn1text={"No"} btn2text={"Yes"} onpressButton2={handelModal} modalStyle={styles.modalStyle} yellowBtn={true} />
         
                </ImageBackground>
            </View>
        </View>
    );
};