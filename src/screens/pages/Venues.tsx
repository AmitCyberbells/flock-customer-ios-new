import { useCallback, useEffect, useState } from 'react';
import ScreenProps from '../../types/ScreenProps';
import DefaultCategories from '../../constants/DefaultCategories';
import Loader from '../../components/Loader';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CSS } from '../../constants/CSS';
import Imageview from '../../components/Imageview';
import Images from '../../constants/Images';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import { Colors } from '../../constants/Colors';
import NoData from '../../components/NoData';
import Item from '../../types/RenderedItem';
import Request from '../../services/Request';
import Venue from '../../types/Venue';
import VenueItem from '../../components/VenueItem';
import VirtualizedList from '../../components/VirtualizedList';
import { useSelector } from 'react-redux';
import { StoreStates } from '../../store/store';
import MtToast from '../../constants/MtToast';
import { isIos } from '../../constants/IsPlatform';
import Utils from '../../services/Utils';
import IsVenueOpened from '../../constants/IsVenueOpened';

const Venues: React.FC<ScreenProps<'Venues'>> = props => {
  const [categories, setCategories] = useState(
    props.route?.params.categories || DefaultCategories,
  );
  const [selectedCategory, setSelectedCategory] = useState(
    props.route?.params.selected_category || 1,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearchText] = useState('');
  const [venues, setVenues] = useState<Array<Venue>>([]);

  const [refreshing, setRefreshing] = useState(false);
  const location = useSelector((state: StoreStates) => state.location);

  useEffect(() => {
    fetch_venues();
  }, [selectedCategory, search, location]);

  const fetch_venues = async () => {
    setIsLoading(true);

    Request.fetch_venues({ category_id: selectedCategory, ...location, keywords: search }, (success, error) => {
      setIsLoading(false);
      setRefreshing(false);

      if (error) {
        MtToast.error(error.message);
      } else {
        console.log('venues', success.data.map(venue => venue.images));

        setVenues(success.data.sort((a: Venue, b: Venue) => {
          const aOpen = IsVenueOpened(a);
          const bOpen = IsVenueOpened(b);

          if (aOpen === bOpen) return 0;
          return aOpen ? -1 : 1
        }));

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

  const category_click = (item: any, index: number) => {
    console.log('category id', item.id);
    setSelectedCategory(item.id);
  };

  const renderItem_category = useCallback(
    ({ item, index }: Item) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => category_click(item, index)}
        style={{
          alignItems: 'center',
          marginTop: isIos ? 0 : 0,
          width: isIos ? 90 : 75,
          marginBottom: isIos ? 7 : 15,
        }}>
        <View
          style={{
            height: isIos ? 67 : 58,
            width: isIos ? 67 : 58,
            borderRadius: 10,
            overflow: 'hidden',
            alignItems: 'center',
            backgroundColor:
              item.id == selectedCategory ? '#2b4ce0' : '#dfe4fb',
            justifyContent: 'center',
          }}>
          <Imageview
            style={{
              width: isIos ? 30 : 25,
              height: isIos ? 30 : 25,
            }}
            url={item.icon}
            imageType={'server'}
            resizeMode={'contain'}
            tintColor={item.id == selectedCategory ? Colors.white : '#2b4ce0'}
          />
        </View>

        <Textview
          text={item.name}
          style={{
            fontFamily: Fonts.regular,
            color: '#2b4ce0',
            marginTop: 5,
            textAlign: 'center',
            fontSize: Fonts.fs_12,
          }}
          lines={1}
        />
      </TouchableOpacity>
    ),
    [categories, selectedCategory],
  );

  const keyExtractor_category = (item: any, index: number) => index.toString();

  return (
    <View style={[CSS.Favcontainer]}>
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
            <TouchableOpacity activeOpacity={0.9} onPress={scanQR}>
              <Imageview
                url={Images.scanner}
                style={{
                  width: isIos ? 40 : 35,
                  height: isIos ? 40 : 35,
                  resizeMode: 'cover',
                  alignSelf: 'flex-start',
                }}
                imageType={'local'}
              />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} onPress={nearbyVenues}>
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

        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
          }}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={categories}
            style={{
              flexGrow: 0,
              height: 130,
              marginHorizontal: isIos ? 7 : 7,
            }}
            renderItem={renderItem_category}
            keyExtractor={keyExtractor_category}
          />
        </View>

        <View style={{ marginTop: -40 }}>
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

export default Venues;
