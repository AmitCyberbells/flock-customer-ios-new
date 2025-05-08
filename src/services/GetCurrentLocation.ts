import { useState, useCallback } from 'react';
import { PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import Utils from './Utils';
import { setLocation } from '../store/locationReducer';
import { StoreStates } from '../store/store';
import { isIos } from '../constants/IsPlatform';
import MtToast from '../constants/MtToast';
import Request from './Request';
import { createLog, LOG_ACTIVITIES } from './AppLog';

const useLocation = () => {
    const dispatch = useDispatch();
    const location = useSelector((state: StoreStates) => state.location)

    const setCurrentLocation = useCallback(() => {
        if (location.canReset) {
            return false;
        }

        getCurrentLocation().then((coords) => {
            
            dispatch(setLocation({...coords, current: true}));

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
            setCurrentLocation();
            return true;
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

                return false;
            } else if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setCurrentLocation();
                return true;
            }
        } catch (err) {
            console.warn(err);
            return false;
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

const updateUserLocation = async (currentL: GeolocationResponse) => {

    Request.updateUserLocation({
        latitude: currentL.coords.latitude,
        longitude: currentL.coords.longitude
    }, (success, error) => {

        if (error) {
            createLog(LOG_ACTIVITIES.UPDATE_CURRENT_LOCATION, error);
        }
    })
}

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
                
                updateUserLocation(position);

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
