import React, { useEffect } from 'react';
import useLocation from '../services/GetCurrentLocation';
import Firebase, { notifeeSettings } from '../services/Firebase';
import { useCameraPermission } from 'react-native-vision-camera';

const InitializeApp = (WrappedComponent: React.ComponentType) => {
  const ComponentInitializeApp = (props: any) => {
    const { requestPermission } = useCameraPermission();
    const { requestLocationPermission } = useLocation();
    const { getNotificationPermission } = notifeeSettings();

    useEffect(() => {

      getNotificationPermission();
      requestPermission(); // camera permission
      requestLocationPermission();
     
    }, []);

    return <WrappedComponent {...props} />;
  };

  return ComponentInitializeApp;
};

export default InitializeApp;