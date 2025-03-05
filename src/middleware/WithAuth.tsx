import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreStates } from '../store/store';
import Firebase from '../services/Firebase';
import { logout } from '../store/authReducer';
import WalletService from '../services/WalletService';

const WithAuth = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAuth = (props: any) => {
    const user = useSelector((state: StoreStates) => state.user);
    const auth = useSelector((state: StoreStates) => state.auth);
    const dispatch = useDispatch();
    const { updateDeviceToken } = Firebase();
    const { updateWalletBalances } = WalletService();

    useEffect(() => {
      if (user.email == '' || auth.accessToken == '') {
        dispatch(logout())
      }

      updateDeviceToken();
      updateWalletBalances();

    }, []);


    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default WithAuth;