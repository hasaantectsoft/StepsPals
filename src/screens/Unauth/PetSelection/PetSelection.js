import React, { useState } from "react";
import { View, ImageBackground, Text, TouchableOpacity } from "react-native";
import { Styles } from "./styles";
import { cat, dino, dog } from "../../../assets/svgs";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import NextButton from "../../../components/NextButton/NextButton";
import { scale } from "react-native-size-matters";

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
                        const Wrapper = isSelected ? ImageBackground : View;
                        return (
                            <TouchableOpacity
                                key={pet.id}
                                activeOpacity={0.8}
                                onPress={() => setSelectedPet(pet)}
                            >
                                <Wrapper
                                    source={
                                        isSelected
                                            ? require("../../../assets/images/selected.png")
                                            : undefined
                                    }
                                    resizeMode="stretch"
                                    imageStyle={Styles.selectedBgImage}
                                    style={[Styles.petItem]}
                                >
                                    <SvgXml style={{
                                        marginVertical: scale(10),
                                    }} xml={pet.svg} height={80} width={90} />
                                    <Text style={Styles.petName}>{pet.name}</Text>
                                </Wrapper>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <NextButton  onPress={() => navigation.navigate('NameYourPer', { pet: selectedPet })} />
            </ImageBackground>
        </View >
    );
}