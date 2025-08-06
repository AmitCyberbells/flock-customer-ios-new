import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Dimensions,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Images from '../constants/Images';
import Imageview from '../components/Imageview';
import {Colors} from '../constants/Colors';
import Textview from '../components/Textview';
import {Fonts} from '../constants/Fonts';
import Home from './tabs/Home';
import Notifications from './tabs/Notifications';
import Favorites from './tabs/Favourite';
import Profile from './tabs/Profile';
import Dash from './tabs/Dash';
import ScreenProps from '../types/ScreenProps';
import {CSS} from '../constants/CSS';
import { isIos } from '../constants/IsPlatform';
import { useThemeColors } from '../constants/useThemeColors';

const CustomTabBar_Android: React.FC<ScreenProps<'Tabs'>> = props => {
  const {navigation} = props;
  const [index, setIndex] = useState(0);
  const theme = useThemeColors();
  const scheme = useColorScheme();

  function openTab(i: number) {
    setIndex(i);
  }

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: theme.background,
    },
    imageBackground: {
      width: Dimensions.get('window').width,
      height: 100,
      bottom: -10,
      position: 'absolute',
    },
    bottomNav: {
      width: '100%',
      position: 'absolute',
      bottom: 5,
      backgroundColor: theme.backgroundfav,
      // shadowColor: '#dcdcdc',
      // shadowOpacity: 4,
      height: isIos ? 80 : 70,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: isIos ? 5 : 15,
      marginVertical: 0,
    },
    icon: {
      width: isIos ? 30 : 25,
      height: isIos ? 30 : 25,
    },
    tabText: {
      fontSize: Fonts.fs_10,
      fontFamily: Fonts.regular,
      marginTop: 3,
    },
    notificationsTab: {
      marginRight: 60,
    },
    floatingButton: {
      position: 'absolute',
      bottom: 28,
      alignSelf: 'center'
    },
    floatingButtonImage: {
      width: 80,
      height: 80,
    },
  });

  return (
    <View style={styles.container}>
      {index === 0 ? (
        <Home navigation={props.navigation} />
      ) : index === 1 ? (
        <Notifications navigation={props.navigation} />
      ) : index === 2 ? (
        <Dash navigation={props.navigation} />
      ) : index === 3 ? (
        <Favorites navigation={props.navigation} />
      ) : (
        <Profile navigation={props.navigation} />
      )}

      <ImageBackground
        source={scheme === 'dark' ? Images.bottomNavDark : Images.bottomNav}
        style={styles.imageBackground}
        resizeMode={'cover'}
        // tintColor={scheme === 'dark' ? theme.backgroundfav : ''}
        >
          
        <View style={styles.bottomNav}>
          <View style={styles.tabContainer}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => openTab(0)} style={CSS.tab}>
              <Imageview
                style={styles.icon}
                imageType={'local'}
                url={Images.home}
                tintColor={
                  0 == index ? Colors.primary_color_orange : Colors.light_grey
                }
              />
              <Textview
                text={'Home'}
                style={[
                  styles.tabText,
                  {
                    color:
                      0 == index
                        ? Colors.primary_color_orange
                        : Colors.light_grey,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} onPress={() => openTab(1)}
              style={[CSS.tab, styles.notificationsTab]}>
              <Imageview
                style={styles.icon}
                imageType={'local'}
                url={Images.notify}
                tintColor={
                  1 == index ? Colors.primary_color_orange : Colors.light_grey
                }
              />
              <Textview
                text={'Notifications'}
                style={[
                  styles.tabText,
                  {
                    color:
                      1 == index
                        ? Colors.primary_color_orange
                        : Colors.light_grey,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} onPress={() => openTab(3)} style={CSS.tab}>
              <Imageview
                style={styles.icon}
                imageType={'local'}
                url={Images.fav}
                tintColor={
                  3 == index ? Colors.primary_color_orange : Colors.light_grey
                }
              />
              <Textview
                text={'Favourites'}
                style={[
                  styles.tabText,
                  {
                    color:
                      3 == index
                        ? Colors.primary_color_orange
                        : Colors.light_grey,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} onPress={() => openTab(4)} style={CSS.tab}>
              <Imageview
                style={styles.icon}
                imageType={'local'}
                url={Images.profile}
                tintColor={
                  4 == index ? Colors.primary_color_orange : Colors.light_grey
                }
              />
              <Textview
                text={'Profile'}
                style={[
                  styles.tabText,
                  {
                    color:
                      4 == index
                        ? Colors.primary_color_orange
                        : Colors.light_grey,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.floatingButton}
          onPress={() => openTab(2)}>
          <Image style={styles.floatingButtonImage} source={Images.bird} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default CustomTabBar_Android;

