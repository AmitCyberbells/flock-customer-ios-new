import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { CSS } from '../../constants/CSS';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import TabHeader from '../../components/TabHeader';
import VenueItem from '../../components/VenueItem';
import Venue from '../../types/Venue';
import Request from '../../services/Request';
import Toast from 'react-native-toast-message';
import Category from '../../types/Category';
import BoxView from '../../components/BoxView';
import { Colors } from '../../constants/Colors';
import Imageview from '../../components/Imageview';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import { isIos } from '../../constants/IsPlatform';
import MtToast from '../../constants/MtToast';
import ShadowCard from '../../components/ShadowCard';

const Favorites: React.FC<ScreenProps<'Tabs'>> = props => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [venues, setVenues] = useState<Array<Venue>>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const [categories, setCategories] = useState<Array<Category>>([]);

  useEffect(() => {

    fetch_categories();

  }, [])

  const fetch_categories = () => {
    setIsLoading(true);

    Request.fetch_categories((success, error) => {
      setIsLoading(false);
      
      if (success) {
        setCategories(success.data);

        if (success.data.length > 0) {
          setSelectedCategory(success.data[0]);
          fetch_venues(success.data[0]);
        }
      } else {
        MtToast.error(error.message);
      }
    });
  }

  const fetch_venues = (item: Category) => {
    setIsLoading(true);

    Request.savedVenues({ category_id: item.id }, (success, error) => {
      setIsLoading(false);

      if (success) {
        setVenues(success.data);

      } else {
        MtToast.error(error.message);
      }
    })
  }

  const openVenuePage = (item: Venue) => {
    props.navigation?.navigate('VenueDetails', { venue_id: item.id });
  };

  const SelectCategory = (item: Category, index: number) => {
    setSelectedCategory(item);
    fetch_venues(item);
  }

  const renderItemcategory = useCallback(
    ({ item, index }: { item: Category, index: number }) => (
      <Pressable onPress={() => SelectCategory(item, index)} style={{ marginHorizontal: 3 }}>
        {
          selectedCategory?.id == item.id ?
            <ShadowCard
              style={{
                alignItems: 'center',
                backgroundColor: Colors.white,
                padding: 0,
                borderRadius: 100
              }}
            >

              <View style={{
                backgroundColor: '#2b4ce0',
                height: 65,
                width: 65,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100
              }}>
                <Imageview
                  url={item.icon || ''}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  imageType={"server"}
                  resizeMode={"contain"}
                  tintColor={Colors.white}
                />
              </View>

              <Textview
                text={item.name.length > 10 ? item.name.substring(0, 7) + '..' : item.name}
                style={{
                  fontFamily: 'regular',
                  color: Colors.black,
                  marginTop: isIos ? 14 : 9,
                  marginBottom: isIos ? 17 : 12,
                  textAlign: 'center',
                  fontSize: Fonts.fs_11
                }}
                lines={1}
              />
            </ShadowCard>
            :
            <View style={{ flex: 1}}>
              <ShadowCard
                style={{
                  alignItems: 'center',
                  backgroundColor: Colors.white,
                  padding: 0,
                  borderRadius: 100
                }}
              >

                <View style={{
                  backgroundColor: '#dfe4fb',
                  height: 65,
                  width: 65,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100
                }}>
                  <Imageview
                    url={item.icon}
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    imageType={"server"}
                    resizeMode={"contain"}
                    tintColor={'#2b4ce0'}
                  />
                </View>
              </ShadowCard>

              <Textview
                text={item.name}

                style={{
                  fontFamily: 'regular',
                  color: Colors.black,
                  marginTop: isIos ? 14 : 9,
                  marginBottom: isIos ? 17 : 12,
                  textAlign: 'center',
                  fontSize: Fonts.fs_11
                }}
                lines={1}
              />

            </View>
        }
      </Pressable>

    ), [selectedCategory]);

  const keyExtractorcategory = (item: Category, index: number) => index.toString();

  return (
    <View style={[CSS.Favcontainer, { paddingHorizontal: 15 }]}>
      <Loader isLoading={isLoading} />

      <TabHeader title={'Favourite Venues'} navigation={props.navigation} />

      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={categories}
        style={{ 
          flexGrow: 0, 
          marginTop: isIos ? 18 : 15, 
          paddingBottom: isIos ? 10 : 5,
        }}
        renderItem={renderItemcategory}
        keyExtractor={keyExtractorcategory}
      />

      <View style={{ flex: 1 }}>
        {venues.length > 0 ? (
          <FlatList
            horizontal={false}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={venues}
            style={{
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
          />
        ) : (
          <NoData />
        )}
      </View>
    </View>
  );
};

export default Favorites;


const style = StyleSheet.create({

})