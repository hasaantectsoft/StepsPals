import { useState } from "react";
import { ImageBackground, Text, View, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import { Header, NextButton } from "../../../components";
import { cat, dog, dino } from "../../../assets/svgs";
import { styles } from "./styles";
import ScalePressable from "../../../components/ScalePressable/ScalePressable";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";
import { moderateScale, scale } from "react-native-size-matters";

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
        
        if (trimmed.length < 2) {
            setError("Pet name must be at least 2 characters");
            return;
        }
        
        const englishLettersOnly = /^[a-zA-Z]+$/;
        if (!englishLettersOnly.test(trimmed)) {
            setError("Pet name must contain English letters only");
            return;
        }
        
        setError("");
        navigation.replace("SelectGoalScreen", { pet, petName: trimmed });
    };

    return (
        <ImageBackground
            source={require("../../../assets/images/petraname.png")}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.headerContainer}>
                <Header title="" subtitle="" onBackPress={() => navigation.goBack()} conatiner={{paddingHorizontal: scale(20),paddingTop:scale(20)}} />
            </View>
            <View style={styles.wrapper}>
                <ImageBackground imageStyle={{
                    resizeMode: 'contain',
                    width: scale(250),
                    height: scale(260),
                }} source={require('../../../assets/images/box.png')} style={styles.card}>
                    <Text style={styles.title}>Name Your Pet</Text>
                    <View style={styles.petImageWrap}>
                        <SvgXml xml={PetSvg} width={90} height={90} preserveAspectRatio="xMidYMid meet" />
                    </View>
                   <ImageBackground source={require('../../../assets/images/newinput.png')}
                   resizeMode="contain"
                   imageStyle={styles.inputImage}
                   style={styles.inputBg} >
                   <TextInput
                        style={styles.input}
                        placeholder="PetName"
                        placeholderTextColor="#6F5548"
                        maxLength={10}
                        value={petName}
                        onChangeText={(t) => { 
                            setPetName(t); 
                            const trimmed = t.trim();
                            if (trimmed === "") {
                                setError("");
                            } else if (trimmed.length < 2) {
                                setError("Pet name must be at least 2 characters");
                            } else if (!/^[a-zA-Z]+$/.test(trimmed)) {
                                setError("Pet name must contain English letters only");
                            } else {
                                setError("");
                            }
                        }}
                    />
                   </ImageBackground>
                    {error ? <Text style={[styles.errorText]}>{error}</Text> : null}
                </ImageBackground>
                <ScalePressable disabled={petName.trim().length < 2 || !/^[a-zA-Z]+$/.test(petName.trim())} onPress={handleDone}>
                <NextButton disabled={petName.trim().length < 2 || !/^[a-zA-Z]+$/.test(petName.trim())} text={petName ? "Done" : "Done"} useTouchable={false} />
                </ScalePressable>
        </View>
        </ImageBackground>
    );
}