import React, { ReactNode } from 'react';
import {View, StyleSheet, Image, StyleProp, ViewStyle} from 'react-native';

type ShadowCardProps = {
    style?: StyleProp<ViewStyle>,
    children: ReactNode
}

const ShadowCard = ({
  style,
  children
}: ShadowCardProps) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 16,
    //marginVertical: 8,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  }
});

export default ShadowCard;
