import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Venue from "../types/Venue";
import { Colors } from "../constants/Colors";
import { Fonts } from "../constants/Fonts";


interface ChipsProps {
  items?: Array<{name: string}>;
}

const Chips: React.FC<ChipsProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.tag}>{item.name}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6, // Adds spacing between items (React Native 0.71+)
  },
  tag: {
    fontSize: Fonts.fs_13,
    color: Colors.grey,
    fontFamily: Fonts.medium,
    backgroundColor: Colors.whitesmoke,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6, // Ensures proper spacing
    overflow: "hidden",
  },
});

export default Chips;
