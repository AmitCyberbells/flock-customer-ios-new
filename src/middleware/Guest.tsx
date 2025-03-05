import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StoreStates } from '../store/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserToStore } from '../store/userReducer';
import { login } from '../store/authReducer';

/**
 * If guest then continue with the component otherwise redirect to tabs
 * @param WrappedComponent 
 * @returns 
 */
const Guest = (WrappedComponent: React.ComponentType) => {
  const ComponentWithGuest = (props: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const user = useSelector((state: StoreStates) => state.user);
    const auth = useSelector((state: StoreStates) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
      if (user.email != '' && auth.accessToken != '') {
        navigation?.navigate('Tabs');
      } else {
        checkStorage();
      }
    }, [user, navigation]);

    const checkStorage = async () => {
      const user_data = await AsyncStorage.getItem('user');
      const auth_data = await AsyncStorage.getItem('auth');
      
      if (user_data && auth_data) {
        const userx = JSON.parse(user_data);
        const authx = JSON.parse(auth_data);
        if (userx.email != '' && authx.access_token != '') {
          dispatch(updateUserToStore(userx));
          dispatch(login(authx));

          navigation?.navigate('Tabs');
        }
      }
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithGuest;
};

export default Guest;