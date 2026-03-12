import React from "react";
import { TouchableOpacity, Text, ImageBackground } from "react-native";
import { Styles } from "./styles";

export default function NextButton({
    onPress,
    text = "Next",
    disabled = false,
    useTouchable = true,
}) {
    const buttonContent = (
        <ImageBackground
            source={disabled ? require("../../assets/images/disable.png") : require("../../assets/images/next.png")}
            resizeMode="contain"
            style={Styles.doneButton}
            imageStyle={Styles.doneButtonImage}
        >
            <Text style={Styles.doneButtonText}>{text}</Text>
        </ImageBackground>
    );

    if (!useTouchable) {
        return buttonContent;
    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={Styles.retroDoneWrap} disabled={disabled}>
            {buttonContent}
        </TouchableOpacity>
    );
}
