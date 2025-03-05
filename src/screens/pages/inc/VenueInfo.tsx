import { FlatList, Platform, Text, TouchableOpacity, View } from 'react-native';
import Venue, { Amenity } from '../../../types/Venue';
import ScreenProps from '../../../types/ScreenProps';
import Textview from '../../../components/Textview';
import { Fonts } from '../../../constants/Fonts';
import { Colors } from '../../../constants/Colors';
import Imageview from '../../../components/Imageview';
import { useCallback, useEffect, useState } from 'react';
import Images from '../../../constants/Images';
import BoxView from '../../../components/BoxView';
import Utils from '../../../services/Util';
import { useSelector } from 'react-redux';
import { StoreStates } from '../../../store/store';
import NearestVenues from '../../../components/NearestVenues';
import { isIos } from '../../../constants/IsPlatform';
import WalletService from '../../../services/WalletService';

type VenueInfoProps = { venue: Venue, setOffersTab: (tab: boolean) => void };

const VenueInfo: React.FC<
  ScreenProps<'VenueDetails'> & VenueInfoProps
> = props => {
  const { venue, setOffersTab } = props;
  const [seeAllDays, setSeeAllDays] = useState(false);
  const { updateWalletBalances } = WalletService();
  const wallet = useSelector((state: StoreStates) => state.wallet);
  const [balance_venue_points, setVenuePointsBalance] = useState<number>(0)

  useEffect(() => {
    updateWalletBalances();
  }, [])

  useEffect(() => {
    setVenuePointsBalance(wallet?.venue_wallets?.find(w => w?.vendor_id === venue?.user_id)?.balance_venue_points || 0)
  }, [wallet])
  

  const renderItem_amenity = useCallback(
    ({ item, index }: { item: Amenity; index: number }) => (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          alignItems: 'center',
          width: 80,
          borderWidth: 1,
          borderColor: '#dfe4fb',
          borderRadius: 10,
          overflow: 'hidden',
          padding: 10,
          marginRight: 15,
          backgroundColor: '#dfe4fb',
        }}>
        <Imageview
          url={item.icon}
          style={{
            width: 50,
            height: 50,
          }}
          imageType={'server'}
          resizeMode={'contain'}
          tintColor={'#3251e4'}
        />
        <Textview
          text={item.name}
          style={{
            fontFamily: Fonts.android_regular,
            color: '#3251e4',
            marginTop: 5,
            textAlign: 'center',
            fontSize: Fonts.fs_12,
          }}
          lines={1}
        />
      </TouchableOpacity>
    ),
    [venue.amenities],
  );

  const keyExtractor_amenity = (item: Amenity, index: number) =>
    index.toString();

  return (
    <View>
      <Textview
        text={'Description'}
        style={{
          fontSize: Fonts.fs_15,
          color: Colors.black,
          fontFamily: Fonts.android_medium,
          marginTop: isIos ? 24 : 15,
        }}
      />

      <Textview
        text={venue.description}
        style={{
          fontFamily: Fonts.android_regular,
          fontSize: Fonts.fs_13,
          color: Colors.light_grey,
          marginTop: isIos ? 10 : 3,
        }}
      />

      <View>
        <Textview
          text={'Opening Hours'}
          style={{
            fontSize: Fonts.fs_15,
            color: Colors.black,
            fontFamily: Fonts.android_medium,
            marginTop: isIos ? 24 : 15,
          }}
        />

        {venue.opening_hours?.map((hour, index) => (
          index < 2 || seeAllDays ?
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Textview
                text={hour.start_day}
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.black,
                  fontFamily: Fonts.android_regular,
                  marginTop: isIos ? 10 : 3,
                }}
              />
              {hour.status == 1 ? (
                <Textview
                  text={Utils.convertTo12HourFormat(hour.start_time) + ' - ' + Utils.convertTo12HourFormat(hour.end_time)}
                  style={{
                    fontSize: Fonts.fs_14,
                    color: Colors.black,
                    fontFamily: Fonts.android_regular,
                    marginTop: isIos ? 10 : 3,
                  }}
                />
              ) : (
                <Textview
                  text={'Closed'}
                  style={{
                    fontSize: Fonts.fs_14,
                    color: Colors.red,
                    fontFamily: Fonts.android_regular,
                    marginTop: isIos ? 10 : 3,
                  }}
                />
              )}
            </View> : null
        ))}

        <TouchableOpacity onPress={() => setSeeAllDays(!seeAllDays)} style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: Fonts.fs_15,
                color: Colors.light_blue,
                fontFamily: Fonts.android_regular,
              }}>
              {'See all'}
            </Text>
            <Imageview
              style={{
                marginLeft: 5,
                width: isIos ? 15 : 12,
                height: isIos ? 15 : 12,
              }}
              imageType={'local'}
              url={seeAllDays === false ? Images.blueDropdown : Images.dropUp}
              resizeMode={'contain'}
              tintColor={Colors.light_blue}
            />
          </View>
        </TouchableOpacity>
      </View>

      <BoxView
        cardStyle={{
          backgroundColor: Colors.white,
          paddingHorizontal: isIos ? 20 : 15,
          paddingVertical: isIos ? 10 : 10,
          marginTop: isIos ? 30 : 20,
        }}>
        <View>
          <Text
            style={{
              fontSize: Fonts.fs_15,
              color: Colors.black,
              fontFamily: Fonts.android_medium,
            }}>
            {'Available Points'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.black,
                  fontFamily: Fonts.android_regular,
                  marginTop: isIos ? 10 : 3,
                }}>
                {'Feather'}
              </Text>

              <Text
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.light_grey,
                  fontFamily: Fonts.android_regular,
                  marginTop: isIos ? 10 : 3,
                }}>
                {wallet.balance_feather_points + ' fts'}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.black,
                  fontFamily: Fonts.android_regular,
                  marginTop: isIos ? 10 : 3,
                }}>
                {'Venue'}
              </Text>

              <Text
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.light_grey,
                  fontFamily: Fonts.android_regular,
                  marginTop: isIos ? 10 : 3,
                }}>
                {balance_venue_points + ' pts'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => { setOffersTab(true) }}
              style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: Fonts.fs_13,
                  color: Colors.white,
                  fontFamily: Fonts.android_regular,
                  backgroundColor: Colors.primary_color_orange,
                  paddingVertical: isIos ? 10 : 7,
                  paddingHorizontal: 7,
                  borderRadius: 5,
                  width: 95,
                }}>
                {'Redeem Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BoxView>

      <Textview
        text={'Property Amenities'}
        style={{
          fontSize: Fonts.fs_15,
          color: Colors.black,
          fontFamily: Fonts.android_medium,
          marginTop: isIos ? 24 : 15,
        }}
      />
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={venue.amenities}
        style={{ flexGrow: 0, marginTop: isIos ? 18 : 15 }}
        renderItem={renderItem_amenity}
        keyExtractor={keyExtractor_amenity}
      />

      <NearestVenues venue={venue} />
    </View>
  );
};

export default VenueInfo;
