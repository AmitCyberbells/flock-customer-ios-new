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
                styles={{
                    textInput: styles.googleInput,
                    listView: styles.listView,
                    container: styles.googleContainer,
                }}
                enablePoweredByContainer={false}
                onFail={error => console.error('GooglePlaces Error:', error)}
                textInputProps={{
                }}
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
    },
    googleContainer: {
        flex: 1,
    },
    googleInput: {
        height: 56,
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 20,
        fontSize: 16,
        color: Colors.black,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#E5E5E5'
    },
    listView: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        marginTop: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#E5E5E5',
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 1000,
        maxHeight: 200,
        width: width - 70,
    }
});

export default LocationSearch;
