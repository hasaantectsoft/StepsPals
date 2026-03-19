import { Dimensions, StyleSheet, Text, View } from "react-native";
import { combineStyles } from "../../../libs/combineStyle";
import { Theme } from "../../../libs";
import { moderateScale } from "react-native-size-matters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH <= 375;

export default function PetDetails({ pet }) {
  const details = [
    { label: "Species:", value: pet.species },
    { label: "Age:", value: pet.age },
    { label: "Condition:", value: pet.condition },
    { label: "Mature stage:", value: pet.stage },
    { label: "Missed days:", value: pet.missed },
  ];

  return (
    <View style={styles.details}>
      {details.map((item, index) => (
        <View key={index} style={combineStyles.row1}>
          <Text style={styles.labelText}>{item.label}</Text>
          <Text style={styles.detailText}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    alignSelf: "center",
    marginVertical: 10,
    gap:moderateScale(16)
  },
  detailText: {
    ...combineStyles.regular12,
    color:Theme.colors.brown
   
  },
  labelText:{
    ...combineStyles.regular12,
  }
});