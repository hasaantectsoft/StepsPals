import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import minus from "../../../assets/images/minus.png";
import plus from "../../../assets/images/plus.png";
import progressbar from "../../../assets/images/progressbar.png";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export default function StepGoal({ value, onIncrease, onDecrease }) {
  return (
    <View style={styles.stepSection}>
      <Text style={styles.sectionTitle}>Step Goal</Text>
      <Text style={styles.stepValue}>[{value}] steps/day</Text>
      <View style={styles.sliderRow}>
        <Pressable onPress={onDecrease} style={styles.sliderControl}>
          <SvgXml height={20}width={20} xml={minus}/>
        </Pressable>
        <View style={styles.trackWrapper}>
          <Image source={progressbar} style={styles.progressBar} resizeMode="stretch" />
          <View
            style={[
              styles.trackFill,
              { width: `${(value / 10000) * 100}%` },
            ]}
          />
        </View>
        <Pressable onPress={onIncrease} style={styles.sliderControl}>
          <SvgXml height={20}width={20} xml={plus}/>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepSection: {
    alignSelf: "stretch",
    marginTop: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? 12 : 14,
  },
  stepValue: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? 10 : 12,
    marginVertical: 4,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  sliderControl: {
    padding: 10,
  },
  sliderControlText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? 18 : 22,
  },
  trackWrapper: {
    flex: 1,
    height: 12,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  progressBar: {
    width: "100%",
    height: 12,
  },
  track: {
    position: "absolute",
    width: "100%",
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: 4,
  },
  trackFill: {
    position: "absolute",
    height: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
});