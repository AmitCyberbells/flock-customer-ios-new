import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import ActionButtonProps from '../types/ActionButtonProps';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

const ActionButton: React.FC<ActionButtonProps> = ({buttonText, callback, buttonStyle = null}) => {
  return (
    <>
      <TouchableOpacity
        style={buttonStyle ?? styles.button}
        activeOpacity={0.4}
        onPress={callback}>
        <Text
          style={[
            styles.text,
            {
              color: Colors.black,
              fontFamily: Fonts.regular,
              fontSize: Fonts.fs_14,
            },
          ]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
  },
});

export default ActionButton;
