import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Location from '../types/Location';
import { getCurrentLocation } from '../services/GetCurrentLocation';
import { Environment } from '../../env';

// Fallback location
const initialState: Location = Environment.Location.Default;

// Async Thunk to Reset Location
export const resetLocation = createAsyncThunk(
  'location/resetLocation',
  async (_, { rejectWithValue }) => {
    try {
      const coords = await getCurrentLocation();

      if (coords) {
        const newLocation = {
          ...initialState,
          latitude: coords.latitude,
          longitude: coords.longitude,
          canReset: false,
          current: true,
        };

        await AsyncStorage.setItem('location', JSON.stringify(newLocation));
        return newLocation;
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }

    // If getting location fails, fallback to initial state
    await AsyncStorage.removeItem('location');
    return initialState;
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      const data = {
        ...state,
        ...action.payload,
      };
      AsyncStorage.setItem('location', JSON.stringify(data));
      return data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetLocation.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
