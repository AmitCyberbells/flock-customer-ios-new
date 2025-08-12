import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Venue from "../types/Venue";
import { Colors } from "../constants/Colors";
import { Fonts } from "../constants/Fonts";
import { useThemeColors } from "../constants/useThemeColors";


interface ChipsProps {
  items?: Array<{ name: string, link?: (item: any) => void }>;
  containerStyle?: ViewStyle | Array<ViewStyle>
}

const Chips: React.FC<ChipsProps> = ({ items, containerStyle }) => {
  const theme = useThemeColors();

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
      backgroundColor: theme.background,
      borderRadius: 5,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 6,
      overflow: "hidden",
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          const Tag = (
            <Text style={[styles.tag, item.link ? {
              backgroundColor: Colors.primary_color_orange,
              color: Colors.white
            } : {}]}>
              {item.name}
            </Text>
          );

          return item.link ? (
            <TouchableOpacity onPress={() => item.link?.(item)} activeOpacity={0.9}>
              {Tag}
            </TouchableOpacity>
          ) : (
            Tag
          );
        }}
      />
    </View>
  );
};

export default Chips;
