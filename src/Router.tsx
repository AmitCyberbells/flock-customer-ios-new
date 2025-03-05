import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import toastConfig from './types/ToastConfig';
import {useDispatch, useSelector} from 'react-redux';
import {StoreStates} from './store/store';
import SideMenu from './navigations/SideMenu';
import AuthNavigator from './navigations/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from './store/authReducer';
import {updateUserToStore} from './store/userReducer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import {Colors} from './constants/Colors';
import InitializeApp from './middleware/InitializeApp';

const Router = () => {
  const isLoggedIn = useSelector((state: StoreStates) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!isLoggedIn) {
      checkUser();
    }

  }, [isLoggedIn]);

  const checkUser = async () => {
    const auth = await AsyncStorage.getItem('auth');
    const user = await AsyncStorage.getItem('user');

    if (auth && user) {
      const authx = JSON.parse(auth);
      const userx = JSON.parse(user);
      console.log(authx)
      dispatch(updateUserToStore(userx));
      dispatch(login({...authx}));
    }
  };

  return (
    <GestureHandlerRootView>
      <StatusBar
        barStyle="default"
        backgroundColor={Colors.primary_color_orange}
      />
      <NavigationContainer>
        {isLoggedIn ? <SideMenu /> : <AuthNavigator />}

        <Toast config={toastConfig} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default InitializeApp(Router);
