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
import { Fonts } from '../constants/Fonts';
import { isAndroid } from '../constants/IsPlatform';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive sizes
const scale = SCREEN_WIDTH / 375; // Using 375 as base width
const normalize = (size: number): number => Math.round(scale * size);

// Icons as SVG components for better scaling
const FeatherIcon = (tintColor = Colors.venueIconColor) => (
  <View style={[styles.iconContainer, styles.featherIconContainer]}>
    <Imageview
      url={Images.AppOffer}
      style={{
        height: 20,
        width: 20,
      }}
      imageType={'local'}
      resizeMode={'cover'}
      tintColor={tintColor}
    />
  </View>
);

const VenueIcon = (tintColor = Colors.primary_color_orange) => (
  <View style={[styles.iconContainer, styles.venueIconContainer]}>
    <Imageview
      url={Images.VenueOffer}
      style={{
        height: 20,
        width: 20,
      }}
      imageType={'local'}
      resizeMode={'cover'}
      tintColor={tintColor}
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
  const [canRedeem, setCanRedeem] = useState<boolean>(false);
  const allowedFeather = ['feather_points'].includes(offer?.redeem_by || '')
  const allowedVenue = ['venue_points'].includes(offer?.redeem_by || '')
  const allowedBoth = ['both'].includes(offer?.redeem_by || '')

  useEffect(() => {
    setRedeemBy((offer?.redeem_by === 'venue_points' ? 'venue_points' : 'feather_points'))
    const venueBlanace = wallet?.venue_wallets?.find(w => w?.vendor_id === offer?.venue?.user_id)?.balance_venue_points || 0;

    setVenueBalancePoints(venueBlanace)
    setCanRedeem(false)

    if (!offer) {
      return;
    }

    haveEnoughPoints(offer, venueBlanace);

  }, [offer?.id])

  const haveEnoughPoints = (offer: Offer, venueBlanace: number) => {
    const enoughFeathers = wallet.balance_feather_points >= offer.feather_points;
    const enoughVenuePoints = venueBlanace >= offer.venue_points;

    if (
      (offer?.redeem_by === 'feather_points' && enoughFeathers) ||
      (offer?.redeem_by === 'venue_points' && enoughVenuePoints) ||
      (offer?.redeem_by === 'both' && (enoughVenuePoints || enoughFeathers))
    ) {
      setCanRedeem(true);
    }
  }

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
                activeOpacity={0.9}
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
                  <Text style={{ fontSize: Fonts.fs_14, color: Colors.grey }}>{offer?.description || ''}</Text>
                </View>
              </View>

              {/* Offer Price */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Offer Price</Text>
                <View style={[styles.sectionNote, styles.flexRow]}>
                  <Text style={{ fontSize: Fonts.fs_12 }}>
                    Note: This offer requires
                  </Text>
                  {(allowedBoth || allowedFeather) && <View style={styles.flexRow}>
                    <Text style={{ fontSize: Fonts.fs_12, fontFamily: Fonts.medium }}>
                      {' Feathers'}
                    </Text>
                    {allowedBoth && <Text style={{ fontSize: Fonts.fs_12 }}>
                      {' or'}
                    </Text>}
                  </View>}
                  {(allowedBoth || allowedVenue) && <Text style={{ fontSize: Fonts.fs_12, fontFamily: Fonts.medium }}>
                    {' Venue Points'}
                  </Text>}
                  <Text style={{ fontSize: Fonts.fs_12 }}>
                    {'!'}
                  </Text>
                </View>

                <View style={styles.pointsRow}>
                  <View style={[styles.pointBox, styles.featherPointBox, allowedVenue && {
                    backgroundColor: Colors.whitesmoke,
                    borderColor: Colors.whitesmoke
                  }]}>
                    {FeatherIcon(allowedVenue ? Colors.grey : Colors.primary_color_orange)}
                    <Text style={[styles.pointText, allowedVenue && {
                      color: Colors.grey
                    }]}>
                      {offer?.feather_points + ' fts'}
                    </Text>
                  </View>

                  <View style={[styles.pointBox, styles.venuePointBox, allowedFeather && {
                    backgroundColor: Colors.whitesmoke
                  }]}>
                    {VenueIcon(allowedFeather ? Colors.grey : Colors.venueIconColor)}
                    <Text style={[styles.pointText, allowedFeather && {
                      color: Colors.grey
                    }]}>
                      {offer?.venue_points + ' pts'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Current Points */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>You Currently Have</Text>
                <View style={styles.currentPointsRow}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => setRedeemBy('feather_points')} style={{ flex: 1 }} disabled={allowedVenue}>
                    <View style={[styles.currentPointBox, styles.currentFeatherBox, redeemBy !== 'feather_points' && {
                      backgroundColor: Colors.white,
                      borderColor: '#E8EAF6',
                      borderWidth: 1
                    }, allowedVenue && {
                      backgroundColor: Colors.whitesmoke,
                    }]}>
                      {redeemBy === 'feather_points' ? <Imageview
                        url={Images.FlockBird}
                        style={{
                          height: 30,
                          width: 30,
                        }}
                        imageType={'local'}
                        resizeMode={'cover'}
                      /> : FeatherIcon(allowedVenue ? Colors.grey : Colors.primary_color_orange)}

                      <Text style={[styles.currentPointText, redeemBy === 'feather_points' && { color: Colors.white }, allowedVenue && {
                        color: Colors.grey
                      }]}>
                        {wallet.balance_feather_points} Feathers
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.9} onPress={() => setRedeemBy('venue_points')} style={{ flex: 1 }} disabled={allowedFeather}>
                    <View style={[styles.currentPointBox, styles.currentVenueBox, redeemBy === 'venue_points' && {
                      backgroundColor: Colors.venueIconColor
                    }, allowedFeather && {
                      backgroundColor: Colors.whitesmoke
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
                        /> : VenueIcon(allowedFeather ? Colors.grey : Colors.venueIconColor)}
                      <Text style={[styles.currentPointText2, redeemBy === 'venue_points' && {
                        color: Colors.white
                      }, allowedFeather && {
                        color: Colors.grey
                      }]}>
                        {venue_balance_points} Venue Points
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              🔔 Important: Once you redeem this offer, you must use it within{' '}
              <Text style={styles.bold}>7 days</Text>. After 7 days, the offer
              will expire and your points <Text style={styles.bold}>won’t be refunded</Text>.
            </Text>

            {/* Redeem Button */}
            <TouchableOpacity
              style={[styles.redeemButton, !canRedeem && {
                backgroundColor: Colors.orange_shade1
              }]}
              onPress={() => onRedeem(redeemBy)}
              activeOpacity={0.9}
              disabled={!canRedeem}
            >
              <Text style={styles.redeemButtonText}>Redeem Now</Text>
            </TouchableOpacity>
            {!canRedeem && (
              <Text style={{
                fontSize: Fonts.fs_11,
                textAlign: 'center'
              }}>{'You don\'t have sufficient points to redeem this offer!'}</Text>
            )}
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
    maxHeight: SCREEN_HEIGHT * (isAndroid ? 0.90 : 0.83),
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
    fontSize: Fonts.fs_24,
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
    fontSize: Fonts.fs_18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: normalize(20),
  },
  sectionTitle: {
    fontSize: Fonts.fs_16,
    fontWeight: '600',
    color: '#000',
    marginBottom: normalize(8),
  },
  sectionNote: {
    marginBottom: normalize(8),
  },
  flexRow: {
    flexDirection: 'row'
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
    fontSize: Fonts.fs_16,
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
    fontSize: Fonts.fs_16,
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
    fontSize: Fonts.fs_16,
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
    fontSize: Fonts.fs_14,
    color: Colors.black,
    textAlign: 'center',
  },
  currentPointText2: {
    fontSize: Fonts.fs_14,
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
    fontSize: Fonts.fs_16,
  },
  redeemButton: {
    backgroundColor: '#FF8210',
    padding: normalize(16),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: normalize(8),
  },
  redeemButtonText: {
    color: 'white',
    fontSize: Fonts.fs_16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: Fonts.fs_12,
    color: '#aa0000',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default RedeemOfferDialog;