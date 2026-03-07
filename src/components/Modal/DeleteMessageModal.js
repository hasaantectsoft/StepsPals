import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { images } from "../../assets/images";
import { combineStyles } from "../../libs/combineStyle";
import NativeButton from "../NativeButton/NativeButton";
import PressableIcon from "../PressSvg/PressSvg";
import { Paw } from "../../assets/svgs";

export default function DeleteMessageModal({ backImg, isVisible, onClose, btn1text, btn2text, subtitle, rowBtton = true, centerButton = false, centerButtonTxt, onpressButton2, onpressCenterButton, title, paw = false }) {


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
          <ImageBackground source={backImg ? backImg : images.ModalBackGround} imageStyle={styles.imgStyle} style={styles.imgStyle}>
            {
              title &&
              <Text style={[combineStyles.regular16, { textAlign: "center", gap: 10, }]}>{title}</Text>

            }
            <Text style={[combineStyles.regular14, { textAlign: "center", gap: 10 }]}>{subtitle}</Text>

            {
              rowBtton && (
                <>
                  <NativeButton
                    title={btn1text}
                    onPress={onClose}
                    image={images.blueButton}
                    containerStyle={styles.button}
                  />

                  <NativeButton
                    title={btn2text}
                    onPress={onpressButton2}
                    image={images.OringeButton}
                    containerStyle={styles.button2}
                  />
                </>
              )
            }

            {
              centerButton && (
                <>
                  <NativeButton
                    title={centerButtonTxt}
                    onPress={onpressCenterButton}
                    image={images.blueButton}
                    containerStyle={styles.centerButton}
                  />

                </>
              )
            }


          </ImageBackground>
        </View>

        {paw && <TouchableOpacity style={styles.pawBox} onPress={onClose}>
          <PressableIcon icon={Paw} width={90} height={70} />
          <Text>Tap to continue</Text>
        </TouchableOpacity>}
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
    width: "90%",
    // backgroundColor: "white",
    height: moderateScale(180),
    borderRadius: moderateScale(10)
  },
  title: { fontSize: 18, marginBottom: 20 },
  closeButton: { padding: 10, backgroundColor: "red", borderRadius: 6 },
  closeText: { color: "white" },
  imgStyle: {
    paddingHorizontal: moderateScale(10),
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    width: moderateScale(130),
    position: "absolute",
    bottom: moderateScale(-20),
    left: moderateScale(25)
  },
  button2: {
    width: moderateScale(130),
    position: "absolute",
    bottom: moderateScale(-20),
    right: moderateScale(25)
  },
  centerButton: {
    width: moderateScale(130),
    position: "absolute",
    bottom: moderateScale(-20),
    right: moderateScale(100)
  },
  pawBox: {
    position: "absolute",
    bottom: moderateScale(10),
    width: "100%",
    height: moderateScale(200),
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"red"
  }

});