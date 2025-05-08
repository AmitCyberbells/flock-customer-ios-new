import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { CSS } from '../../constants/CSS';
import Loader from '../../components/Loader';
import Textview from '../../components/Textview';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import Imageview from '../../components/Imageview';
import Images from '../../constants/Images';
import Typewriter from '../../components/Typewriter';
import Item from '../../types/RenderedItem';
import AppIntroSlider from 'react-native-app-intro-slider';
import NoData from '../../components/NoData';
import { useCameraPermission } from 'react-native-vision-camera';
import Request from '../../services/Request';
import Category from '../../types/Category';
import TabHeader from '../../components/TabHeader';
import Venue from '../../types/Venue';
import AdBanner from '../../types/AdBanner';
import MtToast from '../../constants/MtToast';
import { isIos } from '../../constants/IsPlatform';
import AdBannerItem from '../../components/AdBannerItem';
import Firebase from '../../services/Firebase';

const deviceHeight = Dimensions.get('window').height;

const Home: React.FC<ScreenProps<'Tabs'>> = props => {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [adBanners, setAdBanners] = useState<Array<AdBanner>>([]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const { updateDeviceToken } = Firebase();

  useEffect(() => {
    Request.fetch_categories((success, error) => {
      if (success) {
        setCategories(success.data);
      } else {
        MtToast.error(error.message);
      }
    });

    fetch_adBanners();
    updateDeviceToken();

  }, []);

  const fetch_adBanners = () => {
    setLoader(true);

    Request.adBanners((success, error) => {
      setLoader(false);

      if (success) {
        setAdBanners(success.data);
      } else {
        MtToast.error(error.message);
      }
    });
  };

  const openVenue = (item: Venue) => {
    props.navigation?.navigate('VenueDetails', { venue_id: item.id });
  };

  const category_click = (item: any, index: number) => {
    props.navigation?.navigate('Venues', {
      selected_category: item.id,
      categories,
    });
  };

  const renderItem_category = useCallback(
    ({ item, index }: Item) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => category_click(item, index)}
        style={styles.categoryItem}>
        <View style={styles.categoryIconContainer}>
          <Imageview
            style={styles.categoryIcon}
            url={item.icon}
            imageType={'server'}
            resizeMode={'contain'}
            tintColor={'#2b4ce0'}
          />
        </View>
        <Textview text={item.name.length > 10 ? item.name.substring(0, 8) + '..' : item.name} style={styles.categoryText} lines={1} />
      </TouchableOpacity>
    ),
    [categories],
  );

  const keyExtractor_category = (item: any, index: number) => index.toString();

  const openHotVenues = () => {
    props.navigation?.navigate('HotVenues');
  };

  const searchVenue = () => {
    //props.navigation.navigate('Search');
  };

  const scanQR = () => {
    if (hasPermission) {
      props?.navigation?.navigate('QrScanner');
    } else {
      requestPermission().then(permission => {
        if (permission) {
          props?.navigation?.navigate('QrScanner');
        }
      });
    }
  };

  const nearbyVenues = () => {
    props?.navigation?.navigate('Map');
  };

  return (
    <View style={CSS.Homecontainer}>
      <TabHeader
        navigation={props.navigation}
        nearByVenues={() => nearbyVenues()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 60 }}>
          <View>
            <View style={styles.logoContainer}>
              <Imageview
                style={styles.birdLogo}
                imageType={'local'}
                url={Images.bird_logo}
              />
            </View>

            <View style={styles.titleContainer}>
              <Textview
                text={"Let's "}
                style={styles.titleText}
                text_click={searchVenue}
              />
              <Typewriter text="Flock to" delay={300} infinite />
            </View>

            <View style={styles.scannerContainer}>
              <TouchableOpacity activeOpacity={0.9} onPress={scanQR}>
                <Imageview
                  style={styles.scannerIcon}
                  imageType={'local'}
                  url={Images.scanner}
                />
              </TouchableOpacity>
            </View>
          </View>

          {categories.length ? (
            <View style={styles.contentContainer}>

              <View style={{ marginTop: deviceHeight > 716 ? 10 : 0 }}>
                <Textview text={'Categories '} style={[styles.categoriesTitle]} />

                <View style={[styles.categoriesList]}>
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    contentContainerStyle={styles.categoriesListContent}
                    style={styles.categoriesFlatList}
                    renderItem={renderItem_category}
                    keyExtractor={keyExtractor_category}
                  />
                </View>
              </View>

              <View style={[CSS.home_tab_click, { marginTop: deviceHeight > 716 ? 35 : 20 }]}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={openHotVenues}
                  style={CSS.hot_button}>
                  <Imageview
                    style={styles.hotIcon}
                    imageType={'local'}
                    url={Images.hot}
                  />
                  <Textview
                    text={'Hot'}
                    style={styles.hotText}
                    text_click={openHotVenues}
                  />
                </TouchableOpacity>
              </View>

              {adBanners.length > 0 ? (
                <View style={[{ flex: 1, marginTop: deviceHeight > 716 ? 35 : 20 }]}>
                  <AppIntroSlider
                    renderItem={({ item }) => <AdBannerItem item={item} openVenue={openVenue} />}
                    data={adBanners}
                    showNextButton={false}
                    showDoneButton={false}
                    showSkipButton={false}
                    activeDotStyle={CSS.active_dot}
                    dotStyle={CSS.inactive_dot_view}
                  />
                </View>
              ) : (
                <Textview text={'No Venue Found!'} style={styles.noVenueText} />
              )}
            </View>
          ) : (
            <NoData isLoading={loader} />
          )}
        </View>
      </ScrollView>

      <Loader isLoading={loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center'
  },
  categoryIconContainer: {
    height: isIos ? 67 : 58,
    width: isIos ? 67 : 58,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#dfe4fb',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: isIos ? 30 : 25,
    height: isIos ? 30 : 25,
  },
  categoryText: {
    fontFamily: Fonts.regular,
    color: '#2b4ce0',
    marginTop: 5,
    textAlign: 'center',
    fontSize: Fonts.fs_12,
  },
  slider: {
    marginTop: 20,
  },
  inactiveDot: {
    backgroundColor: 'transparent',
  },
  dotsContainer: {
    flexGrow: 0,
  },
  navIcon: {
    width: isIos ? 45 : 40,
    height: isIos ? 45 : 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  birdLogo: {
    width: isIos ? 80 : 75,
    height: isIos ? 80 : 75,
  },
  titleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: Fonts.fs_27,
    color: Colors.black,
    fontFamily: Fonts.medium,
  },
  scannerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  scannerIcon: {
    width: isIos ? 70 : 60,
    height: isIos ? 70 : 60,
  },
  contentContainer: {
    justifyContent: 'space-between',
    height: '100%'
  },
  categoriesTitle: {
    fontSize: Fonts.fs_18,
    color: Colors.dark_blue,
    fontFamily: Fonts.regular,
    marginTop: isIos ? 30 : 20
  },
  categoriesList: {
    alignItems: 'center',
    marginTop: isIos ? 15 : 20
  },
  categoriesListContent: {
    justifyContent: 'center',
    gap: 10
  },
  categoriesFlatList: {
    flexGrow: 0
  },
  venuesList: {
    flexGrow: 0,
  },
  hotIcon: {
    width: isIos ? 30 : 25,
    height: isIos ? 30 : 25,
  },
  hotText: {
    fontSize: Fonts.fs_20,
    color: Colors.primary_color_orange,
    fontFamily: Fonts.regular,
    marginLeft: 5,
  },
  noVenueText: {
    fontSize: Fonts.fs_20,
    color: Colors.primary_color_orange,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginLeft: 10,
    marginTop: isIos ? '10%' : '30%',
  },
});

export default Home;
