import React, { ReactNode } from 'react';
import { View, StyleSheet, Image, StyleProp, ViewStyle } from 'react-native';
import { useThemeColors } from '../constants/useThemeColors';

type ShadowCardProps = {
  style?: StyleProp<ViewStyle>,
  children: ReactNode
}

const ShadowCard = ({
  style,
  children
}: ShadowCardProps) => {

  const theme = useThemeColors();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.background,
      borderRadius: 5,
      padding: 16,
      //marginVertical: 8,
      marginHorizontal: 2,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Android shadow
    }
  });

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};



export default ShadowCard;
