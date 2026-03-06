import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export default function PetInfo({ pet }) {
  return (
    <View style={styles.petInfo}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petDays}>{pet.days} days</Text>
      <Image source={pet.image} style={styles.petImage} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  petInfo: {
    alignItems: "center",
  },
  petName: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? 18 : 22,
    textAlign: "center",
  },
  petDays: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? 12 : 14,
    marginVertical: 4,
  },
  petImage: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    marginVertical: 10,
  },
});