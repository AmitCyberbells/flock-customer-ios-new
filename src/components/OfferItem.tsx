import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import BoxView from './BoxView';
import Textview from './Textview';
import { Offer } from '../types/Venue';
import { useState } from 'react';
import Request from '../services/Request';
import Toast from 'react-native-toast-message';
import Imageview from './Imageview';
import Images from '../constants/Images';
import ScreenProps from '../types/ScreenProps';
import RootStackParamList from '../types/RootStackParamList';
import { isIos } from '../constants/IsPlatform';
import FallbackSvg from './FallbackSvg';

type OfferItem = {
  offer: Offer,
  onLoader: (isLoading: boolean) => void,
  onToggleOffer: (offer: Offer) => void,
  redeemOffer: (offer: Offer) => void
};

const OfferItem: React.FC<ScreenProps<keyof RootStackParamList> & OfferItem> = (props) => {
  const { offer, onLoader, onToggleOffer, redeemOffer } = props;

  const toggleOffer = (offer: Offer) => {
    onLoader(true);

    Request.toggleOffer(offer.id, (success, error) => {
      onLoader(false);

      if (success) {
        const updatedOffer = {
          ...offer,
          favourite: !offer.favourite,
        };

        onToggleOffer(updatedOffer);
      } else {
        Toast.show({
          type: 'MtToastError',
          text1: error.message,
          position: 'bottom',
        });
      }
    });
  };

  const showQrcode = () => {
    console.log({ offer })
    props.navigation?.navigate('QrPreview', { data: JSON.stringify({ offer_id: offer.id }) });
  }

  return (
    <BoxView cardStyle={style.item} bodyStyle={style.py_0}>
      <View>
        {offer.images.length > 0 ?
          <Imageview
            url={offer.images[0].file_name}
            style={{
              height: isIos ? 110 : 90,
              borderRadius: 10,
            }}
            imageStyle={{ borderRadius: 10 }}
            imageType={'server'}
            resizeMode={'cover'}
          /> :
          <FallbackSvg wrapperStyle={{marginTop: 0}} androidHeight={90}/>
        }

        <View style={style.pointsRow}>
          {offer.feather_points != 0 ? (
            <View style={style.redeemPoint}>
              <Imageview
                url={Images.AppOffer}
                style={{
                  marginRight: 5,
                  width: 15,
                  height: 15,
                }}
                imageType={'local'}
                resizeMode={'contain'}
              />

              <Text
                style={{
                  fontFamily: Fonts.android_regular,
                  color: Colors.black,
                  fontSize: Fonts.fs_13,
                }}>
                {offer.feather_points.toString() + ' fts'}
              </Text>
            </View>
          ) : null}

          {offer.venue_points != 0 ? (
            <View style={style.redeemPoint}>
              <Imageview
                url={Images.VenueOffer}
                style={{
                  marginRight: 5,
                  width: 15,
                  height: 15,
                }}
                imageType={'local'}
                resizeMode={'contain'}
              />
              <Text
                style={{
                  fontFamily: Fonts.android_regular,
                  color: Colors.black,
                  fontSize: Fonts.fs_13,
                }}>
                {offer.venue_points.toString() + ' pts'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Textview text={offer.name} style={[style.title, style.px_5]} lines={1} />

      <Textview
        text={offer.description}
        style={[style.desc, style.px_5]}
        lines={2}
      />

      {!offer.redeemed ? (
        <View style={[style.actionBtnsContainer, style.px_5]}>
          <TouchableOpacity
            onPress={() => toggleOffer(offer)}
            style={{ flex: 1 }}>
            <BoxView
              cardStyle={{
                backgroundColor: Colors.white,
                padding: 0,
                justifyContent: 'center',
                marginHorizontal: 2,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.android_regular,
                  color: Colors.light_blue,
                  fontSize: Fonts.fs_8,
                  textAlign: 'center',
                }}>
                {offer.favourite ? 'Remove' : 'Save'}
              </Text>
            </BoxView>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => redeemOffer(offer)}
            style={{ flex: 1 }}>
            <BoxView
              cardStyle={{
                backgroundColor: !offer.redeemed
                  ? Colors.primary_color_orange
                  : Colors.grey,
                padding: 0,
                justifyContent: 'center',
                marginHorizontal: 2,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.android_regular,
                  color: Colors.white,
                  fontSize: Fonts.fs_8,
                  textAlign: 'center',
                }}>
                {'Redeem Now'}
              </Text>
            </BoxView>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', marginVertical: 15, paddingHorizontal: 10 }}>
          <TouchableOpacity
            onPress={() => showQrcode()}
            style={{
              backgroundColor: Colors.grey,
              paddingHorizontal: Platform.OS == 'ios' ? 0 : 7,
              flex: 1,
              height: isIos ? 30 : 25,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
            }}>
            <Text
              style={{
                fontFamily: Fonts.android_regular,
                color: Colors.white,
                fontSize: Fonts.fs_8,
              }}>
              {'Show QR Code'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </BoxView>
  );
};

const { width } = Dimensions.get('window');

const style = StyleSheet.create({
  item: {
    flex: 1, // Ensures equal width
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 2,
    alignItems: 'center',
    maxWidth: (width / 2) - 15
  },
  redeemPoint: {
    flexDirection: 'row',
    height: 25,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  pointsRow: {
    flexDirection: 'row',
    height: 25,
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 2,
    paddingHorizontal: 2,
  },
  py_0: {
    paddingVertical: 0,
  },
  desc: {
    fontFamily: Fonts.android_regular,
    color: Colors.light_grey,
    fontSize: Fonts.fs_10,
    marginTop: isIos ? 5 : 0,
  },
  title: {
    fontFamily: Fonts.android_medium,
    color: Colors.black,
    fontSize: Fonts.fs_18,
    marginTop: isIos ? 8 : 4,
  },
  px_5: {
    paddingHorizontal: 5,
  },
  actionBtnsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
});

export default OfferItem;
