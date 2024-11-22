import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Platform, PermissionsAndroid, StyleSheet, TextInput, Image } from 'react-native'
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import Snackbar from "react-native-snackbar";
import MapView, { Marker, Callout, Circle } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Lottie from "lottie-react-native"
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";

import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Environment } from "../global/Environment";
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import { open_phone_setting } from "../component/UtilityService";

function Map(props) {
    const { location, info, actions } = props;

    const [region, setRegion] = useState({
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [radius, setRadius] = useState(location.radius);

    const [alert_dialog, set_alert_dialog] = useState(false);
    const [loading_data, set_loading_data] = useState(true);
    const [list, set_list] = useState([]);
    const [radiusInput, setRadiusInput] = useState(false);

    useEffect(() => {

        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {
                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            } else {
                FETCH_DATA();
            }
        });

        requestLocationPermission();
        // if current location is not detecable then fallback to user's stored location
        //getUserLocation();

        console.log('default region ', region);
    }, []);

    const getUserLocation = () => {
        if (location.canReset) {
            return;
        }

        var data = new FormData();
        data.append("user_id", info.user_id);

        ApiCall.postRequest(Server.get_user_location, data, (response, error) => {
            setLoader(false);
            console.log({ response }, { error });

            if (response != undefined && response.status == "success") {
                if (response.userdata.lat && response.userdata.lon) {
                    setRegion({
                        latitude: response.userdata.lat,
                        longitude: response.userdata.lon,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }

            } else {
                //
            }
        })
    }

    const handleLocationSelect = (data, details) => {
        setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    const handleMarkerDragEnd = (e) => {
        setRegion({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0421
        })
    }

    const handleRadiusChange = newRadius => {
        let radius = Number(newRadius);

        if (isNaN(radius)) {
            Toast.show('Please enter a valid radius');
            return;
        }

        setRadius(Number(newRadius) * 1000);
    };

    const handleRadiusInput = () => {
        setRadiusInput(!radiusInput);
    }

    const requestLocationPermission = async () => {
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
        if (location.canReset) {
            return;
        }

        Geolocation.getCurrentPosition(
            async (position) => {
                console.log('get current location:> ')
                AsyncStorage.setItem('latitude', position.coords.latitude.toString());
                AsyncStorage.setItem('longitude', position.coords.longitude.toString());

                actions.location({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    radius: radius
                });
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
                timeout: 30000,
            },
        );
    };

    function click_back() {
        props.navigation.goBack()
    }

    function FETCH_DATA() {
        set_loading_data("true");

        var data = new FormData();
        data.append("lat", region.latitude);
        data.append("lon", region.longitude);
        data.append("radius", radius);

        ApiCall.postRequest(Server.nearby_search, data, (response, error) => {
            console.log('nearby_search', response)
            set_loading_data("false")

            if (!response || response.status !== 'success' || response.locations.length === 0) {
                set_alert_dialog(true)

                setTimeout(() => {
                    set_alert_dialog(false)
                }, 1000);

                return;
            }

            if (response != undefined && response.status == "success") {
                if (response.locations.length > 0) {
                    set_alert_dialog(false)
                    set_list(response.locations)
                }
            }

        });
    }

    function click_venue(id) {
        props.navigation.navigate('SingleDetail', { "venue_id": id })
    }

    async function handleResetButtonPress() {
        // remove pin location
        AsyncStorage.removeItem('pin_location');

        let lat = await AsyncStorage.getItem('latitude');
        let long = await AsyncStorage.getItem('longitude');

        lat = lat ? lat : info.lat;
        long = long ? long : info.lon;

        setRegion({
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0421
        });

        setRadius(10000);

        actions.location({
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
            radius: 10000,
            canReset: false
        });

        FETCH_DATA();
    }

    function handleApplyButtonPress() {
        setGlobalLocation();

        FETCH_DATA();
    }

    function handleListMode() {
        setGlobalLocation();

        props.navigation.navigate('Categories');
    }

    function setGlobalLocation() {
        const data = {
            latitude: region.latitude,
            longitude: region.longitude,
            radius: radius,
            canReset: true
        };

        actions.location(data);
        // set pin location to the storage
        AsyncStorage.setItem('pin_location', JSON.stringify(data));
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        map: {
            flex: 1,
        },
        radiusText: {
            position: 'absolute',
            bottom: Platform.OS == 'ios' ? 40 : 16,
            left: 16,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 5,
            elevation: 3,
            zIndex: 1,
        },

        headerNavigation: {
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            width: '100%',
            top: Platform.OS == 'ios' ? 40 : 10,
            zIndex: 1,
            paddingLeft: 10,
            paddingRight: 10,
            alignItems: 'center',
            gap: 10,
        },

        applyButton: {
            backgroundColor: Design.primary_color_orange,
            paddingVertical: 7,
            paddingHorizontal: 25,
            borderRadius: 5,
            elevation: 3,
        },

        applyButtonContainer: {
            position: 'absolute',
            bottom: Platform.OS == 'ios' ? 40 : 13,
            right: 16,
            zIndex: 1,
            width: 120,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15
        }
    });

    return (
        <View style={styles.container}>

            <View style={styles.headerNavigation}>

                <TouchableOpacity
                    onPress={click_back}>
                    <Imageview
                        width={Platform.OS == "ios" ? 37 : 33}
                        height={Platform.OS == "ios" ? 37 : 33}
                        image_type={"local"}
                        url={GlobalImages.whiteBack}
                        tint_color={Design.dark_blue}
                    />
                </TouchableOpacity>

                <GooglePlacesAutocomplete
                    placeholder="Search for a location"
                    onPress={handleLocationSelect}
                    currentLocation={true}
                    currentLocationLabel='Current location'
                    query={{
                        key: Environment.GoogleMap.getAPIKey(),
                        language: 'en',
                    }}
                    fetchDetails={true}
                    styles={{
                        textInput: {
                            height: '100%',
                            backgroundColor: '#F6F6F6',
                            color: 'black',
                            marginVertical: 2,
                            borderWidth: 1,
                            borderColor: '#eee',

                            borderRadius: 15,
                            paddingHorizontal: 15,

                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            elevation: 5
                        },
                        listView: {
                            position: 'absolute',
                            top: 49,
                            left: 10,
                            right: 10,
                            borderRadius: 5,
                            elevation: 3,
                            zIndex: 1,
                            color: 'black'
                        },
                        description: {
                            color: 'black'
                        }
                    }}
                />

            </View>

            <MapView
                showsUserLocation={false}
                style={styles.map}
                initialRegion={{
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                    latitudeDelta: 0.0322,
                    longitudeDelta: 0.0421
                }}
                region={region}
            /*onRegionChangeComplete={newRegion => setRegion(newRegion)} */
            >

                <Marker coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude
                }}
                    draggable={true}
                    onDragEnd={handleMarkerDragEnd}
                    tracksViewChanges={(Platform.OS == "ios")}
                //image={require('../assets/flock_marker.png')}
                //style={{height: 70, width: 70}}
                >
                    <Image source={require('../assets/flock_marker.png')} style={{ height: 70, width: 70 }} />
                </Marker>
                <Circle
                    center={{ latitude: region.latitude, longitude: region.longitude }}
                    radius={radius}
                    strokeColor="rgba(158, 158, 255, 1)"
                    fillColor="rgba(158, 158, 255, 0.3)"
                />

                {list.map((marker, index) => {
                    //console.log('fdf', marker.venue_title);
                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: parseFloat(marker.lat),
                                longitude: parseFloat(marker.lon),
                            }}
                            tracksViewChanges={(Platform.OS == "ios")}
                        //image={require('../assets/venue_marker.png')}
                        //style={{width: "100%"}}
                        >
                            <Image source={require('../assets/venue_marker.png')} style={{ height: 60, width: 60 }} />

                            <Callout
                                tooltip={true}
                                onPress={click_venue.bind(this, marker.id)}
                                style={{
                                    top: 60
                                }}
                            >
                                <View style={{
                                    backgroundColor: 'white',
                                    width: 400,
                                    padding: 10,
                                    borderRadius: 10
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: Design.primary_color_orange,
                                        width: '100%', // or specify a fixed width
                                        flexWrap: 'wrap', // to enable text wrapping
                                    }} numberOfLines={2} ellipsizeMode='tail'>{marker.venue_title}</Text>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 5
                                    }}>
                                        <Imageview
                                            width={Platform.OS == "ios" ? 17 : 15}
                                            height={Platform.OS == "ios" ? 17 : 15}
                                            image_type={"external"}
                                            url={marker.cat_image}
                                            tint_color={Design.dark_blue}
                                            onLoad={() => console.log('images are loading..')}
                                        />
                                        <Text numberOfLines={2} ellipsizeMode="tail" style={{
                                            fontSize: 12,
                                            color: Design.black
                                        }}>{marker.cat_name}</Text>
                                    </View>

                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                        <Imageview
                                            width={Platform.OS == "ios" ? 17 : 15}
                                            height={Platform.OS == "ios" ? 17 : 15}
                                            image_type={"local"}
                                            url={GlobalImages.location}
                                            tint_color={Design.dark_blue}
                                        />
                                        <Text
                                            numberOfLines={2} ellipsizeMode="tail"
                                            style={{
                                                fontSize: 12,
                                                color: Design.black
                                            }}>
                                            {marker.location}
                                        </Text>
                                    </View>
                                </View>
                            </Callout>

                        </Marker>
                    )
                })}


            </MapView>

            <View style={styles.radiusText}>
                <TouchableOpacity
                    onPress={handleRadiusInput}>
                    {
                        radiusInput ?
                            <View>
                                <TextInput
                                    placeholder="Change radius"
                                    editable={true}
                                    placeholderTextColor={Design.grey}
                                    returnKeyType={"done"}
                                    value={radius}
                                    onChangeText={handleRadiusChange}
                                    style={{
                                        padding: Platform.OS == 'ios' ? 3 : 0,
                                        width: Platform.OS == 'ios' ? 130 : 120,
                                        color: 'black'
                                    }}
                                />

                                <TouchableOpacity
                                    onPress={handleRadiusInput}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: Platform.OS == 'ios' ? 0 : 3,
                                    }}
                                >
                                    <Imageview
                                        width={Platform.OS == "ios" ? 23 : 23}
                                        height={Platform.OS == "ios" ? 23 : 23}
                                        image_type={"local"}
                                        url={GlobalImages.available}
                                        tint_color={Design.grey}
                                    />
                                </TouchableOpacity>
                            </View>
                            :
                            <Text style={{ color: 'black' }}>
                                Radius: {(radius / 1000)} km
                            </Text>
                    }
                </TouchableOpacity>
            </View>

            <View style={styles.applyButtonContainer}>
                {location.canReset ?
                    <TouchableOpacity style={styles.applyButton}
                        onPress={handleResetButtonPress}>
                        <Text style={{
                            color: 'white'
                        }}>Reset</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.applyButton}
                        onPress={handleApplyButtonPress}>
                        <Text style={{
                            color: 'white'
                        }}>Apply</Text>
                    </TouchableOpacity>
                }


                <TouchableOpacity
                    onPress={handleListMode}
                >
                    <Imageview
                        width={Platform.OS == "ios" ? 27 : 23}
                        height={Platform.OS == "ios" ? 27 : 23}
                        image_type={"local"}
                        url={GlobalImages.menu}
                        tint_color={Design.primary_color_orange}
                    />
                </TouchableOpacity>
            </View>

            {
                loading_data == "true"
                    ?
                    <CardView
                        cardElevation={2.5}
                        cornerRadius={5}
                        style={{
                            backgroundColor: Design.white,
                            height: Platform.OS == "ios" ? 110 : 90,
                            width: '80%',
                            borderRadius: 10,
                            overFlow: "hidden",
                            position: 'absolute',
                            top: Platform.OS == "ios" ? 90 : 70,
                            left: '10%'

                        }}

                    >
                        <View style={{ marginTop: Platform.OS == "ios" ? 25 : 17 }}>
                            <Textview
                                text={'Hold On !'}
                                font_size={Design.font_18}
                                color={Design.black}
                                font_family={'medium'}
                                align_self={'center'}

                            />
                            <Textview
                                text={'We are finding Venues around you'}
                                font_size={Design.font_15}
                                color={Design.black}
                                font_family={'medium'}
                                align_self={'center'}
                                margin_top={Platform.OS == "ios" ? 10 : 2}

                            />
                        </View>

                    </CardView>
                    :
                    null
            }

            {
                loading_data == "true"
                    ?
                    <Lottie
                        style={{
                            width: "100%",
                            height: "100%",
                            alignSelf: 'center',
                            position: 'absolute',
                            alignSelf: 'center'
                        }}
                        autoPlay
                        source={require("../assets/ripple.json")}
                    >
                        {/* <View style={{ position: 'absolute', top: '45%', left: '39.8%' }}>
                            <Imageview
                                width={75}
                                height={75}
                                image_type={"local"}
                                url={currentImage}

                            />
                        </View> */}
                    </Lottie>
                    :
                    null
            }


            <Dialog
                onTouchOutside={() => {
                    set_alert_dialog(false)
                }}
                width={0.8}
                visible={alert_dialog}
                dialogAnimation={new ScaleAnimation()}
                onHardwareBackPress={() => {
                    set_alert_dialog(false)
                    return true;
                }}
                actions={[
                    <DialogButton
                        text="DISMISS"
                        onPress={() => {
                            set_alert_dialog(false)
                        }}
                        key="button-1"
                    />,
                ]}
                dialogStyle={{ borderRadius: 10, overflow: 'hidden' }}
            >
                <DialogContent>
                    <View>

                        <Imageview
                            width={190}
                            height={190}
                            image_type={"local"}
                            align_self={'center'}
                            url={GlobalImages.no_data}
                        />
                        <Textview
                            text={"Currently there is no venue near you!"}
                            color={Design.black}
                            font_family={"medium"}
                            font_size={Design.font_15}
                            text_align={'center'}
                        />

                    </View>
                </DialogContent>
            </Dialog>

        </View>
    )
}

const mapStateToProps = state => ({
    location: state.global.location,
    info: state.info.info,
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);