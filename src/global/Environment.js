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
    }

}