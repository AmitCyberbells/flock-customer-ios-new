import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenProps from "../../types/ScreenProps";
import FormLayout from "./layouts/FormLayout";
import Loader from "../../components/Loader";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../../constants/Colors";
import { isIos, isAndroid } from "../../constants/IsPlatform";
import Venue from "../../types/Venue";
import Request from "../../services/Request";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { StoreStates } from "../../store/store";
import MtToast from "../../constants/MtToast";
import InputField from "../../components/InputField";
import DropdownMenu from "../../components/DropdownMenu";
import { Fonts } from "../../constants/Fonts";
import { useThemeColors } from "../../constants/useThemeColors";

const Report: React.FC<ScreenProps<'Report'>> = (props) => {
    const [loader, setIsLoading] = useState<boolean>(false);
    const [selectedVenue, setSelectedVenue] = useState<number>();
    const [description, setDescription] = useState<string>();
    const [venues, setVenues] = useState<Array<Venue>>([]);
    const location = useSelector((state: StoreStates) => state.location)
    const theme = useThemeColors();


    useEffect(() => {
        fetch_venues();
    }, [])

    const fetch_venues = async () => {
        setIsLoading(true);

        Request.fetch_venues({ ...location }, (success, error) => {
            setIsLoading(false);

            if (error) {
                Toast.show({
                    type: 'MtToastError',
                    text1: error.message,
                    position: 'bottom',
                });
            } else {
                setVenues(success.data);
            }
        });
    };

    const handleContinue = () => {
        console.log(selectedVenue, description)

        if (!selectedVenue || !description) {
            return MtToast.error('Please select a venue and write your concern!');
        }

        setIsLoading(true);

        Request.reportVenue({
            venue_id: selectedVenue,
            description
        }, (success, error) => {

            setIsLoading(false);

            if (success) {
                MtToast.success(success.message);
                //reset form data
                setSelectedVenue(undefined);
                setDescription(undefined);

            } else {
                MtToast.error(error.message);
            }

        })
    }

    const styles = StyleSheet.create({
        content: {
            flex: 1,
            justifyContent: 'flex-start',
            paddingTop: 20,
            paddingBottom: isIos ? 34 : 20,
        },
        inputsContainer: {
            padding: 20,
        },
        inputWrapper: {
            marginBottom: 16,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: 8
        },
        locationContainer: {
            marginBottom: 16,
        },
        textArea: {
            padding: 10,
            textAlignVertical: 'top', // Aligns text to the top like a textarea
            fontSize: Fonts.fs_16,
            color: theme.text
        },
        input: {
            height: 56,
            backgroundColor: theme.inputBackground,
            borderRadius: 10,
            paddingHorizontal: 20,
            fontSize: Fonts.fs_16,
            color: theme.text,
            shadowColor: theme.shadowColor,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.border//'#E5E5E5',
        },
        inputText: {
            fontSize: Fonts.fs_16,
            color: theme.text,
        },
        placeholderText: {
            color: '#999',
        },
        googleContainer: {
            flex: 0,
        },
        googleInput: {
            height: 56,
            backgroundColor: Colors.white,
            borderRadius: 10,
            paddingHorizontal: 20,
            fontSize: Fonts.fs_16,
            color: theme.text,
            shadowColor: theme.shadowColor,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
            borderWidth: 1,
            borderColor: theme.border//'#E5E5E5',
        },
        listView: {
            backgroundColor: Colors.white,
            borderRadius: 16,
            marginTop: 8,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.border,//'#E5E5E5',
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 200,
        },
        recentSearchesContainer: {
            marginTop: 16,
            backgroundColor: Colors.white,
            borderRadius: 16,
            padding: 16,
            shadowColor: Colors.black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 3,
        },
        recentSearchesTitle: {
            fontSize: Fonts.fs_14,
            fontWeight: '600',
            color: '#666',
            marginBottom: 12,
        },
        recentSearchesList: {
            maxHeight: 200,
        },
        recentSearchItem: {
            paddingVertical: 12,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#E5E5E5',
        },
        recentSearchContent: {
            flex: 1,
        },
        recentSearchName: {
            fontSize: Fonts.fs_16,
            fontWeight: '500',
            color: Colors.black,
            marginBottom: 4,
        },
        recentSearchAddress: {
            fontSize: Fonts.fs_14,
            color: '#666',
        },
        continueButton: {
            height: 56,
            backgroundColor: Colors.primary_color_orange,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
            opacity: 1,
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

            <Loader isLoading={loader} />

            <View style={styles.content}>
                <View style={styles.inputsContainer}>

                    {isAndroid ? <View style={styles.inputWrapper}>
                        <Picker
                            selectedValue={selectedVenue}
                            style={{ color: theme.text }}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedVenue(itemValue)
                            }>
                            <Picker.Item label={'Select venue'} value={''} />
                            {venues.map(venue => <Picker.Item key={venue.id} label={venue.name} value={venue.id} />)}

                        </Picker>
                    </View> :
                        <View style={{ marginBottom: 20 }}>
                            <DropdownMenu options={venues.map(venue => ({ label: venue.name, value: venue.id }))} onSelect={(item) => setSelectedVenue(item.value)} selectedValue={selectedVenue} placeholder={venues.length > 0 ? "Select a venue" : 'No venue found!'} /></View>}

                    <View>
                        <InputField
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Explain your concern here..."
                            charLimit={150}
                            style={{ marginTop: 0 }}
                            inputStyle={styles.textArea}
                            numberOfLines={3}
                            multiline
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[
                            styles.continueButton,
                            (!selectedVenue) && styles.continueButtonDisabled
                        ]}
                        onPress={handleContinue}
                        disabled={!selectedVenue}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </FormLayout>
    );
}

export default Report;

