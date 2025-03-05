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
        } finally {
            setLoader(false);
        }
    }, [subject, query, navigation]);

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

                        <View style={styles.infoField}>
                            <Text style={styles.infoText}>{user.contact}</Text>
                        </View>
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
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    backButton: {
        padding: 20,
    },
    backButtonText: {
        fontSize: 24,
        color: Colors.blue,
    },
    title: {
        fontSize: 24,
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
        backgroundColor: Colors.white,
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
        fontSize: 16,
        color: Colors.black,
    },
    inputContainer: {
        marginBottom: 20,
    },
    borderTransparent: {
        borderColor: 'transparent'
    },
    inputWrapper: {
        borderRadius: 10,
        backgroundColor: Colors.white,
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
        fontSize: 16,
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
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    continueButtonDisabled: {
        opacity: 0.7,
    },
    continueButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default SupportForm;