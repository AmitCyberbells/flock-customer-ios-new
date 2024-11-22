import React, { useState, useEffect } from "react";
import { View, Platform, TouchableOpacity, StyleSheet } from "react-native"
import CSS from "../design/CSS";
import Imageview from "../component/Imageview";
import GlobalImages from "../global/GlobalImages";
import AnimatedLoader from 'react-native-animated-loader';
import APLNotificationCenter from "react-native-notification-center";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { Environment } from "../global/Environment";
import Global from "../global/Global";

export default function GooglePlaces(props) {

    const [loader, setloader] = useState(false);
    const lat = props.navigation.state.params ? props.navigation.state.params.lat : Global.latitude;
    const lng = props.navigation.state.params ? props.navigation.state.params.lng : Global.longitude;

    const [region, setRegion] = useState({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    useEffect(() => {
        
    }, []);

    function click_back() {
        props.navigation.goBack()
    }

    function donebtn() {

    }

    const handleLocationSelect = (data, details) => {
        APLNotificationCenter.getInstance().publish('address', {
            lat: details.geometry.location.lat,
            long: details.geometry.location.lng,
            address: data.description
        });

        setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003

        });

        props.navigation.goBack();
    }

    const style = StyleSheet.create({
        searchPlace: {
            textInput: {

                height: '100%', backgroundColor: '#F6F6F6',
                color: 'black',
                marginVertical: 2,
                borderWidth: 1,
                borderColor: '#eee',

                borderRadius: 15,
                paddingHorizontal: 15,
                shadowColor: '#eee',
                shadowRadius: 8,

            },

            textInputContainer: {
                marginTop: Platform.OS == 'ios' ? 5 : 0,
                marginHorizontal: 10,

            }
        },
        map: {
            flex: 1,
            height: '100%',
            width: '100%'
        }
    })

    return (

        <View
            style={[CSS.LoginBackground, { backgroundColor: 'white' }]}
        >
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: Platform.OS == 'ios' ? 50 : 20,
                    marginLeft: 10,
                    marginBottom: 5,

                }}
            >

                <TouchableOpacity onPress={() => click_back()}>
                    <Imageview
                        url={GlobalImages.back}
                        //url = {photo}
                        width={50}
                        height={50}
                        image_type={"local"}
                        resize_mode={"contain"}
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
                    styles={style.searchPlace}
                />

            </View>

            <MapView
                showsUserLocation={true}
                style={style.map}
                initialRegion={region}
                region={region}
            >

                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                    draggable={false}
                    image={require('../assets/flock_marker.png')}
                />
            </MapView>

            <AnimatedLoader
                visible={loader}
                overlayColor="rgba(255,255,255,0.19)"
                source={require('../images/loader.json')}
                animationStyle={{
                    width: 180,
                    height: 180
                }}
                speed={1}
            />

        </View>

    )
}