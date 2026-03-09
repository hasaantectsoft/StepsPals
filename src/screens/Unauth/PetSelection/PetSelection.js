import React, { useState } from "react";
import { View, ImageBackground, Text, TouchableOpacity } from "react-native";
import { Styles } from "./styles";
import { cat, dino, dog } from "../../../assets/svgs";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import NextButton from "../../../components/NextButton/NextButton";
import { playButtonSound } from "../../../utils/SoundManager/SoundManager";

export default () => {
    const pets=[
        {
            id: 1,
            name: "Dog",
            svg: dog,
        },
    
        {
            id: 2,
            name: "Cat",
            svg: cat,
        },  

        {
            id: 3,
            name: "Dino",
            svg: dino,
        },
    ];
    const [selectedPet, setSelectedPet] = useState(pets[0]);
    const navigation = useNavigation();
    return (
        <View style={Styles.container}>
            <ImageBackground
                source={require("../../../assets/images/required.png")}
                style={Styles.imgbg}
                resizeMode="cover"
            >
                <Text style={Styles.title}>
                Your step journey starts with picking your StepPal that will keep you accountable to your goals.
                </Text>
                <Text style={Styles.subtitle}>
                    Select a Pet to start:
                </Text>
                <View style={Styles.petContainer}>
                    {pets.map((pet) => {
                        const isSelected = selectedPet?.id === pet.id;
                        return (
                            <TouchableOpacity
                                key={pet.id}
                                activeOpacity={0.8}
                                onPress={() => {setSelectedPet(pet);playButtonSound()}}
                            >
                                <View
                                    style={[
                                        Styles.petItem,
                                        isSelected && Styles.selectedPetItem,
                                    ]}
                                >
                                    <SvgXml xml={pet.svg} height={80} width={90} />
                                    <Text style={Styles.petName}>{pet.name}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <NextButton  onPress={() => navigation.navigate('NameYourPer', { pet: selectedPet })} />
            </ImageBackground>
        </View >
    );
}