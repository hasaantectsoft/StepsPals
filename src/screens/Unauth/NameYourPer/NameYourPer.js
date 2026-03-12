import { useState } from "react";
import { ImageBackground, Text, View, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import { Header, NextButton } from "../../../components";
import { cat, dog, dino } from "../../../assets/svgs";
import { styles } from "./styles";
import ScalePressable from "../../../components/ScalePressable/ScalePressable";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";

const petSvgs = { Dog: dog, Cat: cat, Dino: dino };

export default function NameYourPet() {
    const navigation = useNavigation();
    const { pet } = useRoute().params || {};
    const [petName, setPetName] = useState("");
    const [error, setError] = useState("");
    const PetSvg = petSvgs[pet?.name] || dino;

    const handleDone = () => {
        playButtonSound();
        const trimmed = petName.trim();
        if (!trimmed) {
            setError("This field cannot be empty");
            return;
        }
        setError("");
        navigation.navigate("SelectGoalScreen", { pet, petName: trimmed });
    };

    return (
        <ImageBackground
            source={require("../../../assets/images/petraname.png")}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.headerContainer}>
                <Header title="" subtitle="" onBackPress={() => navigation.goBack()} />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.card}>
                    <Text style={styles.title}>Name Your Pet</Text>
                    <View style={styles.petImageWrap}>
                        <SvgXml xml={PetSvg} width={90} height={90} preserveAspectRatio="xMidYMid meet" />
                    </View>
                   <ImageBackground source={require('../../../assets/images/input.png')}
                   resizeMode="contain"
                   imageStyle={styles.inputImage}
                   style={styles.inputBg} >
                   <TextInput
                        style={styles.input}
                        placeholder="PetName"
                        placeholderTextColor="#6F5548"
                        maxLength={10}
                        value={petName}
                        onChangeText={(t) => { setPetName(t); setError(""); }}
                    />
                   </ImageBackground>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
                <ScalePressable disabled={!petName} onPress={handleDone}>
                <NextButton disabled={!petName} text={petName ? "Done" : "Done"} useTouchable={false} />
                </ScalePressable>
        </View>
        </ImageBackground>
    );
}