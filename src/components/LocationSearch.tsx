import React, { useState, useCallback, LegacyRef, useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { Colors } from '../constants/Colors';
import { Environment } from '../../env';
import { GoogleLocation } from '../types/Location';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useSelector } from 'react-redux';
import { StoreStates } from '../store/store';

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

            {resetButton && <TouchableOpacity onPress={() => { locationReset() }} style={{
                padding: 10
            }}>
                <Icon name='arrow-rotate-left' iconStyle="solid" size={20} color={Colors.grey} />
            </TouchableOpacity>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    }
});

const defaultStyles = {
    container: {
        flex: 1,
    },
    textInputContainer: {
        flexDirection: 'row'
    },
    textInput: {
        color: Colors.black,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 20,
        fontSize: 15,
        flex: 1,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        height: 55
    },
    listView: {
        elevation: 5, // Ensures it doesn't blend into the background
        shadowColor: '#000', 
        shadowOpacity: 0.3, 
        shadowRadius: 5, 
        borderWidth: 1,
        borderColor: Colors.whitesmoke
    },
    row: {
        backgroundColor: '#FFFFFF',
        padding: 13,
        minHeight: 44,
        flexDirection: 'row',
    },
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    description: { color: Colors.black },
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

export default LocationSearch;
