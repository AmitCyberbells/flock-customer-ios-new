import React, { useState, useEffect } from "react"
import { View, Text, Platform, Image, TouchableOpacity, StatusBar, ImageBackground, TextInput, ScrollView } from "react-native"
import Design from "../design/Design"
import Textview from "../component/Textview"
import CSS from "../design/CSS"
import Imageview from "../component/Imageview"
import GlobalImages from "../global/GlobalImages"
import CardView from 'react-native-cardview'
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from "react-native-snackbar";
import { StackActions, NavigationActions } from "react-navigation";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
function ChangePassword(props) {
    const { info } = props;
    const [old_pass, set_old_pass] = useState('')
    const [new_pass, set_new_pass] = useState('')
    const [confirm_pass, set_confirm_pass] = useState('')
    const [loader, setLoader] = useState(false)

    const [showPassword, set_showPassword] = useState(false)
    const [showNewPassword, set_showNewPassword] = useState(false)
    const [showConfirmPassword, set_showConfirmPassword] = useState(false)

    useEffect(() => {


    }, []);

    function registerClick() {

        if (old_pass == "") {

            Snackbar.show({
                text: 'Please enter old password',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (old_pass.length < 6) {

            Snackbar.show({
                text: 'Please enter atleast 6 characters in old password',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (new_pass == "") {
            Snackbar.show({
                text: 'Please enter new password',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (new_pass.length < 6) {

            Snackbar.show({
                text: 'Please enter atleast 6 characters in new password',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (confirm_pass == "") {
            Snackbar.show({
                text: 'Please enter confirm password',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (confirm_pass.length < 6) {

            Snackbar.show({
                text: 'Please enter atleast 6 characters in confirm password',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (new_pass != confirm_pass) {

            Snackbar.show({
                text: 'Confirm password not matched',
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
                    change_password_api()
                }
            });
        }


    }
    function change_password_api() {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("oldPass", old_pass);
        data.append("newpass", new_pass);

        ApiCall.postRequest(Server.change_password, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                Snackbar.show({
                    text: 'Password update successfully',
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: "Login"
                        })
                    ]
                });
                props.navigation.dispatch(resetAction);

            } else {

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });
            }
        });


    }

    function click_back() {
        props.navigation.goBack()
    }


    return (
        <View

            style={CSS.Favcontainer}
        >
            <Loader loader={loader} />
            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 40 : 5, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>
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
                        text={'Change Password'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>

            <ScrollView showsVerticalScrollIndicator={false}>






                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        backgroundColor: Design.white,
                        paddingVertical: Platform.OS == "ios" ? 17 : 0,
                        marginTop: 50
                    }}
                >

                    <TextInput
                        style={{
                            flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                        }}
                        placeholder="Enter old password"
                        placeholderTextColor={Design.grey}
                        secureTextEntry={showPassword === false ? true : false}
                        onChangeText={value => set_old_pass(value)}
                    />
                    <TouchableOpacity onPress={() => {
                        if (showPassword === false) {
                            set_showPassword(true)
                        }
                        else {
                            set_showPassword(false)
                        }
                    }}>
                        <Imageview
                            width={25}
                            height={25}
                            margin_right={10}
                            align_self={'center'}
                            image_type={"local"}
                            tint_color={Design.grey}
                            url={showPassword === false ? GlobalImages.eye : GlobalImages.hide}
                        />
                    </TouchableOpacity>

                </CardView>

                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        backgroundColor: Design.white,
                        paddingVertical: Platform.OS == "ios" ? 17 : 0,
                        marginTop: Platform.OS == "ios" ? 25 : 20,
                    }}
                >

                    <TextInput
                        style={{
                            flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                        }}
                        placeholder="Enter new password"
                        placeholderTextColor={Design.grey}
                        secureTextEntry={showNewPassword === false ? true : false}
                        onChangeText={value => set_new_pass(value)}
                    />

                    <TouchableOpacity onPress={() => {
                        if (showNewPassword === false) {
                            set_showNewPassword(true)
                        }
                        else {
                            set_showNewPassword(false)
                        }
                    }}>
                        <Imageview
                            width={25}
                            height={25}
                            margin_right={10}
                            align_self={'center'}
                            image_type={"local"}
                            tint_color={Design.grey}
                            url={showNewPassword === false ? GlobalImages.eye : GlobalImages.hide}
                        />
                    </TouchableOpacity>

                </CardView>

                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        backgroundColor: Design.white,
                        paddingVertical: Platform.OS == "ios" ? 17 : 0,
                        marginTop: Platform.OS == "ios" ? 25 : 20,
                    }}
                >

                    <TextInput
                        style={{
                            flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                        }}
                        placeholder="Enter confirm password"
                        placeholderTextColor={Design.grey}
                        secureTextEntry={showConfirmPassword === false ? true : false}
                        onChangeText={value => set_confirm_pass(value)}
                    />

                    <TouchableOpacity onPress={() => {
                        if (showConfirmPassword === false) {
                            set_showConfirmPassword(true)
                        }
                        else {
                            set_showConfirmPassword(false)
                        }
                    }}>
                        <Imageview
                            width={25}
                            height={25}
                            margin_right={10}
                            align_self={'center'}
                            image_type={"local"}
                            tint_color={Design.grey}
                            url={showNewPassword === false ? GlobalImages.eye : GlobalImages.hide}
                        />
                    </TouchableOpacity>


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
                    text_click={registerClick}


                />

            </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);