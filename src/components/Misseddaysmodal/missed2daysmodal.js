import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet, ImageBackground } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { images } from "../../assets/images";
import { combineStyles } from "../../libs/combineStyle";
import { Theme } from "../../libs";
import { RetryButton } from "../RetryButton/RetryButton";
import { sadpoponesound } from "../../utils/SoundManager/SoundManager";

export default function Missed2daysmodal({
    isVisible,
    onClose,
    petname,
}) {
    useEffect(() => {
        if (isVisible) {
          sadpoponesound();
        }
        
      }, [isVisible]);
    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <ImageBackground
                        source={images.oops}
                        imageStyle={styles.imgStyle}
                        style={styles.imgContainer}
                    >
                        <View style={styles.centerContent}>

                            <Text style={[combineStyles.regular10, styles.subtitle]}>
                            You missed 2 days and your Pet is very sick. One more missed day and it may die.Take care of {petname} to prevent it from dying!</Text>
                           
                        </View>
                    </ImageBackground>
                </View>

                <RetryButton color={Theme.colors.white} onPress={onClose} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        width: "80%",
        height: moderateScale(230),
        borderRadius: moderateScale(10),
        overflow: "hidden",
    },

    imgContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    imgStyle: {
        resizeMode: "stretch",
        borderRadius: moderateScale(10),
    },

    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: moderateScale(15),
    },

    subtitle: {
        textAlign: "center",
        lineHeight: moderateScale(20),
        marginTop: moderateScale(15),
    },
    subtitlee: {
        textAlign: "center",
        lineHeight: moderateScale(20),
        marginTop: moderateScale(15),
        color: Theme.colors.brown,
    },
    title: {
        marginBottom: moderateScale(10),
    }
});