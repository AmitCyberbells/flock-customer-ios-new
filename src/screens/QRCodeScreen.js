import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, TextInput } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import QRCode from 'react-native-qrcode-svg';

import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';

var arr = []

export default function QRCodeScreen(props) {

    const [alerts, setAlerts] = useState('')

    const [offerId, setofferId] = useState([

        {
            'offerid': props.navigation.getParam('offerid', ''),
            'venueId': props.navigation.getParam('venueId', ''),
            'userId': props.navigation.getParam('userId', ''),
            'qrCode': props.navigation.getParam('qrCode', ''),
            'offerName': props.navigation.getParam('offerName', ''),
            'checkRedeem': props.navigation.getParam('checkRedeem', '0'),
            'screenType': props.navigation.getParam('screenType', ''),
        }

    ]);

    useEffect(() => {

        console.log(offerId)
        //console.log(`${offerId[0].userId},${offerId[0].venueId},${offerId[0].offerid},${offerId[0].qrCode},${offerId[0].offerName},${offerId[0].checkRedeem}`)

    }, []);

    useEffect(() => {

        getAlerts()

        const interval = setInterval(() => getAlerts(), 800)

        return () => {
            clearInterval(interval);
        }

    }, [])

    function getAlerts() {

        var data = new FormData();
        data.append("user_id", offerId[0].userId);
        data.append("venue_id", offerId[0].venueId);
        data.append("offer_id", offerId[0].offerid);

        console.log(data)
        console.log(Server.verified_redeem_code)

        ApiCall.postRequest(Server.verified_redeem_code, data, (response, error) => {

            if (response != undefined && response.status == "success") {
                let redeem = response.check_redeem
                //click_back(redeem)
            } else {

            }

        });

    }

    function click_back(checkredeem) {

        if (checkredeem == '0') {
            console.log('Screen Back Done')
            props.navigation.goBack()
        } else {
            console.log('Screen Not Back')
        }

    }

    function backBtn() {

        props.navigation.goBack()

    }

    return (

        <View style={CSS.Favcontainer}>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Platform.OS == "ios" ? 50 : 5,
                alignItems: 'center',
            }}>

                <TouchableOpacity
                    onPress={backBtn}
                >
                    <Imageview
                        url={GlobalImages.back}
                        width={50}
                        height={50}
                        image_type={"local"}
                        resize_mode={"contain"}
                    />
                </TouchableOpacity>

                <View //style={{  }}
                >
                    <Textview
                        text={'Offer QR Code'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}

                    />

                </View>

                <View>

                </View>

                <View>

                </View>

            </View>

            <View style={{ flex: 1, justifyContent: "flex-start", alignItems: 'center' }}>

                <View style={{ height: 150, width: '90%', marginBottom: 30, justifyContent: "center", alignItems: 'center' }}>

                    <Textview

                        text={'Show QR Code when you visit to Venue'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_18}

                    />

                </View>

                <QRCode
                    value={`${offerId[0].userId},${offerId[0].venueId},${offerId[0].offerid}`}
                    size={230}
                    logoBackgroundColor='transparent'
                />

            </View>

        </View>
    )
}