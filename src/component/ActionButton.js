import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import Design from '../design/Design';

const ActionButton = ({ button_text, click_fun, buttonStyle = null  }) => {
  return (
    <>
      <TouchableOpacity
        style={buttonStyle ?? styles.button}
        activeOpacity={0.4}
        onPress={click_fun}
      >
        <Text style={[styles.text, { color: Design.black, fontFamily: Platform.OS === 'ios' ? Design.ios_regular : Design.android_regular, fontSize: Design.font_14 }]}>
          {button_text}
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
