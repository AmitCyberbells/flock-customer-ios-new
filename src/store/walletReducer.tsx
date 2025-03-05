import { createSlice } from '@reduxjs/toolkit';
import { Wallet } from '../types/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: Wallet = {
  earned_feather_points: 0,
  earned_venue_points: 0,
  spent_feather_points: 0,
  spent_venue_points: 0,
  balance_feather_points: 0,
  balance_venue_points: 0,
  venue_wallets: []
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateWallet: (state, action: {payload: Wallet, type: string}) => {
      const data = {
        ...state,
        ...action.payload
      };
      AsyncStorage.setItem('wallet', JSON.stringify(data));
      return data;
    },
    resetWallet: () => {
      AsyncStorage.removeItem('wallet');
      return initialState
    },
  },
});

export const { updateWallet, resetWallet } = walletSlice.actions;
export default walletSlice.reducer;
