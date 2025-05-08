import { createSlice } from '@reduxjs/toolkit';
import DevicePermissions from '../types/DevicePermissions';

const initialState: DevicePermissions = {
  camera: false,
  location: false,
  notifications: false,
  storage: false,
  sms: false,
  backgroundLocation: false
};

const devicePermissionSlice = createSlice({
  name: 'devicePermission',
  initialState,
  reducers: {
    setDevicePermissions: (state, action: { payload: DevicePermissions, type: string }) => {
      const data = {
        ...state,
        ...action.payload
      };
      return data;
    },
    resetDevicePermissions: () => initialState
  },
});

export const { setDevicePermissions, resetDevicePermissions } = devicePermissionSlice.actions;
export default devicePermissionSlice.reducer;
