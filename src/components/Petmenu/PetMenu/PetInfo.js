import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { images } from "../../../assets/images";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

const IMG_MAP = { '1': images.Dog, '2': images.Cat, '3': images.Dino };

export default function PetInfo({ pet }) {
  return (
    <View style={styles.petInfo}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petDays}>{pet.days} days</Text>
      <Image
        source={IMG_MAP[pet.id] ?? images.Dino}
        style={styles.petImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  petInfo: {
    alignItems: "center",
  },
  petName: {
    marginTop:moderateScale(10),
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? moderateScale(18) : moderateScale(22),
    textAlign: "center",
  },
  petDays: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: isSmallScreen ? moderateScale(12) : moderateScale(14),
    marginVertical: 4,
  },
  petImage: {
    marginTop: moderateScale(16),
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
  },
});
