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
import Snackbar from "react-native-snackbar";


export default function ForgotPassword(props) {
    const [email, setemail] = useState('')
    const [loader, setLoader] = useState(false)


    useEffect(() => {
      

    }, []);

   

   
    function continueClick() {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

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
       

        ApiCall.postRequest(Server.forgotpassword, data, (response, error) => 
        {
            setLoader(false)

            if (response != undefined && response.status == "success") 
            {
                Alert.alert(response.message)
                props.navigation.goBack()
            } else {
                Alert.alert(response.message)
                
            }
        });


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
                    text={'Forgot Password'}
                    font_size={Design.font_25}
                    color={Design.black}
                    font_family={'medium'}
                    align_self={'center'}
                    margin_top={35}
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
                        placeholderTextColor={Design.grey}
                        onChangeText={value => setemail(value)}
                    />
                </CardView>
               
             
                <Textview
                    text={'Continue'}
                    font_size={Design.font_17}
                    color={Design.white}
                    font_family={'regular'}
                    text_align={'center'}
                    bg_color={Design.primary_color_orange}
                    margin_top={60}
                    margin_horizontal={17}
                    padding_vertical={Platform.OS == "ios" ? 15 : 10}
                    radius={10}
                    text_click={continueClick}
                />
                

               
            </ScrollView>
        </ImageBackground>
    )
}