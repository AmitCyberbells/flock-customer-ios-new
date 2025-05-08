import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import toastConfig from './types/ToastConfig';
import { useDispatch, useSelector } from 'react-redux';
import { StoreStates } from './store/store';
import SideMenu from './navigations/SideMenu';
import AuthNavigator from './navigations/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from './store/authReducer';
import { updateUserToStore } from './store/userReducer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { Colors } from './constants/Colors';
import BootSplash from 'react-native-bootsplash';
import { setDevicePermissions } from './store/devicePermissionReducer';
import { useCameraPermission } from 'react-native-vision-camera';
import useLocation from './services/GetCurrentLocation';
import Firebase, { notifeeSettings } from './services/Firebase';

const Router = () => {
  const isLoggedIn = useSelector((state: StoreStates) => state.auth.isLoggedIn);
  const devicePermission = useSelector(
    (state: StoreStates) => state.devicePermission,
  );

  const { requestPermission } = useCameraPermission();
  const { requestLocationPermission } = useLocation();
  const { getNotificationPermission } = notifeeSettings();
  const [isAuthChecked, setIsAuthChecked] = React.useState(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    checkUser();
    updateDevicePermissions();

  }, [isLoggedIn]);

  const updateDevicePermissions = async () => {
    console.log({devicePermission});
    
    if (devicePermission.camera === false) {
      const camera = await requestPermission();
      dispatch(setDevicePermissions({camera: camera}));
    }

    if (devicePermission.notifications === false) {
      const notifications = await getNotificationPermission();
      dispatch(setDevicePermissions({notifications: notifications}));
    }

    if (devicePermission.location === false) {
      const location = await requestLocationPermission();
      dispatch(setDevicePermissions({location: location ?? false}));
    }
  }

  const checkUser = async () => {
    const auth = await AsyncStorage.getItem('auth');

    if (auth) {
      const authx = JSON.parse(auth);
      dispatch(login({ ...authx }));
    }

    setIsAuthChecked(true);
    const user = await AsyncStorage.getItem('user');

    if (auth && user) {
      const userx = JSON.parse(user);
      dispatch(updateUserToStore(userx));
    }
  };

  if (!isAuthChecked) {
    return null; // or splash screen
  }

  return (
    <GestureHandlerRootView>
      <StatusBar
        barStyle="default"
        backgroundColor={Colors.primary_color_orange}
      />
      <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
        {isLoggedIn ? <SideMenu /> : <AuthNavigator />}

        <Toast config={toastConfig} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default Router;
