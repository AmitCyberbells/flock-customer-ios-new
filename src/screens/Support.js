import React, { useState, useEffect, useCallback } from "react";
import { View, Image, TextInput, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import Snackbar from "react-native-snackbar";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";

function Support(props) {

    const { info } = props;
    const [message, set_message] = useState("")
    const [loader, setLoader] = useState(false)
    const [title, setTitle] = useState('');

    function click_back() {
        props.navigation.goBack()
        console.log(info);
    }

    function continueClick() {
        if (message == "") {
            Snackbar.show({
                text: 'Please enter your query',
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
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("msg", message);
        data.append("name", info.first_name + ' ' + info.last_name);
        data.append("email", info.email);
        data.append("mobile", info.phone);
        data.append('title', title);

        console.log(Server.spoton);
        console.log(data);

        ApiCall.postRequest(Server.spoton, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                Snackbar.show({
                    text: 'Your query submit successfully',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
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
                        text={'Support'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>

                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />

            </View>

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 20,
                    height: 40,
                    backgroundColor: Design.white,
                    marginTop: Platform.OS == "ios" ? 25 : 20,
                    paddingHorizontal: 20
                }}
            >
                <Textview
                    text={info.first_name + ' ' + info.last_name}
                    font_family={"regular"}
                    color={Design.black}
                    font_size={Design.font_14}
                />
            </CardView>

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 20,
                    height: 40,
                    backgroundColor: Design.white,
                    marginTop: Platform.OS == "ios" ? 25 : 20,
                    paddingHorizontal: 20
                }}
            >
                <Textview
                    text={info.email}
                    font_family={"regular"}
                    color={Design.black}
                    font_size={Design.font_14}
                />

            </CardView>

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 20,
                    height: 40,
                    backgroundColor: Design.white,
                    marginTop: Platform.OS == "ios" ? 25 : 20,
                    paddingHorizontal: 20
                }}
            >
                <Textview
                    text={info.phone}
                    font_family={"regular"}
                    color={Design.black}
                    font_size={Design.font_14}
                />
            </CardView>

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    //flexDirection: 'row',
                    width: '90%',
                    height: 40,
                    // justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    // alignSelf: 'flex-start',
                    marginHorizontal: 20,

                    backgroundColor: Design.white,
                    //paddingVertical: Platform.OS == "ios" ? 17 : 0,
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

                    placeholder="Subject"
                    multiline={true}
                    placeholderTextColor={Design.grey}
                    value={title}
                    onChangeText={value => setTitle(value)}
                />

            </CardView>

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    //flexDirection: 'row',
                    width: '90%',
                    height: 140,
                    // justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    // alignSelf: 'flex-start',
                    marginHorizontal: 20,

                    backgroundColor: Design.white,
                    //paddingVertical: Platform.OS == "ios" ? 17 : 0,
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
                        paddingLeft: 20,
                        paddingTop: 10,
                        fontSize: Design.font_14,
                        fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular

                    }}

                    placeholder="Enter your query"
                    multiline={true}
                    placeholderTextColor={Design.grey}
                    value={message}
                    onChangeText={value => set_message(value)}
                />

            </CardView>

            <Textview
                text={'Continue'}
                font_size={Design.font_17}
                color={Design.white}
                font_family={'regular'}
                text_align={'center'}
                bg_color={Design.primary_color_orange}
                margin_top={30}
                margin_horizontal={17}
                padding_vertical={Platform.OS == "ios" ? 15 : 10}
                radius={10}
                text_click={continueClick}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(Support);