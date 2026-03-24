import { FlatList, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { combineStyles } from "../../../libs/combineStyle";
import SettingsBackground from "../../../components/Petmenu/SettingsBackground";
import { images } from "../../../assets/images";
import { styles } from "./style";
import { PetCollectionArray } from "../../../utils/exports";
import { DeleteMessageModal } from "../../../components/Modal";
import { useState } from "react";
import UpgradePetModal from "../../../components/UpgradePetModal/upgradepetmodal";

export default () => {

    const [replacePetModal, setReplacePetModal] = useState(false);


    const handelModal=()=>{
            setReplacePetModal(false)
    }
    const renderItem = ({ item }) => (
        <View style={styles.CollectionCard}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => setReplacePetModal(true)}>
                <ImageBackground
                    source={images.CollectionCard}
                    style={styles.card}
                    imageStyle={styles.cardImage}
                >
                    <Image source={item.img} style={styles.petimg} />
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.date}>{item.date}</Text>

                </ImageBackground>
            </TouchableOpacity>
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

                     <DeleteMessageModal isVisible={replacePetModal} onClose={() => setReplacePetModal(false)} subtitle={"Would you like to choose new pet?"} btn1text={"No"} btn2text={"Yes"} onpressButton2={handelModal} modalStyle={styles.modalStyle} yellowBtn={true} />
         
                </ImageBackground>
            </View>
        </View>
    );
};