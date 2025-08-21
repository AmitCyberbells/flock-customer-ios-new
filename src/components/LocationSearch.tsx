import React, { useState, useCallback, LegacyRef, useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { Colors } from '../constants/Colors';
import { Environment } from '../../env';
import { GoogleLocation } from '../types/Location';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useSelector } from 'react-redux';
import { StoreStates } from '../store/store';
import { Fonts } from '../constants/Fonts';
import { useThemeColors } from '../constants/useThemeColors';

interface LocationSearchProps {
    onSelect: (location: GoogleLocation) => void
    resetButton?: boolean
    onReset?: () => void
    style?: StyleProp<ViewStyle>
}

const { width, height } = Dimensions.get('window');

const LocationSearch: React.FC<LocationSearchProps> = ({
    onSelect,
    resetButton = true,
    onReset = () => { },
    style
}) => {

    const theme = useThemeColors();
    const location = useSelector((state: StoreStates) => state.location);

    const handleLocationSelect = useCallback((selectedLocation: GoogleLocation) => {
        onSelect(selectedLocation);
    }, [onSelect]);

    const locationSearchRef = useRef<GooglePlacesAutocompleteRef>(null);

    useEffect(() => {
        locationSearchRef.current?.setAddressText(location.location || '');
    }, [])

    const locationReset = () => {
        Keyboard.isVisible() ? Keyboard.dismiss() : null;
        locationSearchRef.current?.clear();
        onReset();
    }

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            position: 'relative', // Ensure proper positioning context for dropdown
            zIndex: 1000, // Ensure container has high z-index
        }
    });
    
    const defaultStyles = {
        container: {
            flex: 1,
        },
        textInputContainer: {
            flexDirection: 'row',
            position: 'relative',
            zIndex: 1000,
        },
        textInput: {
            color: theme.text,
            backgroundColor: theme.inputBackground,
            borderRadius: 8,
            paddingVertical: 5,
            paddingHorizontal: 20,
            fontSize: Fonts.fs_15,
            flex: 1,
            marginBottom: 5,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            height: 55
        },
        listView: {
            position: 'absolute',
            top: 60, // Position below the input field
            left: 0,
            right: 0,
            zIndex: 1000, // Ensure it appears above other elements
            elevation: 5, // Android shadow
            shadowColor: theme.shadowColor, 
            shadowOpacity: 0.3, 
            shadowRadius: 5, 
            borderWidth: 1,
            borderColor: Colors.whitesmoke,
            backgroundColor: theme.background,
            borderRadius: 8,
            maxHeight: 200, // Limit dropdown height
        },
        row: {
            backgroundColor: theme.background,
            padding: 13,
            minHeight: 44,
            flexDirection: 'row',
        },
        loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 20,
        },
        description: { color: theme.text },
        separator: {
            height: StyleSheet.hairlineWidth,
            backgroundColor: '#c8c7cc',
        },
        poweredContainer: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: '#c8c7cc',
            borderTopWidth: 0.5,
        },
        powered: {},
    };

    return (
        <View style={[styles.container, style]}>

            <GooglePlacesAutocomplete
                ref={locationSearchRef}
                placeholder="Search location"
                minLength={1}
                //currentLocation={false}
                //currentLocationLabel='Your location'
                fetchDetails={true}
                onPress={(data, details = null) => {
                    if (details) {
                        handleLocationSelect({
                            address: details.formatted_address,
                            name: data.structured_formatting?.main_text || data.description,
                            coordinates: {
                                lat: details.geometry.location.lat,
                                lng: details.geometry.location.lng,
                            },
                        });
                    }
                }}
                query={{
                    key: Environment.GoogleMap.getAPIKey(),
                    language: 'en',
                }}
                styles={defaultStyles}
                enablePoweredByContainer={false}
                onFail={error => console.error('GooglePlaces Error:', error)}
                textInputProps={{
                    placeholderTextColor: Colors.grey
                }}
                debounce={300}
                suppressDefaultStyles={true}
            />

            {resetButton && <TouchableOpacity activeOpacity={0.9} onPress={() => { locationReset() }} style={{
                padding: 10
            }}>
                <Icon name='arrow-rotate-left' iconStyle="solid" size={20} color={Colors.grey} />
            </TouchableOpacity>}
        </View>
    );
};

export default LocationSearch;
