import React from "react";
import { View, StyleSheet } from "react-native";

export default function RetroLoader({progress}) {



  return (
    

      <View style={styles.outerBar}>
        <View style={styles.innerBar}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                i < progress && styles.filledSegment
              ]}
            />
          ))}
        </View>
      </View>

     
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6E7A1", // soft yellow retro bg
    justifyContent: "center",
    alignItems: "center",
  },

 

  outerBar: {
    width: 260,
    height: 40,
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 8,
    shadowOffset: { width: 6, height: 6 },
  },

  innerBar: {
    
    flexDirection: "row",
    justifyContent: "space-between",
  },

  segment: {
    flex: 1,
    height: 20,
    marginHorizontal: 2,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },

  filledSegment: {
    backgroundColor: "#4DA6FF",
  },

  button: {
    marginTop: 25,
    backgroundColor: "#4DA6FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});