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
import Utils from '../../../services/Utils';
import { useSelector } from 'react-redux';
import { StoreStates } from '../../../store/store';
import NearestVenues from '../../../components/NearestVenues';
import { isIos } from '../../../constants/IsPlatform';
import WalletService from '../../../services/WalletService';
import ShadowCard from '../../../components/ShadowCard';
import { CSS } from '../../../constants/CSS';

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
            fontFamily: Fonts.regular,
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
        text={'About'}
        style={{
          fontSize: Fonts.fs_15,
          color: Colors.black,
          fontFamily: Fonts.medium,
          marginTop: isIos ? 24 : 15,
        }}
      />

      <Textview
        text={venue.description}
        style={{
          fontFamily: Fonts.regular,
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
            fontFamily: Fonts.medium,
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
                  fontFamily: Fonts.regular,
                  marginTop: isIos ? 10 : 3,
                }}
              />
              {hour.status == 1 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', width: 190 }}>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    fontSize: Fonts.fs_14,
                    color: Colors.black,
                    fontFamily: Fonts.regular
                  }}
                >
                  {hour.start_time}
                </Text>
                
                <Text style={{ textAlign: 'center' }}>{'-'}</Text>
                
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: Fonts.fs_14,
                    color: Colors.black,
                    fontFamily: Fonts.regular
                  }}
                >
                  {hour.end_time}
                </Text>
              </View>
              

              ) : (
                <Textview
                  text={'Closed'}
                  style={{
                    fontSize: Fonts.fs_14,
                    color: Colors.red,
                    fontFamily: Fonts.regular,
                    marginTop: isIos ? 10 : 3,
                  }}
                />
              )}
            </View> : null
        ))}

        <TouchableOpacity onPress={() => setSeeAllDays(!seeAllDays)} style={{ flex: 1, marginVertical: 13 }}>
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
                fontFamily: Fonts.regular,
              }}>
              {seeAllDays === false ? 'See all' : 'See less'}
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

      <ShadowCard style={{ marginHorizontal: 2 }}>
        <View>
          <Text
            style={{
              fontSize: Fonts.fs_15,
              color: Colors.black,
              fontFamily: Fonts.medium,
            }}>
            {'Available Points'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ width: 80 }}>
              <Text
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.black,
                  fontFamily: Fonts.regular,
                  marginTop: isIos ? 10 : 3,
                }}>
                {'Feather'}
              </Text>

              <Text
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.light_grey,
                  fontFamily: Fonts.regular,
                  marginTop: isIos ? 10 : 3,
                }}>
                {wallet.balance_feather_points + ' fts'}
              </Text>
            </View>

            <View style={{ width: 80 }}>
              <Text
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.black,
                  fontFamily: Fonts.regular,
                  marginTop: isIos ? 10 : 3,
                }}>
                {'Venue'}
              </Text>

              <Text
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.light_grey,
                  fontFamily: Fonts.regular,
                  marginTop: isIos ? 10 : 3,
                }}>
                {balance_venue_points + ' pts'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => { setOffersTab(true) }}
              style={{
                alignItems: 'flex-end',
                width: isIos ? 120 : 105
              }}>
              <Text
                style={{
                  fontSize: Fonts.fs_13,
                  color: Colors.white,
                  fontFamily: Fonts.regular,
                  backgroundColor: Colors.primary_color_orange,
                  paddingVertical: isIos ? 10 : 7,
                  paddingHorizontal: 7,
                  borderRadius: 5,
                }}>
                {'Redeem Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ShadowCard>

      <Textview
        text={'Property Amenities'}
        style={{
          fontSize: Fonts.fs_15,
          color: Colors.black,
          fontFamily: Fonts.medium,
          marginTop: isIos ? 24 : 15,
        }}
      />

      {venue.amenities.length > 0 ? <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={venue.amenities}
        style={{ flexGrow: 0, marginTop: isIos ? 18 : 15 }}
        renderItem={renderItem_amenity}
        keyExtractor={keyExtractor_amenity}
      /> :
        <Text>{'No amenity found!'}</Text>
      }

      <NearestVenues venue={venue} />
    </View>
  );
};

export default VenueInfo;
