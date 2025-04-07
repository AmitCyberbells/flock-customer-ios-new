import { useState, useCallback } from 'react';
import { PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import Utils from './Utils';
import { setLocation } from '../store/locationReducer';
import { StoreStates } from '../store/store';
import { isIos } from '../constants/IsPlatform';
import MtToast from '../constants/MtToast';

const useLocation = () => {
    const dispatch = useDispatch();
    const location = useSelector((state: StoreStates) => state.location)

    const setCurrentLocation = useCallback(() => {
        getCurrentLocation().then((coords) => {
            
            if (!location.canReset) {
                dispatch(setLocation(coords));
            }

        }).catch((error) => {
            console.log(error);
            MtToast.error("Please allow Phone and Application's location permission");
            setTimeout(() => {
                Utils.openPhoneSetting();
            }, 4000);
        });
        
    }, [dispatch]);

    const requestLocationPermission = useCallback(async () => {
        if (isIos) {
            return setCurrentLocation();
        }
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Access Required',
                    message: 'This App needs to Access your location',
                    buttonPositive: 'Yes'
                },
            );

            if (granted === PermissionsAndroid.RESULTS.DENIED || granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {

                MtToast.error("Please allow Phone and Application's location permission");

                setTimeout(() => {
                    Utils.openPhoneSetting();
                }, 4000);

                return null;
            } else if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return setCurrentLocation();
            }
        } catch (err) {
            console.warn(err);
            return null;
        }
    }, [setCurrentLocation]);

    const watchCurrentPosition = useCallback(async () => {
        const watchId = Geolocation.watchPosition(
            (position) => {

            }, (error) => {

            }, {
            maximumAge: 60000, // 1 minute
            enableHighAccuracy: true,
            timeout: 30000, // 30 second
        }
        )

        return () => Geolocation.clearWatch(watchId)
    }, []);

    return { requestLocationPermission, setCurrentLocation, watchCurrentPosition };
};

export const getCurrentLocation = () => {
    return new Promise<{ latitude: number, longitude: number }>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Location request timed out'));
        }, 30000);

        Geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeout);

                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                resolve(coords);
            },
            (error) => {
                clearTimeout(timeout);
                if (error.message === "User denied access to location services.") {
                    setTimeout(() => {
                        Utils.openPhoneSetting();
                    }, 3000);
                }
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
            }
        );
    });
}

export default useLocation;
