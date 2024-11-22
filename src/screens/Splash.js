import React, { useState, useEffect } from "react"
import { View, Text, Platform, Image, Dimensions, PermissionsAndroid, LogBox, Linking } from "react-native"
import Design from "../design/Design"
import Textview from "../component/Textview"
import CSS from "../design/CSS"
import Imageview from "../component/Imageview"
import GlobalImages from "../global/GlobalImages"
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreAllLogs();

import { connect, useDispatch } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import DeviceInfo from 'react-native-device-info';
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher'
import Geolocation from '@react-native-community/geolocation';

import { FCM_init } from "../global/Notification"


function Splash(props) {
    const { location, actions } = props;

    useEffect(() => {
        requestLocationPermission();
        FCM_init(props);

        let navFocused = false;
        AsyncStorage.removeItem("startUp");

        props.navigation.addListener('didFocus', () => {
            navFocused = true;
            displayData();
        });

        if (!navFocused) {
            displayData();
        }

    }, []);

    const requestLocationPermission = async () => {
        AsyncStorage.removeItem('pin_location');
        AsyncStorage.removeItem('latitude');
        AsyncStorage.removeItem('longitude');

        if (Platform.OS === 'ios') {
            getOneTimeLocation();
        } else {
            console.log('click_1')
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted == "denied") {
                    //Function.snackbar("Please allow Phone and Application's location permission", Design.pink, "high")
                    setTimeout(() => {
                        open_phone_setting()
                    }, 4000);
                }
                else if (granted == "never_ask_again") {
                    //Function.snackbar("Please allow Phone and Application's location permission", Design.pink, "high")
                    setTimeout(() => {
                        open_phone_setting()
                    }, 4000);
                }
                else if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getOneTimeLocation();
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const getOneTimeLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                //console.log('splash location', position.coords.latitude, position.coords.longitude)
                AsyncStorage.setItem('latitude', position.coords.latitude.toString());
                AsyncStorage.setItem('longitude', position.coords.longitude.toString());

                actions.location({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    radius: 10000
                })
                actions.current_location({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    radius: 10000
                })
            },
            (error) => {
                if (error.message == "User denied access to location services.") {
                    // Function.snackbar("Please allow Phone and Application's location permission", Design.pink, "high")
                    setTimeout(() => {
                        open_phone_setting();
                    }, 3000);
                }
                else {
                    console.log(error.message)
                    //  Function.snackbar("" + error.message, Design.pink, "high")
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 20000,
                maximumAge: 10000
            },
        );
    };

    function open_phone_setting() {
        var packagee = DeviceInfo.getBundleId();
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:')
        } else {
            IntentLauncher.startActivity({
                action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                data: 'package:' + packagee
            })
        }
    }

    const displayData = async () => {

        let login = await AsyncStorage.getItem("login");
        let user_details = await AsyncStorage.getItem("user_details");
        let startup = await AsyncStorage.getItem("startUp");

        //console.log('splash displaydata', login, startup)

        if (login && user_details) {
            actions.saved_user_info(JSON.parse(user_details));
            props.navigation.replace('CustomTabBar');

        } else if (!startup) {
            AsyncStorage.setItem("startUp", "seen");

            props.navigation.navigate('StartUpAd');
        } else {
            props.navigation.replace('Login');
        }
    }

    return (
        <View style={CSS.Splashcontainer}>

            <Imageview
                width={Platform.OS == "ios" ? 130 : 120}
                height={Platform.OS == "ios" ? 130 : 120}
                align_self={'center'}
                margin_top={Platform.OS == "ios" ? 90 : 75}
                image_type={"local"}
                url={GlobalImages.splash_logo}
            />
            <View style={{ position: 'absolute', bottom: 0 }}>
                <Imageview
                    width={Dimensions.get('window').width}
                    height={Platform.OS == "ios" ? Dimensions.get('window').height * 61.8 / 100 : Dimensions.get('window').height * 66.2 / 100}
                    align_self={'center'}
                    resize_mode={'contain'}
                    image_type={"local"}
                    url={GlobalImages.splash_back}
                />
            </View>


        </View>
    )
}

const mapStateToProps = state => ({
    info: state.info.info,
    location: state.global.location,
    current_location: state.global.current_location,
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);