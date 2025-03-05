import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { Colors } from '../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { StoreStates } from '../../store/store';
import FormLayout from './layouts/FormLayout';
import { logout } from '../../store/authReducer';
import Loader from '../../components/Loader';
import Request from '../../services/Request';
import Toast from 'react-native-toast-message';
import MtToast from '../../constants/MtToast';

interface DeleteAccountProps extends ScreenProps<'DeleteAccount'> { }

const DeleteAccount: React.FC<DeleteAccountProps> = ({ navigation }) => {
    const [reason, setReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useSelector((state: StoreStates) => state.user)
    const dispatch = useDispatch();

    const deleteReasons = [
        "Select reason",
        "Not using the app anymore",
        "Found a better alternative",
        "Technical issues",
        "Privacy concerns",
        "Other"
    ];

    const handleContinue = useCallback(async () => {
        if (!reason || reason === deleteReasons[0]) {
            Alert.alert('Error', 'Please select a reason for deleting your account');
            return;
        }

        try {
            setIsSubmitting(true);
            // API call would go here
            await new Promise(resolve => setTimeout(resolve, 1000));
            Alert.alert(
                'Confirmation',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => setIsSubmitting(false)
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            // Handle actual deletion
                            deleteAccountApi()
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to process your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [reason, navigation]);

    const deleteAccountApi = () => {
        setIsSubmitting(true);

        Request.archiveProfile({reason}, (success, error) => {
            setIsSubmitting(false);
            
            if (success) {
                dispatch(logout());

            } else {
                MtToast.error(error.message);
            }
        })
    }

    return (
        <FormLayout>

            <View style={styles.content}>

                <View style={styles.infoContainer}>
                    <View style={styles.infoField}>
                        <Text style={styles.infoText}>{user.first_name + ' ' + user.last_name}</Text>
                    </View>

                    <View style={styles.infoField}>
                        <Text style={styles.infoText}>{user?.email}</Text>
                    </View>

                    <View style={styles.infoField}>
                        <Text style={styles.infoText}>{user?.contact}</Text>
                    </View>
                </View>

                <View style={styles.reasonContainer}>
                    <Text style={styles.reasonLabel}>Choose reason</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={reason}
                            onValueChange={(itemValue) => setReason(itemValue)}
                            style={styles.picker}
                        >
                            {deleteReasons.map((item, index) => (
                                <Picker.Item key={index} label={item} value={item} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        (!reason || reason === deleteReasons[0]) && styles.continueButtonDisabled
                    ]}
                    onPress={handleContinue}
                    disabled={!reason || reason === deleteReasons[0] || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.continueButtonText}>Continue</Text>
                    )}
                </TouchableOpacity>
            </View>

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
    backButton: {
        padding: 20,
    },
    backButtonText: {
        fontSize: 24,
        color: Colors.blue,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 30,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 30,
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
    reasonContainer: {
        marginBottom: 30,
    },
    reasonLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#F0F0FF',
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        height: 56,
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

export default DeleteAccount;