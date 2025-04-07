import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from 'react-native';
import Imageview from '../components/Imageview';
import Textview from '../components/Textview';
import Images from '../constants/Images';
import {Fonts} from '../constants/Fonts';
import {Colors} from '../constants/Colors';
import Home from './tabs/Home';
import Notifications from './tabs/Notifications';
import Dash from './tabs/Dash';
import Favorites from './tabs/Favourite';
import Profile from './tabs/Profile';
import ScreenProps from '../types/ScreenProps';

const CustomTabBar_IOS: React.FC<ScreenProps<'Tabs'>> = props => {
  const {navigation} = props;
  const routes = navigation?.getState().routes;
  const [index, set_index] = useState(0);

  function click_handle(type: string, i: number) {
    set_index(i);
    // props.navigation.navigate(type)
    console.log('click');
  }

  return (
    <View style={{height: '100%'}}>
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

      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: '#fff',

          shadowColor: '#dcdcdc',
          shadowOpacity: 4,
          position: 'absolute',
          bottom: 15,
          left: '38%',
        }}>
        <View style={{height: 70}} />
      </View>

      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: '#fff',
          shadowColor: '#dcdcdc',
          shadowOpacity: 4,
          height: 80,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 23,
            marginTop: 15,
          }}>
          <TouchableOpacity
            onPress={() => click_handle('Home', 0)}
            style={{alignContent: 'center', alignItems: 'center'}}>
            <Imageview
              style={{
                width: 30,
                height: 30,
              }}
              imageType={'local'}
              url={Images.home}
              tintColor={
                0 == index ? Colors.primary_color_orange : Colors.light_grey
              }
            />
            <Textview
              text={'Home'}
              style={{
                fontSize: Fonts.fs_10,
                color:
                  0 == index ? Colors.primary_color_orange : Colors.light_grey,
                fontFamily: Fonts.regular,
                marginTop: 3,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => click_handle('Notification', 1)}
            style={{
              alignContent: 'center',
              alignItems: 'center',
              marginRight: 80,
            }}>
            <Imageview
              style={{
                width: 30,
                height: 30,
              }}
              imageType={'local'}
              url={Images.notify}
              tintColor={
                1 == index ? Colors.primary_color_orange : Colors.light_grey
              }
            />
            <Textview
              text={'Notifications'}
              style={{
                fontSize: Fonts.fs_10,
                color:
                  1 == index ? Colors.primary_color_orange : Colors.light_grey,
                fontFamily: Fonts.regular,
                marginTop: 3,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => click_handle('Favorites', 3)}
            style={{alignContent: 'center', alignItems: 'center'}}>
            <Imageview
              style={{
                width: 30,
                height: 30,
              }}
              imageType={'local'}
              url={Images.fav}
              tintColor={
                3 == index ? Colors.primary_color_orange : Colors.light_grey
              }
            />
            <Textview
              text={'Favourites'}
              style={{
                fontSize: Fonts.fs_10,
                color:
                  3 == index ? Colors.primary_color_orange : Colors.light_grey,
                fontFamily: Fonts.regular,
                marginTop: 3,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => click_handle('Profile', 4)}
            style={{alignContent: 'center', alignItems: 'center'}}>
            <Imageview
              style={{
                width: 30,
                height: 30,
              }}
              imageType={'local'}
              url={Images.profile}
              tintColor={
                4 == index ? Colors.primary_color_orange : Colors.light_grey
              }
            />
            <Textview
              text={'Profile'}
              style={{
                fontSize: Fonts.fs_10,
                color: 4 == index ? Colors.primary_color_orange : Colors.light_grey,
                fontFamily: Fonts.regular,
                marginTop: 3
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={{
          width: 84,
          height: 83,
          position: 'absolute',
          bottom: 20,
          left: '38.7%',
          //backgroundColor:Design.grey,
          backgroundColor: '#fff',
          borderRadius: 37,
          overflow: 'hidden',
        }}
        onPress={() => click_handle('Inu', 2)}
        activeOpacity={1}>
        <Image
          style={{
            width: 80,
            height: 80,
            resizeMode: 'contain',
            marginLeft: 2,
          }}
          source={Images.bird}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomTabBar_IOS;
