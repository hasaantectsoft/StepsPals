import { ImageBackground, StyleSheet } from "react-native";

export default function Background({ path,background }) {
  return (
    <ImageBackground
      source={path}
      style={[styles.background, { backgroundColor: background || "transparent" }]}
      resizeMode="stretch"
      // resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
