import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import BoxView from './BoxView';
import Textview from './Textview';
import { Offer } from '../types/Venue';
import { useEffect, useState } from 'react';
import Request from '../services/Request';
import Toast from 'react-native-toast-message';
import Imageview from './Imageview';
import Images from '../constants/Images';
import ScreenProps from '../types/ScreenProps';
import RootStackParamList from '../types/RootStackParamList';
import { isIos } from '../constants/IsPlatform';
import FallbackSvg from './FallbackSvg';
import MtToast from '../constants/MtToast';
import Chips from './Chips';
import ShadowCard from './ShadowCard';

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
        MtToast.error(error.message)
      }
    });
  };

  const showQrcode = () => {
    console.log(offer.last_redeem)

    props.navigation?.navigate('QrPreview', { 
      data: JSON.stringify({ redeem_id: offer.last_redeem?.id }),
      coupon: offer.last_redeem?.coupon_code || '' 
    });
  }

  return (
    <BoxView cardStyle={style.item} bodyStyle={[style.py_0, {
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1
    }]}>
      <View>
        {offer.images?.length > 0 ?
          <Imageview
            url={offer.images[offer.images.length - 1].medium_image}
            style={{
              height: isIos ? 100 : 80,
              borderRadius: 5,
            }}
            imageStyle={{ borderRadius: 5 }}
            imageType={'server'}
            resizeMode={'cover'}
          /> :
          <FallbackSvg overlayStyle={{borderRadius: 5}} wrapperStyle={{ marginTop: 0 }} androidHeight={80} iosHeight={100} />
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
                style={style.pointText}>
                {(offer.feather_points ? offer.feather_points?.toString() : 0) + ' fts'}
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
                style={style.pointText}>
                {(offer.venue_points ? offer.venue_points?.toString() : 0) + ' pts'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Textview text={offer.name} style={[style.title, style.px_5]} lines={1} />

      <Chips items={[{ name: offer.venue?.name || '' }]}  containerStyle={{ paddingHorizontal: 3}}/>

      <Textview
        text={offer.description}
        style={[style.desc, style.px_5]}
        lines={2}
      />


      {(!offer.last_redeem || offer.last_redeem?.expired_at || offer.last_redeem?.confirmed) ?

        <View style={[style.actionBtnsContainer, {paddingHorizontal: 3}]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => toggleOffer(offer)}
            style={{ flex: 1 }}>
            <ShadowCard
              style={style.shadowButton}>
              <Text
                style={[style.buttonText, { color: Colors.venueIconColor }]}>
                {offer.favourite ? 'Remove' : 'Save'}
              </Text>
            </ShadowCard>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => offer.expire_at ? {} : redeemOffer(offer)}
            style={{ flex: 1 }}>
            <ShadowCard
              style={[style.shadowButton, {
                backgroundColor: (!offer.expire_at)
                  ? Colors.primary_color_orange
                  : Colors.grey,
              }]}>
              <Text
                style={style.buttonText}>
                {offer.expire_at ? 'Expired' : 'Redeem'}
              </Text>
            </ShadowCard>
          </TouchableOpacity>
        </View>
        :
        <View style={{ marginVertical: 5, paddingHorizontal: 3 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => offer.last_redeem?.expired_at ? {} : showQrcode()}
            style={[style.touchableBtn, {
              backgroundColor: (offer.last_redeem.expired_at || offer.last_redeem.confirmed) ? Colors.grey : Colors.primary_color_orange
            }]}>
            <Text
              style={style.buttonText}>
              {offer.last_redeem?.expired_at ? 'Expired' : 'Show QR/Coupon Code'}
            </Text>
          </TouchableOpacity>

          <View style={{
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            <Text style={{ fontSize: Fonts.fs_8, fontFamily: Fonts.medium }}>{'Valid Till: '}</Text>
            <Text style={{ fontSize: Fonts.fs_8 }}>{offer.last_redeem.valid_till}</Text>
          </View>
        </View>
      }

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
    borderRadius: 5,
    padding: 2,
    alignItems: 'center',
    maxWidth: (width / 2) - 15
  },
  redeemPoint: {
    flexDirection: 'row',
    height: 23,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    paddingHorizontal: 5,
    borderColor: Colors.whitesmoke,
    borderWidth: 0.5
  },
  pointText: {
    fontFamily: Fonts.regular,
    color: Colors.black,
    fontSize: Fonts.fs_11,
  },
  pointsRow: {
    flexDirection: 'row',
    height: 25,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 2,
    paddingHorizontal: 4,
    zIndex: 1,
    gap: 3,
    width: '100%'
  },
  py_0: {
    paddingVertical: 0,
  },
  desc: {
    fontFamily: Fonts.regular,
    color: Colors.light_grey,
    fontSize: Fonts.fs_11,
    marginTop: isIos ? 5 : 3,
  },
  title: {
    fontFamily: Fonts.medium,
    color: Colors.black,
    fontSize: Fonts.fs_14,
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
  buttonText: {
    fontFamily: Fonts.regular,
    color: Colors.white,
    fontSize: Fonts.fs_10,
    textAlign: 'center',
  },
  shadowButton: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    marginHorizontal: 2,
    paddingHorizontal: 5,
    paddingVertical: 7,
  },
  touchableBtn: {
    paddingHorizontal: isIos ? 0 : 7,
    flex: 1,
    height: isIos ? 30 : 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  }
});

export default OfferItem;
