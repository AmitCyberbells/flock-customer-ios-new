import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import Design from '../design/Design';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const generateRandomCoordinates = () => {
  const x = Math.random() * (screenWidth - 100); // Adjust 100 based on your item's width
  const y = Math.random() * (screenHeight - 200); // Adjust 100 based on your item's height
  console.log(x, y)
  return { x, y };
};

const RandomItems = ({ data }) => {
  return (
    <View style={styles.container}>
      {
        data.map((item, index) => {
          const { x, y } = generateRandomCoordinates();
          return (
            <View key={index} style={[styles.item, { left: x, top: y }]}>
              <Text>{item}</Text>
            </View>
          );
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  item: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: Design.primary_color_orange,
    margin: 50,
  },
});

export default RandomItems;