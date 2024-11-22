
import React, { useEffect, useRef, useState } from "react";
import { View, LogBox, Platform, StyleSheet, Modal, FlatList, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

import CSS from "../design/CSS"
import Textview from "../component/Textview"
import ImageView from "../component/Imageview"
import GlobalImages from "../global/GlobalImages"
import Design from "../design/Design"

import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import Snackbar from "react-native-snackbar";
import { NavigationActions, StackActions } from "react-navigation";


var userid;

export default function OTPScreen(props) {

    const [loader, setLoader] = useState(false)
    const [screenType, setScreenType] = useState(props.navigation.getParam('screenType', ''));
    const [type, setType] = useState(props.navigation.getParam('type', ''));
    const [userId, setuserId] = useState(props.navigation.getParam('userId', ''));

    const [otp, setOtp] = useState(['', '', '', '',]);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [firstname, setfirstname] = useState(props.navigation.getParam('first_name', ''))
    const [lastname, setlastname] = useState(props.navigation.getParam('last_name', ''))
    const [dateBirth, setdateBirth] = useState(props.navigation.getParam('dob', ''))
    const [email, setemail] = useState(props.navigation.getParam('email', ''))
    const [phone, setphone] = useState(props.navigation.getParam('phone', ''))
    const [mobile, setMobile] = useState(props.navigation.getParam('phone', ''))
    const [password, setpassword] = useState(props.navigation.getParam('password', ''))

    const [showToast, setShowToast] = useState(false);
    const [ToastMsg, setToastMsg] = useState('');
    const [receivedOTP, setReceivedOTP] = useState(props.navigation.getParam('otp', ''));
    const otpRefs = useRef([]);


    useEffect(() => {

        if (screenType == 'EditProfile') {
            if(type=="Email"){

            } else {
                var str = phone;
                var replaced = str.replace(/.(?=.{3,}$)/g, '*');
                setphone(replaced);

                console.log(phone, screenType)
            }
            
        } else {

            console.log(firstname, lastname,
                dateBirth,
                email,
                phone,
                password,
                receivedOTP)
        }


    }, []);


    useEffect(() => {

        otpRefs.current[0]?.focus();

    }, []);

    useEffect(() => {


        msgshow()

        const interval = setInterval(() => { msgshow() }, 3000)

        return () => {
            clearInterval(interval);
        };

    }, []);

    function msgshow() {
        setShowToast(false);
    }

    const handleChangeText = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < otp.length - 1) {
            otpRefs.current[index + 1]?.focus();
        }

    };

    const handleBackspace = (index) => {

        if (otp[index]) {

            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);

        } else if (index > 0) {

            otpRefs.current[index - 1]?.focus();

        }

    };

    function backbtn() {
        props.navigation.goBack()
    }

    function onRequestAgainClick() {

        console.log('Request OTP Again')
        ResendOTPApi()
    }

    function handleVerifyOTP() {

        console.log('Click Button')

        let enteredOtp = otp.join('');

        if (enteredOtp.length == 0) {
            setShowToast(true)
            setToastMsg('Enter OTP')

        } else {
            if (enteredOtp.length <= 3) {
                setShowToast(true)
                setToastMsg('Invalid OTP')

            } else {

                if (enteredOtp == receivedOTP) {

                    console.log('Hit User API')

                    if (screenType == 'EditProfile') {
                        console.log('Number Verify')
                        if(type == 'Email'){
                            EmailVerifyApi()
                        }else{
                            NumberVerifyApi()
                        }
                       
                    } else {
                        console.log('Register User')
                        UserApiCalling()
                    }

                } else {
                    setShowToast(true)
                    setToastMsg('Invalid OTP')
                }

                // props..navigate('Login')
            }
        }

    };

    function UserApiCalling() {
        setLoader(true)
        var data = new FormData();
        data.append("first_name", firstname);
        data.append("last_name", lastname);
        data.append("dob", dateBirth);
        data.append("email", email);
        data.append("phone", phone);
        data.append("password", password);

        console.log(data)
        console.log(Server.usersignup)

        ApiCall.postRequest(Server.usersignup, data, (response, error) => {
            setLoader(false)
            // //console.log(response)
            if (response != undefined && response.status == "success") {

                Snackbar.show({
                    text: response.message,
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

                //Alert.alert(`${response.message}`)

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });
            }
        });

    }

    function NumberVerifyApi() {

        // setLoader(true)

        var data = new FormData();
        data.append("user_id", userId);
        data.append("mobile", mobile);
        data.append("email", email);
        data.append("status", '1');

        console.log(data)
        console.log(Server.verify_mobile_status)

        ApiCall.postRequest(Server.verify_mobile_status, data, (response, error) => {

            setLoader(false)

            console.log(response)

            if (response != undefined && response.status == "success") {

                console.log(response)

                Snackbar.show({
                    text: 'Mobile Number Verified',
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });

                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: "CustomTabBar"
                        })
                    ]
                });
                props.navigation.dispatch(resetAction);

            } else {

                //Alert.alert(`${response.message}`)

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });
            }

        });

    }


    function EmailVerifyApi() {

        // setLoader(true)

        var data = new FormData();
        data.append("user_id", userId);
        data.append("email", email);
        data.append("status", '1');

        console.log(data)
        console.log(Server.verify_email_status)

        ApiCall.postRequest(Server.verify_email_status, data, (response, error) => {

            setLoader(false)

            console.log(response)

            if (response != undefined && response.status == "success") {

                console.log(response)

                Snackbar.show({
                    text: 'Email Number Verified',
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });

                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: "CustomTabBar"
                        })
                    ]
                });
                props.navigation.dispatch(resetAction);

            } else {

                //Alert.alert(`${response.message}`)

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });
            }

        });

    }
    function ResendOTPApi() {

        setReceivedOTP('')
        setLoader(true)

        var data = new FormData();
        data.append("mobile", mobile)
        data.append("email", email);

        data.append("type", 'customer');


        console.log(data)
        console.log(Server.verify_user)

        ApiCall.postRequest(Server.verify_email, data, (response, error) => {

            setLoader(false)

            if (response != undefined && response.status == "success") {

                console.log(response)
                setReceivedOTP(response.otp)

                Snackbar.show({
                    text: 'OTP sent successfully',
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });

            } else {

                Snackbar.show({
                    text: 'Something went wrong !',
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });
            }

        });


    }

    const renderItem = ({ item, index }) => (

        <View style={{ backgroundColor: Design.white, borderRadius: 8, paddingHorizontal: 0, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

            <TextInput
                ref={(ref) => (otpRefs.current[index] = ref)}
                style={[styles.textInput, focusedIndex === index && styles.focusedTextInput]}
                autoCorrect={false}
                autoCapitalize='none'
                keyboardType='number-pad'
                caretHidden
                placeholder='__'
                placeholderTextColor={Design.text_light_grey}
                color={Design.black}
                maxLength={1}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                        handleBackspace(index);
                    }
                }}
                onFocus={() => setFocusedIndex(index)}
                value={item}
            />

        </View>

    );


    return (

        <View style={{ flex: 1, backgroundColor: Design.bg_color }}>

            <Loader loader={loader} />

            <ScrollView
                contentContainerStyle={{ flex: 1, backgroundColor: Design.bg_color }}
            >

                <ImageView
                    width={Platform.OS == "ios" ? 125 : 113}
                    height={Platform.OS == "ios" ? 125 : 113}
                    align_self={'center'}
                    margin_top={Platform.OS == "ios" ? 80 : 45}
                    image_type={"local"}
                    url={GlobalImages.splash_logo}
                />

                <View style={{ position: 'absolute', marginTop: Platform.OS == "ios" ? 40 : 20, alignItems: 'flex-start', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>

                    <TouchableOpacity
                        onPress={backbtn}
                    >
                        <ImageView
                            url={GlobalImages.back}
                            width={Platform.OS == "ios" ? 55 : 50}
                            height={Platform.OS == "ios" ? 55 : 50}
                            image_type={"local"}
                            resize_mode={"contain"}
                        />

                    </TouchableOpacity>

                </View>

                <View>
                    <Textview
                        text={'Verify '+type}
                        font_size={Design.font_25}
                        color={Design.black}
                        font_family={'medium'}
                        align_self={'center'}
                        margin_top={35}
                    />
                </View>

                <View style={{ width: '70%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>

                    <Textview
                        text={`OTP code sent to `}
                        color={Design.black}
                        font_size={Design.font_15}
                        font_family={"semi_bold"}
                        margin_top={'15%'}
                    />

                    <Textview
                        text={screenType == 'EditProfile' ? phone : email}
                        color={Design.primary_color_orange}
                        font_size={Design.font_16}
                        font_family={"semi_bold"}
                        margin_top={5}
                    />

                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 50 }}>

                    <FlatList
                        data={otp}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />

                </View>

                <View style={{ height: '10%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 40, marginBottom: 50 }}>

                    <Textview
                        text={`Didn't receive code?  `}
                        color={Design.black}
                        font_size={Design.font_15}
                        font_family={"semi_bold"}

                        text_align={'center'}
                        align_self={'center'}
                    />

                    <Textview
                        text={` Request Again`}
                        color={Design.primary_color_orange}
                        font_size={Design.font_15}
                        font_family={"semi_bold"}
                        text_align={'center'}
                        align_self={'center'}
                        text_click={onRequestAgainClick}
                        active_opacity={0}
                    />

                </View>


                <TouchableOpacity
                    onPress={handleVerifyOTP}
                    style={[CSS.buttonView, { backgroundColor: Design.primary_color_orange, justifyContent: 'center' }]}>

                    <Textview
                        text={screenType == 'EditProfile' ? 'Verify' : 'Verify and Create Account'}
                        color={Design.white}
                        font_size={Design.font_16}
                        font_family={"semi_bold"}
                        align_self={'center'}
                        text_click={handleVerifyOTP}
                    />

                </TouchableOpacity>

            </ScrollView >

            {

                showToast == true ?

                    <Modal
                        isVisible={true}
                        transparent={true}
                        animationType='fade'
                    >
                        <View style={{ height: '100%', width: '100%', position: 'absolute', bottom: '6.5%', justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'center' }}>

                            <View style={{ minWidth: '37%', minHeight: '5%', backgroundColor: '#e6e5e3', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 20, paddingLeft: 5 }}>

                                <Textview
                                    text={ToastMsg}
                                    color={Design.black}
                                    font_size={Design.font_14}
                                    font_family={"regular"}
                                    align_self={'center'}
                                    margin_horizontal={15}
                                />

                            </View>

                        </View>

                    </Modal>

                    :

                    null

            }

        </View >

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

    textInput: {
        fontSize: 22,
        textAlign: 'center',
        paddingVertical: 0,
        paddingHorizontal: 0,
        width: 40,
        height: 40,
        borderRadius: 8,
    },

    focusedTextInput: {
        borderWidth: 1,
        borderColor: Design.primary_color_orange,
    },

    submitButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'blue',
        borderRadius: 5,
        alignItems: 'center',
    },

    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },

});
