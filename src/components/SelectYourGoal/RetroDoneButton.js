import React from "react";
import { TouchableOpacity, Text, ImageBackground } from "react-native";
import { Styles } from "./Styles";

export default function RetroDoneButton({ onPress ,containerStyle,title,btnStyle}) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[Styles.retroDoneWrap, containerStyle]}>
            <ImageBackground
                source={require("../../assets/images/next.png")}
                resizeMode="contain"
                style={Styles.doneButton}
                imageStyle={[Styles.doneButtonImage, btnStyle]}
            >
                <Text style={Styles.doneButtonText}>{title || "DONE"}</Text>
            </ImageBackground>
        </TouchableOpacity>
    );
}
