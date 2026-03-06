import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export default function PetDetails({ pet }) {
  return (
    <View style={styles.details}>
      <Text style={styles.detailText}>Species: {pet.species}</Text>
      <Text style={styles.detailText}>Age: {pet.age}</Text>
      <Text style={styles.detailText}>Condition: {pet.condition}</Text>
      <Text style={styles.detailText}>Mature stage: {pet.stage}</Text>
      <Text style={styles.detailText}>Missed days: {pet.missed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    alignSelf: "stretch",
    marginVertical: 10,
  },
  detailText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? 10 : 12,
    marginVertical: 2,
  },
});