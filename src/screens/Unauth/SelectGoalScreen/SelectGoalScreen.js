import React, { useState } from "react";
import { View, Text, ImageBackground } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import { useSelector, useDispatch } from "react-redux";
import { Styles } from "./Styles";
import { Header } from "../../../components";
import StepSlider from "../../../components/SelectYourGoal/StepSlider";
import RetroDoneButton from "../../../components/SelectYourGoal/RetroDoneButton";
import { images } from "../../../assets/images";
import { setPetName, setPetKey, setPetSteps, setPetCreatedAt, updatePet } from "../../../redux/slices/petslice";
import { setSignedIn } from "../../../redux/slices/authSlice";
import { setIsMain } from "../../../redux/slices/ismain";
import { setPendingEggHatch } from "../../../redux/slices/startoverpetslice";

export default function SelectGoalScreen() {
    const { params } = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const pet = params?.pet;
    const petName = params?.petName;
    const [stepGoal, setStepGoal] = useState(100);
    
    const imnewaccount = useSelector((state) => state.tutorialReducer?.isnewuser);
    const goToMain = () => {
        dispatch(setPetName(petName ?? ''));
        dispatch(setPetKey(String(pet?.id ?? '')));
        dispatch(setPetSteps(stepGoal ?? 100));
        dispatch(setPetCreatedAt(Date.now()));
        dispatch(updatePet({ missedDays: 0, petisdead: false }));
        dispatch(setPendingEggHatch(true));
        dispatch(setSignedIn(true));
        dispatch(setIsMain(true));
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    };

    return (
        <View style={Styles.container}>
            <ImageBackground
                source={images.Statistics}
                style={Styles.imgbg}
                resizeMode="cover"
            >
                <Header centersub={true} title="Set your" subtitle="daily Step Goal" onBackPress={() => navigation.replace('NameYourPer',{pet, petName})} />
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
                    <Text style={Styles.petName}>{petName ?? pet?.name ?? "Your Pet"}</Text>
                    <View style={Styles.stepRow}>
                      
                            <Text style={Styles.stepValue}>{stepGoal}</Text>
                            <Text style={Styles.stepsLabel}>steps</Text>
                        
                    </View>
                    <StepSlider value={stepGoal} onChange={setStepGoal} />
                    <RetroDoneButton onPress={() => imnewaccount ? navigation.navigate('GivePermissions', { pet, petName, stepGoal }) : goToMain()} />
                    
                </View>
            </ImageBackground>
        </View>
    );
}