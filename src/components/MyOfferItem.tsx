import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import BoxView from './BoxView';
import Textview from './Textview';
import Imageview from './Imageview';
import Images from '../constants/Images';
import ScreenProps from '../types/ScreenProps';
import RootStackParamList from '../types/RootStackParamList';
import { isIos } from '../constants/IsPlatform';
import FallbackSvg from './FallbackSvg';
import Chips from './Chips';
import RedeemedOffers from '../types/RedeemedOffers';
import Utils from '../services/Utils';

type MyOfferItem = {
  redeemedOffer: RedeemedOffers,
  onLoader: (isLoading: boolean) => void,
};

const MyOfferItem: React.FC<ScreenProps<keyof RootStackParamList> & MyOfferItem> = (props) => {
  const { redeemedOffer, onLoader } = props;
  const images = redeemedOffer.offer?.images;
  const offer = redeemedOffer.offer;

  const showQrcode = () => {
    console.log({ redeemedOffer })

    props.navigation?.navigate('QrPreview', { 
      data: JSON.stringify({ redeem_id: redeemedOffer?.id }),
      coupon: redeemedOffer?.coupon_code || '' 
    });
  }

  return (
    <BoxView cardStyle={style.item} bodyStyle={[style.py_0, {
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1
    }]}>
      <View>
        {images?.length ?
          <Imageview
            url={images[images?.length - 1].medium_image}
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
          {offer?.feather_points != 0 ? (
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
                {(offer?.feather_points ? offer?.feather_points?.toString() : 0) + ' fts'}
              </Text>
            </View>
          ) : null}

          {offer?.venue_points != 0 ? (
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
                {(offer?.venue_points ? offer.venue_points?.toString() : 0) + ' pts'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Textview text={offer?.name || ''} style={[style.title, style.px_5]} lines={1} />

      <Chips items={[{ name: offer?.venue?.name || '' }]} containerStyle={{ paddingHorizontal: 3}} />

      <Textview
        text={offer?.description || ''}
        style={[style.desc, style.px_5]}
        lines={2}
      />

      <View style={{ marginVertical: 5, paddingHorizontal: 3 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => (redeemedOffer.expired_at || redeemedOffer.confirmed) ? {} : showQrcode()}
          style={[style.touchableBtn, {
            backgroundColor: (redeemedOffer.expired_at || redeemedOffer.confirmed) ? Colors.grey : Colors.primary_color_orange,
          }]}>
          <Text
            style={style.buttonText}>
            {redeemedOffer.expired_at ? 'Expired' : (redeemedOffer.confirmed ? 'Claimed & Used' : 'Show QR/Coupon Code')}
          </Text>
        </TouchableOpacity>
        {(!redeemedOffer.confirmed || redeemedOffer.expired_at) && <View style={{
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
          <Text style={{ fontSize: Fonts.fs_8, fontFamily: Fonts.medium }}>{'Valid Till: '}</Text>
          <Text style={{ fontSize: Fonts.fs_8 }}>{redeemedOffer.valid_till ?? redeemedOffer.expired_at ?? ''}</Text>
        </View>}
      </View>

    </BoxView>
  );
};

const style = StyleSheet.create({
  item: {
    flex: 1, // Ensures equal width
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 2,
    alignItems: 'center',
    maxWidth: (Utils.DEVICE_WIDTH / 2) - 15
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

export default MyOfferItem;
