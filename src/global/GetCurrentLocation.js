import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { open_phone_setting } from '../component/UtilityService';

const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        return await getOneTimeLocation();
    } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Access Required',
                    message: 'This App needs to Access your location',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.DENIED || granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                // Show a snackbar message or similar UI notification
                // Function.snackbar("Please allow Phone and Application's location permission", Design.pink, "high");
                setTimeout(() => {
                    open_phone_setting();
                }, 4000);
                return null;
            } else if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return await getOneTimeLocation();
            }
        } catch (err) {
            console.warn(err);
            return null;
        }
    }
};

const getOneTimeLocation = () => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Location request timed out'));
        }, 30000);
        
        Geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.log(error.message);
                if (error.message === "User denied access to location services.") {
                    setTimeout(() => {
                        open_phone_setting();
                    }, 3000);
                }

                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
            },
        );
    });
};

export { requestLocationPermission };