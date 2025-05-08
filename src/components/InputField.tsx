import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

// Define the props type for the component
interface InputFieldProps extends TextInputProps {
  value?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  charLimit?: number;
  acceptedChars?: RegExp; // Regex for allowed characters
  required?: boolean;
  errorMessage?: string; // Message when regex validation fails
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

// Functional component with props type
const InputField: React.FC<InputFieldProps> = ({
  value = '',
  onChangeText,
  placeholder = '',
  charLimit,
  acceptedChars,
  required = false,
  errorMessage = 'Invalid input',
  style = {},
  inputStyle = {},
  ...textInputProps
}) => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    validateInput(value);
  }, [value]);

  const validateInput = (text: string) => {
    if (required && !text.trim()) {
      setError('This field is required');
      return;
    }

    if (charLimit && text.length > charLimit) {
      setError(`Maximum ${charLimit} characters allowed`);
      return;
    }

    if (acceptedChars && !acceptedChars.test(text)) {
      setError(errorMessage);
      return;
    }

    setError('');
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey}
        style={[styles.input, inputStyle, error ? styles.inputError : null]}
        onBlur={() => validateInput(value)}
        {...textInputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: Fonts.fs_16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: Fonts.fs_12,
    padding: 5
  },
});

export default InputField;
