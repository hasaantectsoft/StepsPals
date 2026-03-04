import React, { useState } from "react";
import { View, Text, ImageBackground } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import { Styles } from "./Styles";
import { Header } from "../../../components";
import StepSlider from "../../../components/SelectYourGoal/StepSlider";
import RetroDoneButton from "../../../components/SelectYourGoal/RetroDoneButton";

export default function SelectGoalScreen() {
    const { params } = useRoute();
    const navigation = useNavigation();
    const pet = params?.pet;
    const [stepGoal, setStepGoal] = useState(5000);

    return (
        <View style={Styles.container}>
            <ImageBackground
                source={require("../../../assets/images/Statistics.png")}
                style={Styles.imgbg}
                resizeMode="cover"
            >
                <Header centersub={true} title="Set your" subtitle="daily Step Goal" onBackPress={() => navigation.goBack()} />
                <View style={Styles.content}>
                    <Text style={Styles.descText}>
                        This is the number of steps you’ll aim to walk each day.
                    </Text>
                    <Text style={Styles.descText1}>
                    Your Pet’s health and happiness depend on it!

                    </Text>
                    {pet?.svg ? (
                        <View style={Styles.petImage}>
                            <SvgXml xml={pet.svg} width={Styles.petImage.width} height={Styles.petImage.height} />
                        </View>
                    ) : null}
                    <Text style={Styles.petName}>{pet?.name ?? "Your Pet"}</Text>
                    <View style={Styles.stepRow}>
                      
                            <Text style={Styles.stepValue}>{stepGoal}</Text>
                            <Text style={Styles.stepsLabel}>steps</Text>
                        
                    </View>
                    <StepSlider value={stepGoal} onChange={setStepGoal} />
                    <RetroDoneButton onPress={() => navigation.navigate('GivePermissions')} />
                    
                </View>
            </ImageBackground>
        </View>
    );
}