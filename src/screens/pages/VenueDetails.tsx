import { useCallback, useEffect, useState } from 'react';
import ScreenProps from '../../types/ScreenProps';
import Venue, { Imageable } from '../../types/Venue';
import Loader from '../../components/Loader';
import {
  Dimensions,
  FlatList,
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
import Item from '../../types/RenderedItem';
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

const VenueDetails: React.FC<ScreenProps<'VenueDetails'>> = props => {
  const [venue_id, setVenueId] = useState<number>(
    props.route?.params.venue_id || 1,
  );

  const [venue, setVenue] = useState<Venue>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [informationTab, setInformationTab] = useState<boolean>(true);
  const [offersTab, setOffersTab] = useState<boolean>(false);

  useEffect(() => {
    loadVenue();
  }, []);

  const loadVenue = () => {
    setIsLoading(true);

    Request.fetch_venue(venue_id, (success, error) => {
      setIsLoading(false);

      if (success) {
        setVenue(success.data);

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

  const renderItem_banner = useCallback(
    ({ item, index }: { item: Imageable, index: number }) => (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          alignItems: 'center',
          marginTop: isIos ? 30 : 20,
          borderRadius: 10,
          overflow: 'hidden',
          marginRight: 5,
        }}>
        <Imageview
          url={item.file_name}
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
        Toast.show({
          type: 'MtToastError',
          text1: error.message,
          position: 'bottom',
        });
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
      return MtToast.error('Venue not found to checkin, please refresh the page!');
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
              marginTop: isIos ? 20 : -5,
              position: 'relative',
            }}>
            {/** Start header */}
            <View
              style={{
                width: '100%',
                position: 'absolute',
                zIndex: 999,
                top: 19,
                right: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: isIos ? 5 : 10,
                  paddingTop: isIos ? 15 : 10,
                  paddingBottom: isIos ? 10 : 10,
                }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => props.navigation?.goBack()}>
                  <Imageview
                    style={{
                      width: isIos ? 37 : 30,
                      height: isIos ? 37 : 30,
                    }}
                    imageType={'local'}
                    url={Images.whiteBack}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleVenue(venue)}>
                  <Icon
                    name="heart"
                    style={{
                      fontSize: 25,
                      color: Colors.white
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

              <FallbackSvg />
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
                fontFamily: Fonts.android_medium,
              }}
            />
            <TouchableOpacity
              onPress={() => { props.navigation?.navigate('Map', { venues: [venue] }) }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginHorizontal: isIos ? 0 : 0,
                  width: '90%',
                }}>
                <Icon
                  name="location-dot"
                  iconStyle="solid"
                  style={{
                    width: 15,
                    height: 15,
                  }}
                />

                <Textview
                  text={venue?.location || ''}
                  style={{
                    fontSize: Fonts.fs_13,
                    color: Colors.black,
                    fontFamily: 'medium',
                    //marginLeft: 5,
                  }}
                />
              </View>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                marginTop: isIos ? 15 : 5
              }}>
              <Textview
                text={'Important Notice'}
                style={{
                  fontSize: Fonts.fs_15,
                  color: Colors.black,
                  fontFamily: 'medium',
                }}
              />

              <Textview
                text={venue?.notice || ''}
                style={{
                  fontSize: Fonts.fs_13,
                  color: Colors.light_grey,
                  fontFamily: Fonts.android_regular,
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
                    fontFamily: Fonts.android_medium,
                  }}>
                  {'Information'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
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
                    fontFamily: Fonts.android_medium,
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
        <NoData />
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
              onPress={() => checkin()}
              style={{ flex: 1 }}
            >
              <Text
                style={{
                  fontSize: Fonts.fs_18,
                  color: Colors.white,
                  fontFamily: 'medium',
                  textAlign: 'center',
                  backgroundColor: venue.checkedin_count ? Colors.orange_shade1 : Colors.primary_color_orange,
                  paddingVertical: isIos ? 20 : 17,
                  borderRadius: 10,
                }}>
                {venue.checkedin_count ? 'Checkedin' : 'Checkin'}
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
