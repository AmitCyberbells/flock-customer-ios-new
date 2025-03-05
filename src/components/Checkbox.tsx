import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Checkbox = ({ value, onValueChange }: {value: boolean, onValueChange: (value:boolean) => void}) => {
  return (
    <Pressable onPress={() => onValueChange(!value)} style={styles.checkboxContainer}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Icon name="check" size={18} color="white" iconStyle='solid' />}
      </View>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default Checkbox;
