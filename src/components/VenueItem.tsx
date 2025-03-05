import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import Textview from './Textview';
import Venue from '../types/Venue';
import Request from '../services/Request';
import Imageview from './Imageview';
import Images from '../constants/Images';
import IsVenueOpened from '../constants/IsVenueOpened';
import { isIos } from '../constants/IsPlatform';
import MtToast from '../constants/MtToast';
import Utils from '../services/Util';

type VenueItem = {
  venue: Venue;
  onToggleVenue: (venue: Venue) => void;
  openVenuePage: (venue: Venue) => void;
  setIsLoading: (loader: boolean) => void;
};

const VenueItem: React.FC<VenueItem> = ({
  venue,
  onToggleVenue,
  openVenuePage,
  setIsLoading,
}) => {

  const toggleVenue = (venue: Venue) => {
    setIsLoading(true);

    Request.toggleVenue(venue.id, (success, error) => {
      setIsLoading(false);
      console.log(success, error);
      if (success) {
        const updatedVenue = {
          ...venue,
          favourite: !venue.favourite,
        };

        onToggleVenue(updatedVenue);
      } else {
        MtToast.error(error.message);
      }
    });
  };

  const venueSubTitle =
    (!Utils.isEmpty(venue.suburb) ? venue.suburb : '') +
    ((!Utils.isEmpty(venue.suburb) && !Utils.isEmpty(venue?.notice)) ? ' | ' : '') +
    (!Utils.isEmpty(venue?.notice) ? venue.notice : '');

  const tags = (venue.tags?.length || 0) > 0 ? venue.tags?.map(t => t.name).join(' | ') : ''

  const source = venue.images.length > 0 ? venue.images[0].file_name : Images.uri(Images.placeholder);

  return (
    <TouchableOpacity
      onPress={() => openVenuePage(venue)}
      style={{
        width: '46%',
        height: isIos ? 190 : 160,
        marginHorizontal: '2%',
        marginTop: 15,
      }}>
      <ImageBackground
        source={{ uri: source }}
        imageStyle={{ opacity: venue.status == 0 ? 0.1 : 0.45 }}
        resizeMode={'stretch'}
        style={{
          width: '100%',
          height: isIos ? 190 : 160,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}>
        <View
          style={{
            position: 'relative',
            height: isIos ? 190 : 160,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>

            {!IsVenueOpened(venue) ? (
              <View
                style={{
                  width: '30%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Imageview
                  url={Images.sleepy}
                  style={{
                    width: 40,
                    height: 40,
                    resizeMode: 'cover',
                    alignSelf: 'flex-start'
                  }}
                />
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: Fonts.fs_10
                  }}>
                  Closed
                </Text>
              </View>
            ) : (
              null
            )}

            <TouchableOpacity
              onPress={() => toggleVenue(venue)}
              style={{ flex: 1, padding: 7 }}>
              <Imageview
                url={Images.favourite}
                style={{
                  width: isIos ? 27 : 22,
                  height: isIos ? 27 : 22,
                  resizeMode: 'cover',
                  alignSelf: 'flex-end'
                }}
                imageType={'local'}
                tintColor={
                  !venue.favourite ? Colors.grey : Colors.primary_color_orange
                }
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 5, marginTop: 5 }}>
            <Textview
              lines={2}
              text={venue.name}
              style={{
                fontFamily: Fonts.android_medium,
                color: Colors.white,
                fontSize: Fonts.fs_14,
                marginHorizontal: 5,
              }}
            />

            {venueSubTitle != '' ? <Textview
              lines={2}
              text={venueSubTitle}
              style={{
                fontFamily: Fonts.android_regular,
                color: Colors.white,
                fontSize: Fonts.fs_11,
                marginHorizontal: 5,
                marginTop: isIos ? 3 : 0,
              }}
            />: null}

            {(venue.tags?.length || 0) > 0 ?
              <Textview
                lines={1}
                text={tags || ''}
                style={{
                  fontFamily: Fonts.android_regular,
                  color: Colors.whitesmoke,
                  fontSize: Fonts.fs_11,
                  marginHorizontal: 5,
                  marginTop: isIos ? 3 : 0,
                }}
              />
              : null
            }
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}>
            {
              <View>
                {venue.boosted ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: 6,
                    }}>
                    <Imageview
                      url={Images.star}
                      style={{
                        width: 13,
                        height: 13,
                        resizeMode: 'contain',
                        marginTop: isIos ? 14 : 12,
                        marginLeft: 5,
                      }}
                      imageType={'local'}
                    />

                    <Textview
                      text={'Boosted'}
                      style={{
                        fontFamily: 'regular',
                        color: Colors.white,
                        fontSize: Fonts.fs_11,
                        marginHorizontal: 5,
                        marginTop: isIos ? 14 : 12,
                      }}
                    />
                  </View>
                ) : (venue?.checkins_count || 0) > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: 6,
                    }}>
                    <Imageview
                      url={Images.hot}
                      style={{
                        width: 13,
                        height: 13,
                        resizeMode: 'contain',
                        marginTop: isIos ? 14 : 12,
                        marginLeft: 5,
                      }}
                      imageType={'local'}
                    />
                    <Textview
                      text={'Hot'}
                      style={{
                        fontFamily: 'regular',
                        color: Colors.white,
                        fontSize: Fonts.fs_11,
                        marginHorizontal: 5,
                        marginTop: isIos ? 14 : 12,
                      }}
                    />
                  </View>
                ) : null}
              </View>
            }
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({});

export default VenueItem;
