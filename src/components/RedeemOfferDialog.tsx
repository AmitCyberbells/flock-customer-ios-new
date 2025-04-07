import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { Offer } from '../types/Venue';
import Imageview from './Imageview';
import Images from '../constants/Images';
import OfferRedeemBy from '../types/RedeemBy';
import { Colors } from '../constants/Colors';
import { useSelector } from 'react-redux';
import { StoreStates } from '../store/store';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive sizes
const scale = SCREEN_WIDTH / 375; // Using 375 as base width
const normalize = (size: number): number => Math.round(scale * size);

// Icons as SVG components for better scaling
const FeatherIcon = () => (
  <View style={[styles.iconContainer, styles.featherIconContainer]}>
    <Imageview
      url={Images.AppOffer}
      style={{
        height: 20,
        width: 20,
      }}
      imageType={'local'}
      resizeMode={'cover'}
    />
  </View>
);

const VenueIcon = () => (
  <View style={[styles.iconContainer, styles.venueIconContainer]}>
    <Imageview
      url={Images.VenueOffer}
      style={{
        height: 20,
        width: 20,
      }}
      imageType={'local'}
      resizeMode={'cover'}
    />
  </View>
);

const LocationIcon = () => (
  <View style={[styles.iconContainer, styles.locationIconContainer]}>
    <Text style={styles.iconText}>📍</Text>
  </View>
);

interface RedeemOfferDialogProps {
  visible: boolean;
  onClose: () => void;
  offer?: Offer;
  onRedeem: (redeemBy: OfferRedeemBy) => void;
}

const RedeemOfferDialog: React.FC<RedeemOfferDialogProps> = ({
  visible,
  onClose,
  offer,
  onRedeem
}) => {

  const [redeemBy, setRedeemBy] = useState<OfferRedeemBy>('feather_points');
  const wallet = useSelector((state: StoreStates) => state.wallet)
  const [venue_balance_points, setVenueBalancePoints] = useState<number>(0)

  useEffect(() => {
    console.log(offer?.venue?.user_id, {wallet: wallet?.venue_wallets})
    setVenueBalancePoints(wallet?.venue_wallets?.find(w => w?.vendor_id === offer?.venue?.user_id)?.balance_venue_points || 0)
  }, [offer])

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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Offer Details</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Venue Name */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Venue Name</Text>
                <View style={styles.venueContainer}>
                  <Text style={styles.venueName}>{offer?.venue?.name}</Text>
                  <LocationIcon />
                </View>
              </View>

              {/* Offer Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Offer Details</Text>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsText}>{offer?.name || ''}</Text>
                </View>
              </View>

              {/* Offer Price */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Offer Price</Text>
                <View style={styles.pointsRow}>
                  <View style={[styles.pointBox, styles.featherPointBox]}>
                    <FeatherIcon />
                    <Text style={styles.pointText}>
                      {offer?.feather_points} fts
                    </Text>
                  </View>

                  <View style={[styles.pointBox, styles.venuePointBox]}>
                    <VenueIcon />
                    <Text style={styles.pointText}>
                      {offer?.venue_points} pts
                    </Text>
                  </View>
                </View>
              </View>

              {/* Current Points */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>You Currently Have</Text>
                <View style={styles.currentPointsRow}>
                  <TouchableOpacity onPress={() => setRedeemBy('feather_points')} style={{flex: 1}}>
                    <View style={[styles.currentPointBox, styles.currentFeatherBox, redeemBy !== 'feather_points' && {
                      backgroundColor: Colors.white,
                      borderColor: '#E8EAF6',
                      borderWidth: 1
                    }]}>
                      {redeemBy === 'feather_points' ? <Imageview
                        url={Images.FlockBird}
                        style={{
                          height: 30,
                          width: 30,
                        }}
                        imageType={'local'}
                        resizeMode={'cover'}
                      /> : <FeatherIcon /> }

                      <Text style={[styles.currentPointText, redeemBy === 'feather_points' && {color: Colors.white}]}>
                        {wallet.balance_feather_points} Feather Point
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRedeemBy('venue_points')} style={{flex: 1}}>
                    <View style={[styles.currentPointBox, styles.currentVenueBox, redeemBy === 'venue_points' && {
                      backgroundColor: Colors.primary_color_orange
                    }]}>
                      {redeemBy === 'venue_points' ?
                        <Imageview
                          url={Images.venueWhite}
                          style={{
                            height: 30,
                            width: 30,
                          }}
                          imageType={'local'}
                          resizeMode={'cover'}
                        /> : <VenueIcon />}
                      <Text style={[styles.currentPointText2, redeemBy === 'venue_points' && {
                        color: Colors.white
                      }]}>
                        {venue_balance_points} Venue Point
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Redeem Button */}
            <TouchableOpacity
              style={styles.redeemButton}
              onPress={() => onRedeem(redeemBy)}
              activeOpacity={offer?.redeemed ? 0.5 : 0.8}
              disabled={offer?.redeemed ? true : false}
            >
              <Text style={styles.redeemButtonText}>Redeem Now</Text>
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
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderRadius: normalize(20),
    paddingTop: normalize(16),
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(20),
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
  scrollContent: {
    paddingBottom: normalize(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
    paddingHorizontal: normalize(4),
  },
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(-8),
  },
  closeButtonText: {
    fontSize: normalize(18),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: normalize(20),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: normalize(8),
  },
  venueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: normalize(16),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  venueName: {
    fontSize: normalize(16),
    color: '#000',
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: normalize(16),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailsText: {
    fontSize: normalize(16),
    color: '#333',
    lineHeight: normalize(24),
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: normalize(8),
  },
  pointBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(16),
    borderRadius: normalize(12),
    gap: normalize(10),
  },
  featherPointBox: {
    backgroundColor: '#ffe6cf',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  venuePointBox: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  pointText: {
    fontSize: normalize(16),
    color: '#333',
    flex: 1,
    marginLeft: normalize(4),
  },
  currentPointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: normalize(12),
  },
  currentPointBox: {
    flex: 1,
    alignItems: 'center',
    padding: normalize(18),
    borderRadius: normalize(10),
    gap: normalize(8),
  },
  currentFeatherBox: {
    backgroundColor: Colors.primary_color_orange,
  },
  currentVenueBox: {
    // backgroundColor: '#E8EAF6',
    borderWidth: 1,
    borderColor: '#E8EAF6',
  },
  currentPointText: {
    fontSize: normalize(14),
    color: Colors.black,
    textAlign: 'center',
  },
  currentPointText2: {
    fontSize: normalize(14),
    color: '#000',
    textAlign: 'center',
  },
  iconContainer: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(4),
  },
  featherIconContainer: {
    backgroundColor: 'transparent',
  },
  venueIconContainer: {
    backgroundColor: 'transparent',
  },
  locationIconContainer: {
    backgroundColor: '#ffe6cf',
  },
  iconText: {
    fontSize: normalize(16),
  },
  redeemButton: {
    backgroundColor: '#FF8210',
    padding: normalize(16),
    borderRadius: normalize(10),
    alignItems: 'center',
    marginTop: normalize(8),
  },
  redeemButtonText: {
    color: 'white',
    fontSize: normalize(16),
    fontWeight: '600',
  },
});

export default RedeemOfferDialog;