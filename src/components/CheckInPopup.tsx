import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
  Image
} from 'react-native';
import Images from "../constants/Images";
import Venue from '../types/Venue';
import Icon from '@react-native-vector-icons/fontawesome6';
import { Colors } from '../constants/Colors';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive sizes
const scale = SCREEN_WIDTH / 375; // Using 375 as base width
const normalize = (size: number) => Math.round(scale * size);

// App Bird Icon Component
const AppBirdIcon = () => (
  <View style={styles.smallBirdCircle}>
    <Image
      source={Images.birdapp}
      style={styles.iconImage}
      resizeMode="contain"
    />
  </View>
);

// Building/Venue Icon Component
const BuildingIcon = () => (
  <View style={styles.buildingCircle}>
    <Image
      source={Images.buildingapp}
      style={styles.iconImage}
      resizeMode="contain"
    />
  </View>
);

interface CheckInPopupProps {
  onClose: () => void;
  venue: Venue;
  visible: boolean;
}

const CheckInPopup = ({ visible, onClose, venue }: CheckInPopupProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity onPress={onClose} style={{
              position: 'absolute',
              right: 20,
              top: 20,
            }}>
              <Icon name='circle-xmark' color={Colors.crimson} iconStyle='solid' size={25} />
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.headerTitle}>Check in Successful</Text>
            <Text style={styles.headerSubtitle}>Enjoy Your Rewards!</Text>

            {/* Success Image */}
            <View style={styles.birdContainer}>
              <Image
                source={Images.success}
                style={styles.birdImage}
                resizeMode="contain"
              />
            </View>

            {/* Venue name - left aligned */}
            <Text style={styles.venueName}>{venue.name}</Text>

            {/* Points earned row */}
            <View style={styles.pointsRow}>
              {/* App points */}
              <View style={styles.appPointCard}>
                <AppBirdIcon />
                <Text style={styles.appPointText}>+{venue.feather_points} Feathers</Text>
              </View>

              {/* Venue points */}
              <View style={styles.venuePointCard}>
                <BuildingIcon />
                <Text style={styles.venuePointText}>+{venue.venue_points} Venue Points</Text>
              </View>
            </View>

            {/* Done button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderRadius: normalize(24),
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(20),
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  headerTitle: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: normalize(16),
    color: '#000',
    marginTop: normalize(4),
    marginBottom: normalize(16),
    textAlign: 'center',
  },
  birdContainer: {
    width: normalize(120),
    height: normalize(120),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: normalize(10),
  },
  birdImage: {
    width: normalize(130),
    height: normalize(130),
  },
  venueName: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: '#333',
    marginTop: normalize(10),
    marginBottom: normalize(16),
    alignSelf: 'flex-start',
    textAlign: 'left',
    width: '100%',
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: normalize(20),
    gap: normalize(12),
  },
  appPointCard: {
    flex: 1,
    backgroundColor: '#F5822A',
    borderRadius: normalize(12),
    padding: normalize(16),
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(130),
  },
  venuePointCard: {
    flex: 1,
    backgroundColor: '#2B51FC',
    borderRadius: normalize(12),
    padding: normalize(16),
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(130),
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  smallBirdCircle: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  buildingCircle: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    backgroundColor: '#E8EAFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  iconImage: {
    width: normalize(32),
    height: normalize(32),
  },
  appPointText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  venuePointText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#F5822A',
    width: '100%',
    padding: normalize(16),
    borderRadius: normalize(16),
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: normalize(18),
    fontWeight: '600',
  }
});

export default CheckInPopup;







