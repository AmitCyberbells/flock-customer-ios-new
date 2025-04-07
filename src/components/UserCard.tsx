import React, { useEffect } from 'react';
import BoxView from './BoxView';
import { Platform, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import Imageview from './Imageview';
import { Fonts } from '../constants/Fonts';
import User from '../types/User';
import { useSelector } from 'react-redux';
import { StoreStates } from '../store/store';
import Images from '../constants/Images';
import { isIos } from '../constants/IsPlatform';

const UserCard: React.FC = () => {
  const user: User = useSelector((state: StoreStates) => state.user);

  return (

    <View style={{
      flexDirection: 'row',
      borderBottomColor: '#eae8e8',
      borderBottomWidth: 1,
      paddingVertical: 20,
      paddingLeft: 5,
      paddingRight: 5
    }}>
      <Imageview
        style={{
          width: isIos ? 70 : 54,
          height: isIos ? 70 : 54,
          borderRadius: isIos ? 80 : 57
        }}
        imageStyle={{
          borderRadius: isIos ? 80 : 57,
          borderColor: Colors.whitesmoke,
          borderWidth: 1
        }}
        url={user?.image ?? Images.profileImg}
        imageType={'server'}
        resizeMode={'cover'}
      />

      <View style={{ justifyContent: 'center', marginLeft: 10, flexShrink: 1 }}>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: Fonts.medium,
            color: Colors.black,
            fontSize: Fonts.fs_16,
          }}>
          {user.first_name + ' ' + user.last_name}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontFamily: Fonts.regular,
            color: Colors.light_grey,
            fontSize: Fonts.fs_14,
          }}>
          {user.email}
        </Text>
      </View>
    </View>

  );
};

export default UserCard;
