import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import back from "../../../assets/images/back.png";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export default function Header({ onBack }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backBtn} onPress={onBack}>
        <SvgXml xml={back} width={24} height={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginTop: isSmallScreen ? 40 : 60,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  backBtn: {
    padding: 8,
  },
});