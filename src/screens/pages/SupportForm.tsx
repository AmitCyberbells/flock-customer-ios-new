import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Keyboard,
} from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { Colors } from '../../constants/Colors';
import FormLayout from './layouts/FormLayout';
import { useSelector } from 'react-redux';
import { StoreStates } from '../../store/store';
import MtToast from '../../constants/MtToast';
import Request from '../../services/Request';
import Loader from '../../components/Loader';
import InputField from '../../components/InputField';
import { isIos } from '../../constants/IsPlatform';
import { Fonts } from '../../constants/Fonts';
import { useThemeColors } from '../../constants/useThemeColors';

interface SupportProps extends ScreenProps<'SupportForm'> {
    initialData?: {
        name: string;
        email: string;
        phone: string;
    };
}

const SupportForm: React.FC<SupportProps> = ({ navigation, initialData }) => {
    const [subject, setSubject] = useState('');
    const [query, setQuery] = useState('');
    const [loader, setLoader] = useState(false);
    const user = useSelector((state: StoreStates) => state.user)
    const theme = useThemeColors();

    const handleContinue = useCallback(async () => {
        if (!subject.trim() || !query.trim()) {
            return MtToast.error('Please fill in all fields');
        }

        try {
            if (Keyboard.isVisible()) { Keyboard.dismiss() };
            setLoader(true);

            Request.createSupportTicket({ title: subject, description: query }, (success, error) => {
                setLoader(false);

                if (success) {
                    MtToast.success(success.message);

                    //reset form
                    setSubject('');
                    setQuery('');
                } else {
                    MtToast.error(error.message);
                }
            })

        } catch (error) {
            MtToast.error('Failed to submit support request. Please try again.');
            setLoader(false);
        }
    }, [subject, query, navigation]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.white,
        },
        keyboardAvoidingView: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
            paddingTop: 20
        },
        scrollViewContent: {
            flexGrow: 1,
            paddingBottom: isIos ? 40 : 150,
        },
        backButton: {
            padding: 20,
        },
        backButtonText: {
            fontSize: Fonts.fs_24,
            color: Colors.blue,
        },
        title: {
            fontSize: Fonts.fs_24,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 20,
        },
        content: {
            flex: 1,
            paddingHorizontal: 20,
        },
        infoContainer: {
            marginBottom: 20,
        },
        infoField: {
            backgroundColor: theme.cardBackground,
            borderRadius: 10,
            padding: 16,
            marginBottom: 16,
            shadowColor: Colors.black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        infoText: {
            fontSize: Fonts.fs_16,
            color: theme.text,
        },
        inputContainer: {
            marginBottom: 20,
        },
        borderTransparent: {
            color: theme.text,
            borderColor: 'transparent'
        },
        inputWrapper: {
            borderRadius: 10,
            backgroundColor: theme.cardBackground,
            shadowColor: Colors.black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        input: {
            height: 56,
            borderRadius: 10,
            paddingHorizontal: 20,
            fontSize: Fonts.fs_16,
            color: Colors.black,
        },
        queryInput: {
            height: 150,
            paddingTop: 16,
            paddingBottom: 16,
        },
        continueButton: {
            height: 56,
            backgroundColor: Colors.primary_color_orange,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
        },
        continueButtonDisabled: {
            opacity: 0.7,
        },
        continueButtonText: {
            color: Colors.white,
            fontSize: Fonts.fs_18,
            fontWeight: '600',
        },
    });
    
    return (
        <FormLayout>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >

                <Loader isLoading={loader} />

                <View style={styles.content}>
                    <View>
                        <View style={styles.infoField}>
                            <Text style={styles.infoText}>{user.first_name + ' ' + user.last_name}</Text>
                        </View>

                        <View style={styles.infoField}>
                            <Text style={styles.infoText}>{user.email}</Text>
                        </View>

                        {/* Only render the contact field if the user has a contact */}
                        {user.contact ? (
                            <View style={styles.infoField}>
                                <Text style={styles.infoText}>{user.contact}</Text>
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <InputField
                            style={styles.inputWrapper}
                            inputStyle={styles.borderTransparent}
                            placeholder="Subject"
                            value={subject}
                            onChangeText={setSubject}
                            placeholderTextColor="#999"
                            returnKeyType="next"
                            charLimit={50}
                        />

                        <InputField
                            style={styles.inputWrapper}
                            inputStyle={styles.borderTransparent}
                            placeholder="Enter your query"
                            value={query}
                            onChangeText={setQuery}
                            placeholderTextColor="#999"
                            multiline
                            textAlignVertical="top"
                            numberOfLines={6}
                            charLimit={150}
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[
                            styles.continueButton,
                            (!subject.trim() || !query.trim()) && styles.continueButtonDisabled
                        ]}
                        onPress={handleContinue}
                        disabled={!subject.trim() || !query.trim()}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </FormLayout>
    );
};

export default SupportForm;