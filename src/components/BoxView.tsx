import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import BoxViewTypes from '../types/BoxViewTypes';

const BoxView = ({
  title,
  subtitle,
  image,
  cardStyle,
  children,
  bodyStyle,
  imageStyle,
  titleStyle,
  subtitleStyle
}: BoxViewTypes) => {
  return (
    <View style={[styles.card, cardStyle]}>
      {image && <Image source={image} style={[styles.image, imageStyle]} />}
      <View style={[styles.textContainer, bodyStyle]}>
        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 8,
  },
  textContainer: {
    paddingVertical: 8,
    width: "100%"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default BoxView;
