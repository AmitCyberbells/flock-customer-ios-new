import React, { useState, useEffect } from "react"
import { View, Text, Platform, Image, TouchableOpacity, Alert, ImageBackground, TextInput, ScrollView } from "react-native"
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
import DatePicker from 'react-native-date-picker'
import moment from "moment"

var DateTime = '';
var DateTimeDifference = '';

export default function Register(props) {

    const [firstname, setfirstname] = useState('')
    const [lastname, setlastname] = useState('')
    const [dateBirth, setdateBirth] = useState('')
    const [email, setemail] = useState('')
    const [phone, setphone] = useState('');
    const [password, setpassword] = useState('')
    const [loader, setLoader] = useState(false)
    const [showPassword, setshowPassword] = useState(false)
    const [TermsCondition, setTermsCondition] = useState(false)
    const [open, setOpen] = useState(false)
    
    const current_date = new Date();

    const maxDate =  new Date(current_date);
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    
    const minDate = new Date(1940, 0, 1);
    const [date, setDate] = useState(maxDate)

    useEffect(() => {
        console.log('Date Time', DateTimeDifference)

    }, []);

    function registerClick() {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (firstname == "") {

            Snackbar.show({
                text: 'Please enter firstname',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (lastname == "") {
            Snackbar.show({
                text: 'Please enter lastname',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (dateBirth == '' || DateTimeDifference <= 17) {

            if (dateBirth == '') {
                Snackbar.show({
                    text: 'Select Date of Birt',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });

            } else if (DateTimeDifference <= 17) {

                Snackbar.show({
                    text: 'You are not 18 years old',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });

            } else {
                setTermsCondition(true)
            }

        }
        else if (email == "") {

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
        else if (phone == "") {

            Snackbar.show({
                text: 'Please enter phone',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (phone.length < 6 || phone.length > 15) {

            Snackbar.show({
                text: 'Please enter valid phone number',
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
        else if (TermsCondition == false) {

            Snackbar.show({
                text: 'Please agree with Terms & Condtions',
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
                    
                    OTPApi()
                }
            });
        }

        // props.navigation.navigate('HomeScreen')

    }

    // function UserApiCalling() {
      
    //     setLoader(true)
       
    //     var data = new FormData();
    //     data.append("first_name", firstname);
    //     data.append("last_name", lastname);
    //     data.append("dob", dateBirth);
    //     data.append("email", email);
    //     data.append("phone", phone);
    //     data.append("password", password);

    //     console.log(data)
    //     console.log(Server.usersignup)

    //     ApiCall.postRequest(Server.usersignup, data, (response, error) => {
    //         setLoader(false)
    //         //console.log(response)
    //         if (response != undefined && response.status == "success") {
    //             Snackbar.show({
    //                 text: 'Signup successfully',
    //                 duration: Snackbar.LENGTH_LONG,
    //                 fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
    //                 backgroundColor: "green"
    //             });
    //             props.navigation.goBack()
    //         } else {

    //             Alert.alert(response.message)
    //             Snackbar.show({
    //                 text: response.message,
    //                 duration: Snackbar.LENGTH_SHORT,
    //                 fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
    //                 backgroundColor: "red"
    //             });
    //         }
    //     });


    // }

    function OTPApi() {
      
        setLoader(true)
       
        var data = new FormData();
        data.append("email", email);
        data.append("mobile", phone);
        data.append("type", 'customer');

       
        console.log(data)
        console.log(Server.verify_user)

        ApiCall.postRequest(Server.verify_user, data, (response, error) => {
            setLoader(false)
          
            //console.log(response)
          
            if (response != undefined && response.status == "success") {
                
                Snackbar.show({
                    text: 'OTP sent Successfully',
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });

                //console.log(response)

                let obj = {

                    "first_name": firstname,
                    "last_name": lastname,
                    "dob": dateBirth,
                    "email": email,
                    "phone": phone,
                    "password": password,
                    "otp":response.otp,
                    "type": 'Email',
                }

                props.navigation.navigate('OTPScreen', obj)

               // props.navigation.goBack()

            } else {

                Alert.alert(response.message)
                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });
            }
        });


    }

    function confirmDateTime(value) {
        // console.log(value)
        setOpen(false)
        setdateBirth(moment(new Date(value)).format("DD-MM-YYYY"))

        DateTime = (moment(new Date(value)).format("YYYY-MM-DD"))
        DateTimeDifference = moment().diff(`${DateTime.toString()}`, 'years')


        if (DateTimeDifference <= 17) {
            setTermsCondition(false)
        } else {
            setTermsCondition(true)
        }



    }


    function loginClick() {
        props.navigation.navigate('Login')
    }


    return (
        <ImageBackground
            source={GlobalImages.login_back}
            style={CSS.LoginBackground}
        >
            <Loader loader={loader} />

            <DatePicker
                modal
                open={open}
                date={date}
                maximumDate={maxDate}
                minimumDate={minDate}
                onConfirm={(date) => confirmDateTime(date)}
                mode={"date"}
                onCancel={() => {
                    setOpen(false)
                }}
            />

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
                    text={'Register'}
                    font_size={Design.font_25}
                    color={Design.black}
                    font_family={'medium'}
                    align_self={'center'}
                    margin_top={35}
                />
                <Textview
                    text={'Create your account'}
                    font_size={Design.font_18}
                    color={Design.black}
                    font_family={'regular'}
                    align_self={'center'}
                    margin_top={Platform.OS == "ios" ? 15 : 5}
                />
                <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                    <CardView
                        cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                        cornerRadius={10}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 20,
                            backgroundColor: Design.white,
                            paddingVertical: Platform.OS == "ios" ? 17 : 0,
                            marginTop: 25,
                            flex: 1
                        }}
                    >

                        <TextInput
                            style={{
                                flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                            }}
                            placeholder="First Name"
                            placeholderTextColor={Design.grey}
                            returnKeyType={"done"}
                            onChangeText={value => setfirstname(value)}

                        />
                    </CardView>
                    <CardView
                        cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                        cornerRadius={10}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                            backgroundColor: Design.white,
                            paddingVertical: Platform.OS == "ios" ? 17 : 0,
                            marginTop: 25,
                            flex: 1
                        }}
                    >

                        <TextInput
                            style={{
                                flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                            }}
                            placeholder="Last Name"
                            placeholderTextColor={Design.grey}
                            onChangeText={value => setlastname(value)}
                        />
                    </CardView>
                </View>
                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        backgroundColor: Design.white,
                        paddingVertical: Platform.OS == "ios" ? 16 : 10,
                        marginTop: 25
                    }}
                >

                    <View style={{ flex: 1 }}>

                        <Textview
                            text={dateBirth == "" ? "Date of Birth" : dateBirth}
                            font_size={Design.font_14}
                            color={dateBirth == "" ? Design.grey : Design.black}
                            font_family={'regular'}
                            margin_left={20}
                            text_click={() => setOpen(true)}
                        />
                    </View>

                    {/* <TextInput
                            style={{
                                flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                            }}
                            placeholder="Enter Date of Birth"
                            placeholderTextColor={Design.grey}
                            editable={false}
                            onChangeText={value => setdateBirth(value)}
                        /> */}
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
                        placeholder="Enter email address"
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
                        placeholder="Enter phone number"
                        placeholderTextColor={Design.grey}
                        keyboardType={'phone-pad'}
                        onChangeText={value => setphone(value)}
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

                <View style={{ flexDirection: 'row', width: '90%', marginTop: 20, alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-start', marginHorizontal: '10%' }}>

                    <TouchableOpacity onPress={() => {
                        if (TermsCondition === false) {
                            setTermsCondition(true)
                        }
                        else {
                            setTermsCondition(false)
                        }
                    }}>
                        <Imageview
                            width={25}
                            height={25}
                            margin_left={5}
                            align_self={'center'}
                            image_type={"local"}
                            tint_color={Design.primary_color_orange}
                            url={TermsCondition === false ? GlobalImages.checkbox : GlobalImages.checkbox_fill}
                        />

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('TermsConditionsWebview')}
                    >
                        <Text style={{ width: '48%', paddingHorizontal: 10, color: Design.black }}>

                            I am 18 years of age and agree to the{' '}
                            <Text style={{ textDecorationLine: 'underline', color: Design.primary_color_orange }}>
                                Terms and Conditions
                            </Text>
                            {' '}as set out by the{' '}

                            <Text style={{ textDecorationLine: 'underline', color: Design.primary_color_orange }}>
                                User Agreement.
                            </Text>{' '}

                        </Text>

                    </TouchableOpacity>
                </View>

                <View>

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

                </View>

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

                <View style={CSS.HaveAccount}>
                    <Textview
                        text={"Have an account? "}
                        font_size={Design.font_12}
                        color={Design.grey}
                        font_family={'regular'}
                        align_self={'center'}

                    />
                    <Textview
                        text={'Login'}
                        font_size={Design.font_12}
                        color={Design.primary_color_orange}
                        text_decoration_line={'underline'}
                        font_family={'regular'}
                        align_self={'center'}
                        text_click={loginClick}
                    />

                </View>

            </ScrollView>
        </ImageBackground>
    )
}
