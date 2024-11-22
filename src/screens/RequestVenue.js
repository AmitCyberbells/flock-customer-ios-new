import React, { useState, useEffect, useCallback } from "react";
import { View, Image, TextInput, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native';
import CSS from "../design/CSS";
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages";
import Imageview from "../component/Imageview";
import Textview from "../component/Textview";
import CardView from "react-native-cardview";
import Snackbar from "react-native-snackbar";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import APLNotificationCenter from "react-native-notification-center";

function RequestVenue(props) {

    const { info, current_location } = props;
    const [loader, setLoader] = useState(false);

    const [venueName, setVenueName] = useState("");
    const [location, setLocation] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");

    useEffect(() => {

        var _notifyList = new Array();

        _notifyList.push(APLNotificationCenter.getInstance().subscribe('address', (info) => {

            setLat(info.lat.toString())
            setLong(info.long.toString())
            setLocation(info.address)

        }));
    })

    function click_back() {
        props.navigation.goBack();
    }

    function continueClick() {
        if (venueName == "") {
            Snackbar.show({
                text: 'Please enter the venue name',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else {
            NetInfo.fetch().then(state => {
                if (state.isConnected == false) {
                    Snackbar.show({
                        text: 'Please turn on your internet',
                        duration: Snackbar.LENGTH_SHORT,
                        fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                        backgroundColor: Design.primary_color_orange
                    });
                } else {
                    API_HIT()
                }
            });
        }
    }

    function API_HIT() {
        setLoader(true);

        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_name", venueName);
        data.append("venue_location", location);
        data.append("lat", lat);
        data.append("long", long);

        console.log(Server.request_venue);
        console.log(data);

        ApiCall.postRequest(Server.request_venue, data, (response, error) => {
            setLoader(false);

            if (response) {

                if (response.hasOwnProperty('status') && response.status == "success") {
                    Snackbar.show({
                        text: 'Your query submit successfully',
                        duration: Snackbar.LENGTH_SHORT,
                        fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                        backgroundColor: Design.primary_color_orange
                    });
                }
                props.navigation.goBack()
            }

        });

    }

    return (
        <View style={CSS.Favcontainer}>
            <Loader loader={loader} />

            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 35 : 10, alignItems: 'center', marginHorizontal: 6 }}>
                <TouchableOpacity
                    onPress={click_back}
                >
                    <Imageview
                        url={GlobalImages.back}
                        width={Platform.OS == "ios" ? 55 : 50}
                        height={Platform.OS == "ios" ? 55 : 50}
                        image_type={"local"}
                        resize_mode={"contain"}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <Textview
                        text={'Request a venue'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}
                    />
                </View>

                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />

            </View>

            <View style={{ marginHorizontal: 20, marginTop: 30 }}>
                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        width: '100%',
                        height: 40,
                        alignItems: 'flex-start',
                        backgroundColor: Design.white,
                        marginTop: Platform.OS == "ios" ? 25 : 20,
                    }}
                >
                    <TextInput
                        style={{
                            // height: '100%',
                            width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            alignSelf: 'flex-start',
                            color: Design.black,
                            paddingTop: 10,
                            paddingLeft: 20,
                            fontSize: Design.font_14,
                            fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                        }}

                        placeholder="Venue name"
                        multiline={true}
                        placeholderTextColor={Design.grey}
                        value={venueName}
                        onChangeText={value => setVenueName(value)}
                    />
                </CardView>

                <TouchableOpacity
                    style={{
                        marginTop: Platform.OS == "ios" ? 25 : 20,
                    }}
                    onPress={() => props.navigation.push('GooglePlaces')}>

                    <CardView
                        cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                        cornerRadius={10}
                        style={{
                            width: '100%',
                            height: 40,
                            alignItems: 'flex-start',
                            backgroundColor: Design.white,
                            padding: 10
                        }}
                    >

                        <Textview
                            text={location == '' ? 'Location (optional)' : location}
                            fontFamily={Platform.OS == "ios" ? Design.ios_regular : Design.android_regular}
                            color={Design.grey}
                            font_size={Design.font_14}
                        />

                    </CardView>
                </TouchableOpacity>

                <Textview
                    text={'Continue'}
                    font_size={Design.font_17}
                    color={Design.white}
                    font_family={'regular'}
                    text_align={'center'}
                    bg_color={Design.primary_color_orange}
                    margin_top={30}
                    //margin_horizontal={17}
                    padding_vertical={Platform.OS == "ios" ? 15 : 10}
                    radius={10}
                    text_click={continueClick}
                />
            </View>

        </View>
    )
}

const mapStateToProps = state => ({
    info: state.info.info,
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestVenue);