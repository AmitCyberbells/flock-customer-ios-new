
import 'react-native-get-random-values';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { Colors } from '../../constants/Colors';
import FormLayout from './layouts/FormLayout';
import Request from '../../services/Request';
import LocationSearch from '../../components/LocationSearch';
import Loader from '../../components/Loader';
import MtToast from '../../constants/MtToast';
import InputField from '../../components/InputField';
import { Fonts } from '../../constants/Fonts';

interface VenueLocation {
  address: string;
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const VenueRequest: React.FC<ScreenProps<'VenueRequest'>> = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [venueName, setVenueName] = useState<string>('');
  const [location, setLocation] = useState<VenueLocation | null>(null);

  const handleLocationSelect = useCallback((selectedLocation: VenueLocation) => {
    setLocation(selectedLocation);
  }, [location]);

  const handleContinue = () => {
    if (!venueName.trim() || !location) {
      return MtToast.error('Please enter a venue name and select a location');
    }

    setLoader(true);

    try {
      const venueData = {
        venue_name: venueName,
        location: location?.address || '',
        lat: location?.coordinates?.lat || 0,
        long: location?.coordinates?.lng || 0
      };

      Request.requestVenue(venueData, (success, error) => {
        setLoader(false)

        success ? MtToast.success(success.message) : MtToast.error(error.message);

        setLocation(null);
        setVenueName('');
      })

    } catch (error) {
      setLoader(false);
      MtToast.error('Failed to submit venue request. Please try again.');
    }
  }

  return (
    <FormLayout>

      <Loader isLoading={loader} />

      <View style={styles.content}>
        <View style={styles.inputsContainer}>
          <View style={styles.inputWrapper}>

            <InputField
              value={venueName}
              onChangeText={setVenueName}
              placeholder="Venue name"
              charLimit={50}
              inputStyle={styles.input}
              placeholderTextColor="#999"
              returnKeyType="next"
              autoCapitalize="words"
            />
          </View>

          <LocationSearch onSelect={handleLocationSelect} resetButton={false} style={{ marginBottom: 16 }} />

          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.continueButton,
              (!venueName.trim() || !location) && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!venueName.trim() || !location}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FormLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  inputsContainer: {
    padding: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  locationContainer: {
    marginBottom: 16,
  },
  input: {
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: Fonts.fs_16,
    color: Colors.black,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputText: {
    fontSize: Fonts.fs_16,
    color: Colors.black,
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
    borderColor: '#E5E5E5',
  },
  listView: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
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

export default VenueRequest;