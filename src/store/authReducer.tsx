import { createSlice } from '@reduxjs/toolkit';
import Auth from '../types/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: Auth = {
  accessToken: '',
  tokenType: '',
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: { payload: Auth, type: string }) => {
      const data = {
        ...state,
        ...action.payload,
        isLoggedIn: true
      };
      AsyncStorage.setItem('auth', JSON.stringify(data));
      return data;
    },
    logout: () => {
      AsyncStorage.removeItem('auth');
      return initialState
    },
    refreshDeviceToken:
      (state, action) => {
        const data = {
          ...state,
          ...action.payload
        };
        //console.log('refresh device token in store: ', data)
        AsyncStorage.setItem('auth', JSON.stringify(data));
        return data;
      },
    subscribeNotifications:
      (state, action) => {
        const data = {
          ...state,
          ...action.payload
        };
        return data;
      }
  },
});

export const { login, logout, refreshDeviceToken, subscribeNotifications } = authSlice.actions;
export default authSlice.reducer;
