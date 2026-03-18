import React from "react";
import { View, Text, Modal, StyleSheet, ImageBackground } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { images } from "../../assets/images";
import { combineStyles } from "../../libs/combineStyle";
import { Theme } from "../../libs";
import { RetryButton } from "../RetryButton/RetryButton";

export default function missedonedaymodal({
    isVisible,
    onClose,
    petname,
}) {
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
                        source={images.givingtreatmodal}
                        imageStyle={styles.imgStyle}
                        style={styles.imgContainer}
                    >
                        <View style={styles.centerContent}>

                            <Text style={[combineStyles.regular10, styles.subtitle]}>
                            You didn’t reach your goal yesterday, so your Pet is sick. Take care of {petname} so that it gets better! If you miss another day it will get very sick!
                            </Text>
                           
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