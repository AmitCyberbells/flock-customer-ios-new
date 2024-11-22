import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, TextInput } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages";
import Imageview from "../component/Imageview";
import Textview from "../component/Textview";
import CardView from "react-native-cardview";
import { ScrollView } from "react-native-gesture-handler";
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Server, { BASE_HOST, BASE_IMG_URL } from '../util/Server'
import ApiRequest from '../util/Network'
// import AnimatedLoader from 'react-native-animated-loader';
// import Toast from 'react-native-simple-toast';

import { WebView } from 'react-native-webview';


var userid;
var removeOfferId;

export default function TermsConditionsWebview(props) {

    const [DialogAlert, setDialogAlert] = useState(false);

    const [videolink, setvideolink] = useState(props.navigation.getParam('alldetail', ''));

    const [loader, setloader] = useState(false);


    // Embedded Link Converter

    // const OriginalVideo = videolink.tutorials_video
    // const SplitedVideo = OriginalVideo.split("watch?v=")
    // const Embed = SplitedVideo.join("embed/")

    const Embed = BASE_HOST+'terms-customer'


    useEffect(() => {

        console.log(videolink.tutorials_video);
        console.log(Embed + "?rel=0&autoplay=0&showinfo=0&controls=0");

    }, []);


    function backbtn() {

        props.navigation.goBack();

    }

    return (

        <View style={CSS.Favcontainer}>


            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 50 : 5, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>


                <TouchableOpacity
                    onPress={backbtn}

                >
                    <Imageview
                        url={GlobalImages.back}
                        width={Platform.OS == "ios" ? 55 : 50}
                        height={Platform.OS == "ios" ? 55 : 50}
                        image_type={"local"}
                        resize_mode={"contain"}
                    />


                </TouchableOpacity>

            </View>
            <View style={{ width: '50%', height: -10, alignSelf: 'center', backgroundColor: 'red' }}>

                <Textview

                    text={'User Agreement'}
                    font_family={"medium"}
                    color={Design.black}
                    text_align={'center'}
                    font_size={Design.font_20}
                    margin_top={-40}

                />

            </View>

            <View style={{

                width: '95%',
                height: '90%',
                marginHorizontal: 10,
                marginTop: 20,
                borderRadius: 10,
                justifyContent: 'center',

            }}>
                <WebView

                    style={{ marginTop: (Platform.OS == 'ios') ? 20 : 0, borderRadius: 10, }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{ uri: Embed }}

                />

            </View>

        </View>
    )
}