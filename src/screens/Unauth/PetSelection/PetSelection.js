import React, { useState } from "react";
import { View, ImageBackground, Text, TouchableOpacity } from "react-native";
import { Styles } from "./styles";
import { cat, dino, dog } from "../../../assets/svgs";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

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
                source={require("../../../assets/images/PawPatterns.png")}
                style={Styles.imgbg}
                resizeMode="cover"
            >
                <Text style={Styles.title}>
                    Your future path will be to take care of your Pet.
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
                                onPress={() => setSelectedPet(pet)}
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
                <View style={Styles.nextButtonWrapper}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.navigate('SelectGoalScreen',
                        {pet: selectedPet}
                    )}}>
                        <ImageBackground
                            style={Styles.nextButton}
                            resizeMode="contain"
                            source={require("../../../assets/images/next.png")}
                        >
                            <Text style={Styles.nextButtonText}>NEXT</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View >
    );
}