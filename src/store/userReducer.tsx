import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import User from '../types/User';

const initialState: User = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  contact: '',
  image: '',
  dob: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserToStore: (state, action: {payload: User, type: string}) => {
      const data = {
        ...state,
        ...action.payload,
      };
      AsyncStorage.setItem('user', JSON.stringify(data));
      return data;
    },
    resetUserToStore: () => {
      AsyncStorage.removeItem('user');
      return initialState;
    },
  },
});

export const { updateUserToStore, resetUserToStore } = userSlice.actions;
export default userSlice.reducer;
