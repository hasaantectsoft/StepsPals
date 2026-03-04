import React from "react";
import { TouchableOpacity, Text, ImageBackground } from "react-native";
import { Styles } from "./Styles";

export default function RetroDoneButton({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={Styles.retroDoneWrap}>
            <ImageBackground
                source={require("../../assets/images/next.png")}
                resizeMode="contain"
                style={Styles.doneButton}
                imageStyle={Styles.doneButtonImage}
            >
                <Text style={Styles.doneButtonText}>DONE</Text>
            </ImageBackground>
        </TouchableOpacity>
    );
}
