import React from 'react';
import { ImageBackground, ScrollView, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { useThemeColors } from '../../../constants/useThemeColors';


interface LayoutProps {
    children: React.ReactNode;
}

const FormLayout: React.FC<LayoutProps> = ({ children }) => {
    const theme = useThemeColors();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        keyboardAvoidingView: {
            flex: 1,
        },
    })

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default FormLayout;
