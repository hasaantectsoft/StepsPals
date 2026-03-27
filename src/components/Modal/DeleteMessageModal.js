import React, { useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { images } from "../../assets/images";
import { combineStyles } from "../../libs/combineStyle";
import NativeButton from "../NativeButton/NativeButton";
import PressableIcon from "../PressSvg/PressSvg";
import { Paw } from "../../assets/svgs";
import { retro } from "../../utils/extra/delay";
import { Theme } from "../../libs";
import ScalePressable from "../ScalePressable/ScalePressable";
import { fadeoutsound, playButtonSound } from "../../utils/SoundManager/SoundManager";

export default function DeleteMessageModal({ backImg, isVisible, onClose, btn1text, btn2text, subtitle, rowBtton = true, centerButton = false, centerButtonTxt, onpressButton2, onpressCenterButton, title, paw = false, swap = false, modalStyle = {}, yellowBtn = false }) {

  useEffect(() => {
    if (isVisible) {
      fadeoutsound();
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
        <View style={[styles.modalBox, modalStyle]}>
          <ImageBackground source={backImg ? backImg : images.ModalBackGround} imageStyle={styles.imgStyle} style={[styles.imgStyle]}>
            {
              title &&
              <Text style={[combineStyles.regular16, styles.title]}>{title}</Text>

            }
            <Text style={[combineStyles.regular14, styles.subtitleStyle]}>{subtitle}</Text>

            {
              rowBtton && (
                <>
                  <NativeButton
                    title={btn1text}
                    onPress={onClose}
                    image={swap ? images.OringeButton : images.blueButton}
                    containerStyle={styles.button}
                    titleStyle={styles.txt}
                  />

                  <NativeButton
                    title={btn2text}
                    onPress={onpressButton2}
                    image={swap ? images.blueButton : yellowBtn ? images.YellowButton : images.OringeButton}
                    containerStyle={styles.button2}
                    titleStyle={styles.txt}
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

        {paw && (
          <ScalePressable style={styles.pawBox} onPress={() => { playButtonSound(); onClose(); }}>
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: moderateScale(20)
            }}>
              <PressableIcon icon={Paw} width={80} height={60} />
              <Text style={styles.pawText}>Tap to continue</Text>
            </View>
          </ScalePressable>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    // backgroundColor: "white",
    height: moderateScale(230),
    borderRadius: moderateScale(10)
  },
  title: { fontSize: moderateScale(18), marginBottom: moderateScale(15) },
  closeButton: { padding: 10, backgroundColor: "red", borderRadius: 6 },
  closeText: { color: "white" },
  imgStyle: {
    // paddingHorizontal: moderateScale(10),
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
  },
  pawText: {
    fontFamily: retro,
    marginTop: moderateScale(12),
    fontSize: 10,
    color: Theme.colors.white,
    textAlign: "center",
  },
  txt: {
    fontSize: moderateScale(9),
    top: moderateScale(2)
  },
  subtitleStyle: {
    textAlign: "center",
    fontSize: moderateScale(12),
    width: moderateScale(290),
    lineHeight: moderateScale(20),
    //  right:moderateScale(6)
  }
});