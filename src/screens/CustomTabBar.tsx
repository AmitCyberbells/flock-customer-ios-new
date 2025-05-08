import React, {useEffect, useState} from 'react';
import {View, Platform} from 'react-native';
import CustomTabBar_IOS from '../screens/CustomTabBar_IOS';
import CustomTabBar_Android from '../screens/CustomTabBar_Android';
import ScreenProps from '../types/ScreenProps';

const TabBar: React.FC<ScreenProps<'Tabs'>> = props => {
  
  
  return (
    <View>
      {Platform.OS == 'ios' ? (
        <CustomTabBar_IOS navigation={props.navigation} />
      ) : (
        <CustomTabBar_Android navigation={props.navigation} />
      )}
    </View>
  );
};

export default TabBar;
