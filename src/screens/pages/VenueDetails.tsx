import { useCallback, useEffect, useState } from 'react';
import ScreenProps from '../../types/ScreenProps';
import Venue, { Imageable } from '../../types/Venue';
import Loader from '../../components/Loader';
import {
  Dimensions,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import Imageview from '../../components/Imageview';
import Images from '../../constants/Images';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import NoData from '../../components/NoData';
import VenueInfo from './inc/VenueInfo';
import VenueOffers from './inc/VenueOffers';
import Request from '../../services/Request';
import Toast from 'react-native-toast-message';
import Icon from '@react-native-vector-icons/fontawesome6';
import VirtualizedList from '../../components/VirtualizedList';
import MtToast from '../../constants/MtToast';
import { getCurrentLocation } from '../../services/GetCurrentLocation';
import { isIos } from '../../constants/IsPlatform';
import FallbackSvg from '../../components/FallbackSvg';
import Chips from '../../components/Chips';
import WalletService from '../../services/WalletService';
import { CSS } from '../../constants/CSS';
import Utils from '../../services/Utils';

const VenueDetails: React.FC<ScreenProps<'VenueDetails'>> = props => {
  const { route } = props;

  const [venue, setVenue] = useState<Venue>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [informationTab, setInformationTab] = useState<boolean>(true);
  const [offersTab, setOffersTab] = useState<boolean>(false);
  const { updateWalletBalances } = WalletService();

  useEffect(() => {
    if (route?.params?.venue_id) {
      // Fetch new venue data here
      loadVenue(route?.params?.venue_id);
    }
  }, [route?.params?.venue_id]);

  const loadVenue = (venue_id: any) => {
    setIsLoading(true);

    Request.fetch_venue(venue_id, (success, error) => {
      setIsLoading(false);

      if (success) {
        setVenue(success.data);
        console.log('venue>:> ', success.data)

      } else {
        MtToast.error(error.message);
      }
    });
  };

  const handleScroll = (event: any) => {
    let yOffset = event.nativeEvent.contentOffset.x;
    let contentHeight = event.nativeEvent.layoutMeasurement.width;
    let value = yOffset / contentHeight.toFixed(0);

    //console.log(value.toFixed(0));
  };


  const toggleVenue = (venue: Venue) => {
    setIsLoading(true);

    Request.toggleVenue(venue.id, (success, error) => {
      setIsLoading(false);
      console.log(success, error);
      if (success) {
        setVenue((prev) => {
          if (prev) {
            return { ...prev, favourite: !prev.favourite };
          }
          return prev;
        });
      } else {
        MtToast.error(error.message)
      }
    });
  };

  const checkin = async () => {
    if (!venue) {
      return MtToast.error('Please refresh the page..');
    }

    if (venue.checkedin_count) {
      // already checkedin .. now get the remaining hours and minutes for the next checkin
      return checkinApi();
    }

    props.navigation?.navigate('QrScanner', { venue });
  }

  const checkinApi = async () => {
    if (!venue) {
      return MtToast.error('Venue not found to check-in, please refresh the page!');
    }

    setIsLoading(true);

    try {
      const currentLocation = await getCurrentLocation();

      if (currentLocation) {

        Request.checkin({
          venue_id: venue?.id,
          lat: currentLocation.latitude,
          long: currentLocation.longitude

        }, (success, error) => {
          setIsLoading(false);

          if (success) {
            MtToast.success(success.message)
            updateWalletBalances();

          } else {
            MtToast.error(error.message)

          }
        })

      } else {
        throw new Error('location not found!')
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error)
      MtToast.error('Failed to detect your current location, try sometime later!');
    }
  }

  const showOffersTab = () => {
    setOffersTab(true);
    setInformationTab(false);
  }
  const showInformationTab = () => {
    setOffersTab(false);
    setInformationTab(true);
  }

  const locationBtn = (lat: string, lng: string, label: string) => {

    const scheme = isIos ? 'maps:' : 'geo:';
    const query = isIos
      ? `daddr=${lat},${lng}&dirflg=d`
      : `?q=${lat},${lng}(${label})&mode=d`;

    const url = scheme + (isIos ? '?' : '') + query;
    Linking.openURL(url);
  }

  const renderItem_banner = useCallback(
    ({ item, index }: { item: Imageable, index: number }) => (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          alignItems: 'center',
          borderRadius: 10,
          overflow: 'hidden',
          marginRight: 5,
        }}>
        <Imageview
          url={item.large_image}
          style={{
            width: (Dimensions.get('window').width * 92) / 100,
            height: isIos ? 380 : 320,
            borderRadius: 10
          }}
          imageType={'server'}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    ),
    [venue?.images],
  );

  const keyExtractor_banner = (item: Imageable, index: number) => index.toString();


  return (
    <View
      style={{
        backgroundColor: Colors.white,
        flex: 1,
        paddingHorizontal: 15,
      }}>
      {venue ? (
        <VirtualizedList>
          <View
            style={{
              marginTop: isIos ? 50 : 20,
              position: 'relative',
            }}>
            {/** Start header */}
            <View
              style={{
                width: '100%',
                position: 'absolute',
                zIndex: 10,
                top: 0,
                right: 0,
                left: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: isIos ? 10 : 10,
                  paddingTop: isIos ? 15 : 10,
                  paddingBottom: isIos ? 10 : 10,
                }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => props.navigation?.goBack()}>
                  <Imageview
                    style={{
                      width: isIos ? 37 : 30,
                      height: isIos ? 37 : 30,
                    }}
                    imageType={'local'}
                    url={Images.blackBack}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => toggleVenue(venue)}>
                  <Icon
                    name="heart"
                    style={{
                      fontSize: isIos ? Fonts.fs_30 : Fonts.fs_25,
                      color: Colors.black
                    }}
                    iconStyle={venue?.favourite ? 'solid' : 'regular'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/** End header */}

            {venue.images.length > 0 ?
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={venue?.images}
                style={{ flexGrow: 0 }}
                renderItem={renderItem_banner}
                keyExtractor={keyExtractor_banner}
                snapToAlignment={'start'}
                viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
                pagingEnabled={true}
                decelerationRate={'normal'}
                disableIntervalMomentum
                onScroll={event => handleScroll(event)}
              /> :

              <FallbackSvg wrapperStyle={{ marginTop: 0 }} />
            }
          </View>

          <View
            style={{
              flex: 1,
              marginTop: isIos ? 15 : 10,
              marginBottom: 100,
            }}>
            <Textview
              text={venue?.name || ''}
              style={{
                fontSize: Fonts.fs_25,
                color: Colors.black,
                fontFamily: Fonts.medium,
              }}
            />

            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                width: Utils.DEVICE_WIDTH - 50,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginVertical: isIos ? 10 : 5
              }}
              onPress={() => { locationBtn(venue.lat, venue.lon, venue.name) }}>
              <Icon
                name="location-dot"
                iconStyle="solid"
                size={Fonts.fs_16}
              />

              <Textview
                text={venue?.location || ''}
                style={{
                  fontSize: Fonts.fs_14,
                  color: Colors.black,
                  fontFamily: Fonts.medium
                }}
                lines={2}
              />
            </TouchableOpacity>

            {/* Test for scrollable event if made new changes to chips */}
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
              {venue.tags?.length ?
                <Chips items={[...venue.tags, ...(venue.dietary ?? [])]} /> : null}
            </View>

            <View
              style={{
                flex: 1,
                marginTop: isIos ? 15 : 10
              }}>
              <Textview
                text={'Important Notice'}
                style={{
                  fontSize: Fonts.fs_15,
                  color: Colors.black,
                  fontFamily: Fonts.medium,
                }}
              />

              <Textview
                text={venue?.notice || 'No important notices at the moment. Stay tuned for updates!'}
                style={{
                  fontSize: Fonts.fs_13,
                  color: Colors.light_grey,
                  fontFamily: Fonts.regular,
                  marginTop: isIos ? 10 : 3,
                }}
                lines={4}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: isIos ? 15 : 8,
              }}></View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => showInformationTab()}
                style={{
                  flex: 1,
                  paddingVertical: isIos ? 15 : 10,
                  paddingHorizontal: 10,
                  backgroundColor: informationTab
                    ? Colors.primary_color_orange
                    : Colors.whitesmoke,
                }}>
                <Text
                  style={{
                    fontSize: Fonts.fs_15,
                    color: informationTab ? Colors.white : Colors.grey,
                    textAlign: 'center',
                    fontFamily: Fonts.medium,
                  }}>
                  {'Information'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => showOffersTab()}
                style={{
                  flex: 1,
                  paddingVertical: isIos ? 15 : 10,
                  paddingHorizontal: 10,
                  backgroundColor: offersTab
                    ? Colors.primary_color_orange
                    : Colors.whitesmoke,
                }}>
                <Text
                  style={{
                    fontSize: Fonts.fs_15,
                    fontWeight: 600,
                    color: offersTab ? Colors.white : Colors.grey,
                    textAlign: 'center',
                    fontFamily: Fonts.medium,
                  }}>
                  {'Offers'}
                </Text>
              </TouchableOpacity>
            </View>

            {informationTab ? (
              <VenueInfo {...props} venue={venue} setOffersTab={showOffersTab} />
            ) : (
              <VenueOffers {...props} venue={venue} setLoader={setIsLoading} />
            )}
          </View>
        </VirtualizedList>
      ) : (
        <NoData isLoading={isLoading} />
      )}

      {venue ? (
        informationTab ? (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: 'white',
              bottom: 0,
              right: 0,
              left: 0,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => venue.checkedin_count ? {} : checkin()}
              style={{ flex: 1 }}
              disabled={venue.checkedin_count ? true : false}
            >
              <Text
                style={{
                  fontSize: Fonts.fs_18,
                  color: Colors.white,
                  fontFamily: Fonts.medium,
                  textAlign: 'center',
                  backgroundColor: venue.checkedin_count ? Colors.orange_shade1 : Colors.primary_color_orange,
                  paddingVertical: isIos ? 20 : 17,
                  borderRadius: 10,
                }}>
                {venue.checkedin_count ? 'Checked-In' : 'Check-In'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null
      ) : null}

      <Loader isLoading={isLoading} />
    </View>
  );
};

export default VenueDetails;
