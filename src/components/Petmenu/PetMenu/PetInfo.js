import { Dimensions, Text, View } from "react-native";
import PetSpriteStill from "../../PetSprites/PetSpriteStill/PetSpriteStill";
import { styles } from "./PetInfoStyles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PetInfo({ pet }) {
  return (
    <View style={styles.petInfo}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petDays}>{pet.days === "MAX" ? "MAX" : `${pet.days} days`}</Text>
      <View style={styles.petImage}>
        <PetSpriteStill
          petkey={pet.id}
          stage={pet.stage}
          condition={pet.condition}
          size={SCREEN_WIDTH * 0.3}
          canvasWidth={SCREEN_WIDTH * 0.3}
        />
      </View>
    </View>
  );
}
