import React, { useState, useEffect } from "react"
import { View, Text, Platform, Image, TouchableOpacity, StatusBar, ImageBackground, TextInput, ScrollView, Alert } from "react-native"
import Design from "../design/Design"
import Textview from "../component/Textview"
import CSS from "../design/CSS"
import Imageview from "../component/Imageview"
import GlobalImages from "../global/GlobalImages"
import CardView from 'react-native-cardview'
import Loader from '../component/AnimatedLoader';
import Server, { BASE_IMG_URL } from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from "react-native-snackbar";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';
import DatePicker from 'react-native-date-picker'
import moment from "moment"

function EditProfile(props) {

    const { info } = props;
    const [popup_dialog, set_popup_dialog] = useState(false)
    const [firstname, setfirstname] = useState(info.first_name)
    const [lastname, setlastname] = useState(info.last_name)
    const [dateBirth, setdateBirth] = useState(info.dob)
    const [email, setemail] = useState(info.email)
    const [phone, setphone] = useState('');
    const [image, setimage] = useState('');
    const [imageurl, setimageurl] = useState(info.image);
    const [loader, setLoader] = useState(false)
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(new Date())
    const [mobileVerified, setMobileVerified] = useState('0');
    const [emailVerified, setEmailVerified] = useState('0');


    useEffect(() => {
        GetUserApi()
    }, []);

    useEffect(() => {

        var str = info.phone;
        var replaced = str.replace(/.(?=.{3,}$)/g, '*');
        setphone(replaced);

        console.log(phone)

    }, []);

    function click_back() {
        props.navigation.goBack()
    }

    function getcameraImage() {
        set_popup_dialog(false)
        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 150,
            maxHeight: 150,
            quality: 0.9,
            includeBase64: true
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = response
                setimage(source.assets[0])
                setimageurl(source.assets[0].uri)
                console.log(source.assets[0].uri)
            }
        });
    }

    function getGalleryImage() {

        console.log("get_call")
        set_popup_dialog(false)

        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 150,
            maxHeight: 150,
            quality: 0.9,
            includeBase64: true
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                let source = response
                setimage(source.assets[0])
                setimageurl(source.assets[0].uri)
                console.log(source.assets[0].uri)

            }
        });
    }

    function update_photo_click() {
        set_popup_dialog(true)
    }

    function removePhoto() {

        set_popup_dialog(false)
        setimageurl(BASE_IMG_URL+"/profileflock.jpg")

    }

    function GetUserApi() {

        setLoader(true)

        var data = new FormData();
        data.append("user_id", info.user_id)

        console.log(data)
        console.log(Server.userdetails)

        ApiCall.postRequest(Server.userdetails, data, (response, error) => {

            setLoader(false)

            if (response != undefined && response.status == "success") {

                console.log(response.userdata)
                console.log(response.userdata)

                setemail(response.userdata.email)
                setfirstname(response.userdata.first_name)
                setlastname(response.userdata.last_name)
                setphone(response.userdata.phone)
               // setimage(response.userdata.image)
                setimageurl(response.userdata.image !='' ? Server.imgURL+response.userdata.image : '')

                setMobileVerified(response.userdata.mobile_verified)
                setEmailVerified(response.userdata.email_verified)

            } else {

                Snackbar.show({
                    text: `Something went wrong !`,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });

            }
        });

    }

    function EditProfile() {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (image == "" && imageurl=='') {

            Snackbar.show({
                text: 'Please upload profile image',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (firstname == "") {

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
        // else if (dateBirth == "") {
        //     Snackbar.show({
        //         text: 'Please enter date of birth',
        //         duration: Snackbar.LENGTH_SHORT,
        //         fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
        //         backgroundColor: Design.primary_color_orange
        //     });
        // }
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
        data.append("user_id", info.user_id);
        data.append("first_name", firstname);
        data.append("last_name", lastname);
        //data.append("dob", dateBirth);
        data.append("email", email);
        data.append("phone", phone);

        data.append('file', JSON.stringify(image));

        if(image != ''){
            /* data.append('file', {
                uri: image,
                name: `image.jpg`,
                type: 'image/jpg',
            }); */
            
        }
       
         for (var key in data) {
            for (var key1 in data[key]) {
            console.log('key', data[key][key1]);
            }
            
        }
        console.log(data)
        console.log(Server.myprofile)

        ApiCall.postRequest(Server.myprofile, data, (response, error) => {
            setLoader(false)
            console.log("response_test")
            console.log(error)
            //console.log(response)
            if (response != undefined && response.status == "success") {
                let { actions } = props;
                console.log(response)
                actions.saved_user_info(response.myprofile[0]);
                AsyncStorage.setItem("user_details", JSON.stringify(response.myprofile[0]));
                Snackbar.show({
                    text: 'Profile update successfully',
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });
                props.navigation.goBack()
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

    function verifyAPI() {

        console.log('Verify API')

        VerifyPhoneApi()

    }
    
    function VerifyEmailApi() {

        setLoader(true)

        var data = new FormData();
        data.append("email", email);
        data.append("type", 'customer');


        console.log(data)
        console.log(Server.verify_user)

        ApiCall.postRequest(Server.verify_email, data, (response, error) => {
            setLoader(false)


            if (response != undefined && response.status == "success") {

                console.log(response)


                Snackbar.show({
                    text: 'OTP sent successfully',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });


                let obj = {
                    'email': email,
                    'screenType': 'EditProfile',
                    'type':'Email',
                    'userId': info.user_id,
                    'otp': response.otp,
                }

                props.navigation.navigate('OTPScreen', obj)



                // //console.log(response)

            } else {

                //Alert.alert(response.message)
                Snackbar.show({
                    text: `Something went wrong !`,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });
            }
        });


    }

    function VerifyPhoneApi() {

        setLoader(true)

        var data = new FormData();
        data.append("mobile", phone)
        data.append("email", email);
        data.append("type", 'customer');


        console.log(data)
        console.log(Server.verify_email)

        ApiCall.postRequest(Server.verify_email, data, (response, error) => {
            setLoader(false)


            if (response != undefined && response.status == "success") {

                console.log(response)


                Snackbar.show({
                    text: 'OTP sent successfully',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "green"
                });


                let obj = {
                    'email': email,
                    'phone': info.phone,
                    'screenType': 'EditProfile',
                    'type':'Phone',
                    'userId': info.user_id,
                    'otp': response.otp,
                }

                props.navigation.navigate('OTPScreen', obj)



                // //console.log(response)

            } else {

                //Alert.alert(response.message)
                Snackbar.show({
                    text: `Something went wrong !`,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: "red"
                });
            }
        });


    }

    const confirmDateTime = (value) => {

        setOpen(false)
        setdateBirth(moment(new Date(value)).format("DD-MM-YYYY"))

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
                onConfirm={(date) => confirmDateTime(date)}
                mode={"date"}
                onCancel={() => {
                    setOpen(false)
                }}
            />

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
                        text={'Edit Profile'}
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
                    cornerRadius={80}
                    style={{
                        backgroundColor: Design.white,
                        height: Platform.OS == "ios" ? 160 : 140,
                        width: Platform.OS == "ios" ? 160 : 140,
                        padding: Platform.OS == "ios" ? 12.5 : 12.5,
                        alignSelf: 'center',
                        marginTop: 20
                    }}
                >
                    <Imageview
                        url={imageurl != '' ? imageurl : BASE_IMG_URL+'/profileflock.jpg'}
                        width={Platform.OS == "ios" ? 135 : 115}
                        height={Platform.OS == "ios" ? 135 : 115}
                        radius={Platform.OS == "ios" ? 80 : 57}
                        align_self={'center'}
                        image_type={"server"}
                        resize_mode={"cover"}
                    />
                </CardView>
                <Textview
                    text={"Update Photo"}
                    font_family={"medium"}
                    color={Design.light_grey}
                    text_align={'center'}
                    font_size={Design.font_14}
                    margin_top={10}
                    text_click={update_photo_click}
                />

                <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 30 }}>
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
                            editable={true}
                            placeholderTextColor={Design.grey}
                            returnKeyType={"done"}
                            value={firstname}
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
                            editable={true}
                            placeholderTextColor={Design.grey}
                            value={lastname}
                            onChangeText={value => setlastname(value)}
                        />
                    </CardView>
                </View>

                {/* <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        backgroundColor: Design.white,
                        paddingVertical: Platform.OS == "ios" ? 17 : 14,
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

                     <TextInput
                        style={{
                            flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                        }}
                        placeholder="Enter Date of Birth"
                        placeholderTextColor={Design.grey}
                        value={dateBirth}
                        onChangeText={value => setdateBirth(value)}
                    /> 
                </CardView> */}

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
                        editable={true}
                        placeholderTextColor={Design.grey}
                        value={email}
                        onChangeText={value => setemail(value)}
                    />

                    {
                        emailVerified == '1' ?
                            <Imageview
                                url={GlobalImages.verifyBadge}
                                width={Platform.OS == "ios" ? 25 : 20}
                                height={Platform.OS == "ios" ? 25 : 20}
                                image_type={"local"}
                                resize_mode={"contain"}
                                margin_right={10}
                            />

                            :

                            <Textview
                                text={"Verify"}
                                font_family={"medium"}
                                color={Design.primary_color_orange}
                                text_align={'center'}
                                font_size={Design.font_14}
                                text_click={VerifyEmailApi}
                                margin_right={10}
                                active_opacity
                            />
                    }

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
                        editable={true}
                        value={phone}
                        onChangeText={value => setphone(value)}
                    />

                    {
                        mobileVerified == '1' ?

                            <Imageview
                                url={GlobalImages.verifyBadge}
                                width={Platform.OS == "ios" ? 25 : 20}
                                height={Platform.OS == "ios" ? 25 : 20}
                                image_type={"local"}
                                resize_mode={"contain"}
                                margin_right={10}
                            />
                            :
                            <Textview
                                text={"Verify"}
                                font_family={"medium"}
                                color={Design.primary_color_orange}
                                text_align={'center'}
                                font_size={Design.font_14}
                                text_click={verifyAPI}
                                margin_right={10}
                                active_opacity={0}
                            />
                    }

                </CardView>

                <Textview
                    text={'Update'}
                    font_size={Design.font_17}
                    color={Design.white}
                    font_family={'regular'}
                    text_align={'center'}
                    bg_color={Design.primary_color_orange}
                    margin_top={60}
                    margin_horizontal={17}
                    padding_vertical={Platform.OS == "ios" ? 15 : 10}
                    radius={10}
                    text_click={EditProfile}

                />



            </ScrollView>


            <Dialog
                onTouchOutside={() => {
                    set_popup_dialog(false)
                }}
                width={0.9}
                visible={popup_dialog}


                dialogAnimation={new ScaleAnimation()}
                onHardwareBackPress={() => {
                    console.log('onHardwareBackPress');
                    set_popup_dialog(false)
                    return true;
                }} >
                <DialogContent
                    style={{
                        backgroundColor: Design.gray_bg
                    }}>
                    <View>

                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 20
                        }}
                            onPress={getcameraImage}
                        >
                            <Imageview
                                width={30}
                                height={30}
                                url={require("../assets/camera.png")}
                                resize_mode={'contain'}
                                image_type={'local'}
                                margin_left={20}
                                tint_color={Design.grey}
                            />
                            <Textview
                                text="Take Photo"
                                color={Design.grey}
                                font_family={"medium"}
                                font_size={Design.font_14}
                                margin_left={20}
                                text_click={getcameraImage}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 30
                        }}
                            onPress={getGalleryImage}
                        >
                            <Imageview
                                width={30}
                                height={30}
                                url={require("../assets/gallery.png")}
                                resize_mode={'contain'}
                                image_type={'local'}
                                margin_left={20}
                                tint_color={Design.grey}
                            />
                            <Textview
                                text="Pick From Gallary"
                                color={Design.grey}
                                font_family={"medium"}
                                font_size={Design.font_14}
                                margin_left={20}
                                text_click={getGalleryImage}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 30
                        }}
                            onPress={removePhoto}
                        >
                            <Imageview
                                width={30}
                                height={30}
                                url={require("../assets/del.png")}
                                resize_mode={'contain'}
                                image_type={'local'}
                                margin_left={20}
                                tint_color={Design.grey}
                            />
                            <Textview
                                text="Remove Photo"
                                color={Design.grey}
                                font_family={"medium"}
                                font_size={Design.font_14}
                                margin_left={20}
                                text_click={removePhoto}
                            />
                        </TouchableOpacity>
                    </View>


                </DialogContent>
            </Dialog>

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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);