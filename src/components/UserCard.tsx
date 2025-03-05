import React, {useEffect} from 'react';
import BoxView from './BoxView';
import {Platform, Text, View} from 'react-native';
import {Colors} from '../constants/Colors';
import Imageview from './Imageview';
import {Fonts} from '../constants/Fonts';
import User from '../types/User';
import {useSelector} from 'react-redux';
import {StoreStates} from '../store/store';
import Images from '../constants/Images';
import { isIos } from '../constants/IsPlatform';

const UserCard: React.FC = () => {
  const user: User = useSelector((state: StoreStates) => state.user);

  return (
    <BoxView
      cardStyle={{
        backgroundColor: Colors.white,
        paddingHorizontal: isIos ? 20 : 10,
        paddingVertical: isIos ? 10 : 0,
      }}>
      <View style={{flexDirection: 'row', overflow: 'hidden', padding: 2}}>
        <Imageview
          style={{
            width: isIos ? 70 : 54,
            height: isIos ? 70 : 54,
            borderRadius: isIos ? 80 : 57
          }}
          imageStyle={{borderRadius: isIos ? 80 : 57}}
          url={user?.image ?? Images.profileImg}
          imageType={'server'}
          resizeMode={'cover'}
        />

        <View style={{justifyContent: 'center', marginHorizontal: 12}}>
          <Text
            style={{
              fontFamily: isIos ? Fonts.ios_medium : Fonts.android_medium,
              color: Colors.black,
              fontSize: Fonts.fs_16,
            }}>
            {user.first_name + ' ' + user.last_name}
          </Text>

          <Text
            style={{
              fontFamily: isIos ? Fonts.ios_medium : Fonts.android_medium,
              color: Colors.light_grey,
              fontSize: Fonts.fs_14,
            }}>
            {user.email}
          </Text>
        </View>
      </View>
    </BoxView>
  );
};

export default UserCard;
