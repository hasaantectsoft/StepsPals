import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { images } from "../../../assets/images";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export default function PetInfo({ pet }) {
  
console.log(pet.id,"Pet.id is follwoing")
  
  const img =
    pet.id ==1 ? images.Cat :
    pet.id == 2 ? images.Dog :
    images.Dino;

  return (
    <>
    

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
 
});