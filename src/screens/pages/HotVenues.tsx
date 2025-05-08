import { useEffect, useState } from 'react';
import ScreenProps from '../../types/ScreenProps';
import Loader from '../../components/Loader';
import {
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CSS } from '../../constants/CSS';
import Imageview from '../../components/Imageview';
import Images from '../../constants/Images';
import { Fonts } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import NoData from '../../components/NoData';
import Request from '../../services/Request';
import Toast from 'react-native-toast-message';
import Venue from '../../types/Venue';
import VenueItem from '../../components/VenueItem';
import VirtualizedList from '../../components/VirtualizedList';
import { useSelector } from 'react-redux';
import { StoreStates } from '../../store/store';
import { isIos } from '../../constants/IsPlatform';
import Utils from '../../services/Utils';

const HotVenues: React.FC<ScreenProps<'Venues'>> = props => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearchText] = useState('');
  const [venues, setVenues] = useState<Array<Venue>>([]);

  const [refreshing, setRefreshing] = useState(false);
  const location = useSelector((state: StoreStates) => state.location);

  useEffect(() => {
    fetch_venues();
  }, [location, search]);

  const fetch_venues = async () => {
    setIsLoading(true);

    Request.fetch_hot_venues({ ...location, keywords: search }, (success, error) => {
      setIsLoading(false);
      setRefreshing(false);

      if (error) {
        Toast.show({
          type: 'MtToastError',
          text1: error.message,
          position: 'bottom',
        });
      } else {
        setVenues(success.data);
      }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    fetch_venues();
  };

  const openVenuePage = (item: Venue) => {
    props.navigation?.navigate('VenueDetails', { venue_id: item.id });
  };

  const scanQR = async () => {
    props.navigation?.navigate('QrScanner');
  };

  const nearbyVenues = async () => {
    props.navigation?.navigate('Map');
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader isLoading={isLoading} />

      <VirtualizedList>
        <View
          style={{
            flexDirection: 'row',
            marginTop: isIos ? 13 : 10,
            marginHorizontal: isIos ? 15 : 15,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>

          <View
            style={{
              flexDirection: 'row',
              width: isIos
                ? (Dimensions.get('window').width * 70) / 100
                : (Dimensions.get('window').width * 73) / 100,
              height: isIos ? 50 : 40,
              backgroundColor: Colors.whitesmoke,
              borderRadius: 25,
              alignItems: 'center',
              paddingHorizontal: 15,
            }}>
            <Imageview
              url={Images.search}
              style={{
                width: isIos ? 20 : 18,
                height: isIos ? 20 : 18,
                resizeMode: 'cover',
              }}
              imageType={'local'}
            />

            <TextInput
              style={{
                flex: 1,
                color: Colors.black,
                paddingLeft: 20,
                fontSize: Fonts.fs_14,
                fontFamily: Fonts.regular,
              }}
              placeholder="Search here"
              placeholderTextColor={Colors.light_grey}
              value={search}
              onChangeText={value => setSearchText(value)}
            />
          </View>

          <View style={CSS.home_mapicon}>
            <TouchableOpacity onPress={scanQR} activeOpacity={0.9}>
              <Imageview
                url={Images.scanner}
                style={{
                  width: isIos ? 40 : 37,
                  height: isIos ? 40 : 37,
                  resizeMode: 'cover',
                  alignSelf: 'flex-start',
                }}
                imageType={'local'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={nearbyVenues} activeOpacity={0.9}>
              <Imageview
                style={{
                  width: isIos ? 40 : 35,
                  height: isIos ? 40 : 35,
                  alignSelf: 'flex-start',
                }}
                imageType={'local'}
                url={Images.location}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          {venues.length > 0 ? (
            <FlatList
              horizontal={false}
              numColumns={2}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={venues}
              style={{
                marginHorizontal: '2%',
                marginTop: isIos ? 2 : 0,
                paddingBottom: isIos ? 100 : 65,
              }}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => (
                <VenueItem
                  venue={item}
                  setIsLoading={setIsLoading}
                  openVenuePage={openVenuePage}
                  onToggleVenue={updatedVenue => {
                    setVenues(prevVenues =>
                      prevVenues.map(venue =>
                        venue.id === updatedVenue.id ? updatedVenue : venue,
                      ),
                    );
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <View style={{ height: Utils.DEVICE_HEIGHT / 2 }}>
              <NoData isLoading={isLoading} />
            </View>
          )}
        </View>
      </VirtualizedList>
    </View>
  );
};

export default HotVenues;
