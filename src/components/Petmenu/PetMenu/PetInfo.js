import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import PressableIcon from "../../PressSvg/PressSvg";
import { BackArrow } from "../../../assets/svgs";
import { moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { images } from "../../../assets/images";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export default function PetInfo({ pet }) {
  const navigation = useNavigation();

  
  const img =
    pet.id === 1 ? images.Cat :
    pet.id === 2 ? images.Dog :
    images.Dino;

  return (
    <>
      <PressableIcon
        icon={BackArrow}
        container={styles.backBtn}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petDays}>{pet.days} days</Text>
        <Image source={img} style={styles.petImage} resizeMode="contain" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  petInfo: {
    alignItems: "center",
  },
  petName: {
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
marginTop:moderateScale(60),
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    marginVertical: 10,
  },
  backBtn: {
    position: "absolute",
    left: moderateScale(25),
    top: moderateScale(42),
  },
});