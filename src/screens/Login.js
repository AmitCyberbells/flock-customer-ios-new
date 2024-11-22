import React, { useState, useEffect } from "react"
import { View, Text, Platform, Image, Alert, ImageBackground, TextInput, ScrollView, TouchableOpacity } from "react-native"
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
import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import firebase from '@react-native-firebase/app';


var token = "";
var userid;

function Login(props) {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [loader, setLoader] = useState(false)
    const [showPassword, setshowPassword] = useState(false)


    useEffect(() => {
        get_token()

    }, []);

    async function updateDeviceToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        
        if (!fcmToken) return;

        var data = new FormData();
        data.append('user_id', userid);
        data.append('device_token', fcmToken);
        data.append('device_type', Platform.OS);

        ApiCall.postRequest(Server.update_device_token, data, (response, error) => {
            console.log({ response })

            if (error || response === undefined) {
                
                return;
            }

            if (response.status == 'success') {
               
            } else {
                console.log("er = " + error)
            }
        })
    }

    async function get_token() {
        const fcmT = await AsyncStorage.getItem('fcmToken');
        if (fcmT) {
            token = fcmT;
            return;
        }

        firebase.messaging().getToken()
            .then(async fcmToken => {
                if (fcmToken) {
                    token = fcmToken
                    console.log("get_get_fcm_token_new")
                    await AsyncStorage.setItem("device_token", fcmToken);
                    console.log({fcmToken})

                } else {
                    console.log('else')
                }
            });
    }

    function registerClick() {
        props.navigation.navigate('Register');
    }

    function continueClick() {

        let reg = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;

        if (email == "") {

            Snackbar.show({
                text: 'Please enter email',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (reg.test(email) === false) {
            Snackbar.show({
                text: 'Please enter correct email',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }

        else if (password == "") {

            Snackbar.show({
                text: 'Please enter password',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (password.length < 6) {

            Snackbar.show({
                text: 'Please enter atleast 6 characters',
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
                    UserApiCalling()
                }
            });
        }
    }

    function UserApiCalling() {
        setLoader(true)
        var data = new FormData();
        data.append("email", email);
        data.append("password", password);
        data.append("device_token", token);
        data.append("device_type", Platform.OS);

        console.log(data)
        console.log(Server.loginuser)

        ApiCall.postRequest(Server.loginuser, data, (response, error) => {
            setLoader(false)

            if (response != undefined && response.status == "success") {

                let { actions } = props;
                console.log(response);
                actions.saved_user_info(response.info);
                userid = response.info.user_id;

                AsyncStorage.setItem("user_details", JSON.stringify(response.info));
                AsyncStorage.setItem('device_token', token);
                AsyncStorage.setItem("login", "true");
                AsyncStorage.setItem("userid", response.info.user_id);

                console.log(response.info)

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });

                loginSuccess(response.info);
                updateDeviceToken();

            } else {
                Alert.alert(response.message)
                // Snackbar.show({
                //     text: response.message,
                //     duration: Snackbar.LENGTH_SHORT,
                //     fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                //     backgroundColor: "red"
                // });
            }
        });

    }

    function loginSuccess(user) {
        props.navigation.replace('CustomTabBar');
    }

    function forgotPassword() {
        console.log("click")
        props.navigation.navigate("ForgotPassword")
    }


    return (
        <ImageBackground
            source={GlobalImages.login_back}
            style={CSS.LoginBackground}
        >
            <Loader loader={loader} />
            <ScrollView showsVerticalScrollIndicator={false}>

                <Imageview
                    width={Platform.OS == "ios" ? 125 : 113}
                    height={Platform.OS == "ios" ? 125 : 113}
                    align_self={'center'}
                    margin_top={Platform.OS == "ios" ? 80 : 45}
                    image_type={"local"}
                    url={GlobalImages.splash_logo}
                />
                <Textview
                    text={'Login'}
                    font_size={Design.font_25}
                    color={Design.black}
                    font_family={'medium'}
                    align_self={'center'}
                    margin_top={35}
                />
                <Textview
                    text={'Login to your account'}
                    font_size={Design.font_18}
                    color={Design.black}
                    font_family={'regular'}
                    align_self={'center'}
                    margin_top={Platform.OS == "ios" ? 15 : 5}
                />
                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        backgroundColor: Design.white,
                        paddingVertical: Platform.OS == "ios" ? 17 : 0,
                        marginTop: 27
                    }}
                >

                    <TextInput
                        style={{
                            flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                        }}
                        placeholder="Enter email address"
                        autoCapitalize='none'
                        placeholderTextColor={Design.grey}
                        onChangeText={value => setemail(value)}
                    />
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
                        placeholder="Enter password"
                        placeholderTextColor={Design.grey}
                        secureTextEntry={showPassword === false ? true : false}
                        onChangeText={value => setpassword(value)}
                    />
                    <TouchableOpacity onPress={() => {
                        if (showPassword === false) {
                            setshowPassword(true)
                        }
                        else {
                            setshowPassword(false)
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
                <View style={CSS.ForgetPass}>
                    <Textview
                        text={'Forgot password? '}
                        font_size={Design.font_12}
                        color={Design.grey}
                        font_family={'regular'}
                        align_self={'center'}
                        margin_top={Platform.OS == "ios" ? 15 : 5}
                    />
                    <Textview
                        text={'Reset here'}
                        font_size={Design.font_12}
                        color={Design.primary_color_orange}
                        text_decoration_line={'underline'}
                        font_family={'regular'}
                        align_self={'center'}
                        margin_top={Platform.OS == "ios" ? 15 : 5}
                        text_click={forgotPassword}
                    />

                </View>
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
                {/* <Textview
                    text={'or connect with'}
                    font_size={Design.font_15}
                    color={Design.light_grey}
                    font_family={'regular'}
                    align_self={'center'}
                    margin_top={Platform.OS == "ios" ? 45 : 30}
                />
                <View style={CSS.SocilaLogin}>
                    <Imageview
                        width={Platform.OS == "ios" ? 70 : 60}
                        height={Platform.OS == "ios" ? 70 : 60}
                        align_self={'center'}
                        image_type={"local"}
                        url={GlobalImages.google}
                    />
                    <Imageview
                        width={Platform.OS == "ios" ? 70 : 60}
                        height={Platform.OS == "ios" ? 70 : 60}
                        align_self={'center'}
                        image_type={"local"}
                        url={GlobalImages.facebook}
                    />
                    <Imageview
                        width={Platform.OS == "ios" ? 70 : 60}
                        height={Platform.OS == "ios" ? 70 : 60}
                        align_self={'center'}
                        image_type={"local"}
                        url={GlobalImages.apple}
                    />
                </View> */}

                <View style={CSS.DontHaveAccount}>
                    <Textview
                        text={"Don't have account? "}
                        font_size={Design.font_12}
                        color={Design.grey}
                        font_family={'regular'}
                        align_self={'center'}
                        margin_top={Platform.OS == "ios" ? 15 : 5}
                    />

                    <Textview
                        text={'Create New'}
                        font_size={Design.font_12}
                        color={Design.primary_color_orange}
                        text_decoration_line={'underline'}
                        font_family={'regular'}
                        align_self={'center'}
                        margin_top={Platform.OS == "ios" ? 15 : 5}
                        text_click={registerClick}
                    />


                </View>
            </ScrollView>
        </ImageBackground>
    )
}
const mapStateToProps = state => ({
    info: state.info.info,
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);