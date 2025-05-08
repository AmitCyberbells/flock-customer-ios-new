import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';
import Login from '../screens/auth/Login';
import OTPScreen from '../screens/auth/Otp';
import ResetPassword from '../screens/auth/ResetPassword';
import WebPage from '../screens/pages/WebPage';
import StartupAd from '../screens/auth/StartupAd';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Otp"
        component={OTPScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="StartupAd" component={StartupAd} options={{ headerShown: false }} />
      <Stack.Screen name="WebPage" component={WebPage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
