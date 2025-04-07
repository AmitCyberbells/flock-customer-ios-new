import { Platform } from "react-native"

export const Environment = {

    GoogleMap: {
        getAPIKey: () => {
            if (Platform.OS === 'ios') {
                return 'AIzaSyA4D0ULsoSN1GhRqCcL0JtnyUnpLPDX1Do';

            } else if (Platform.OS === 'android') {
                return 'AIzaSyD7yN8OYOWDyirfXc4OkVKJ3G2pF-y7-wo';

            } else {
                return 'AIzaSyAFCdzWb2AaDalQxJYRN3V11XacSOiQCEY';
            }
        }
    },

    Firebase: {
        config: () => {
            return {
                apiKey: "AIzaSyAFCdzWb2AaDalQxJYRN3V11XacSOiQCEY",
                authDomain: "flock-412ed.firebaseapp.com",
                projectId: "flock-412ed",
                storageBucket: "flock-412ed.appspot.com",
                messagingSenderId: "819650124616",
                appId: "1:819650124616:web:452ee72dde8659c854f17d",
                measurementId: "G-9Y6W35NTTY"
            }
        }
    },

    UserGuideLink: 'https://getflock.io/user-guide',

    Terms: "https://web.cyberbells.com/DitroInfotech/Projects/flock/terms-customer",

    getApiTimeout: (file: boolean = false) => file ? 40000 : 20000,

    Location: {
        Default: {
            latitude: -33.865143, // 'Sydney, Australia'
            longitude: 151.209900,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0421,
            canReset: false,
            current: false,
            radius: 100000, // 100km
        },
        Zoom: {
            area: {
                lat: 0.1,
                lon: 0.1,
            },
            place: {
                lat: 0.0322,
                lon: 0.0421,
            }
        },
        MinRadius: 1000,
        MaxRadius: 100000,
    }

}