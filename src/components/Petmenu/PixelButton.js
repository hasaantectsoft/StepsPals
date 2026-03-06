import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { fillButton, googleIosBtn, orangeBtn } from "./buttonSvgs";
import { BouncyPressable } from "./BounceAnimationButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

const BUTTON_WIDTH = isSmallScreen ? 260 : 300;
const BUTTON_HEIGHT = isSmallScreen ? 50 : 60;

export const PixelButton = ({ label, onPress }) => {
  const isGoogleOrIos =
    label.toLowerCase().includes("google") ||
    label.toLowerCase().includes("apple");

  const deleteBtn = label.toLowerCase().includes("delete");
  const buttonXml = isGoogleOrIos ? googleIosBtn : deleteBtn ? orangeBtn : fillButton;

  const isGoogle = label.toLowerCase().includes("google");

  const imgSelect = isGoogle
    ? require("../../assets/images/Group.png")
    : label.toLowerCase().includes("apple")
      ? require("../../assets/images/apple-logo-transparent.png")
      : null;

  return (
    <BouncyPressable onPress={onPress} style={styles.buttonContainer}>
        <SvgXml xml={buttonXml} width={BUTTON_WIDTH} height={BUTTON_HEIGHT} />
      <View style={styles.textOverlay}>
        {imgSelect && <Image source={imgSelect} style={styles.logo} />}
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: isSmallScreen ? 16 : 20,
    height: isSmallScreen ? 16 : 20,
    
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: isSmallScreen ? 8 : 10,
    zIndex: 1,
  },
  buttonText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? 9 : 11,
    fontWeight: "400",
    color: "#000",
    top: 3,
  },
});
