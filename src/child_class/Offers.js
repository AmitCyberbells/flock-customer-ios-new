import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';
import Lottie from "lottie-react-native"
var points = ""

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";

export default function SingleDetail(props) {
    const [loader, setLoader] = useState(false)
    const [success_dialog, set_success_dialog] = useState(false)
    const [list, set_list] = useState([])
    const [OpenTransactionType, setOpenTransactionType] = useState(false);
    const [RedeemType, setRedeemType] = useState('');
    const [OfferValue, setOfferValue] = useState([]);
    const [Title, setTitle] = useState('');
    const [responseMsg, setResponseMsg] = useState('');


    useEffect(() => {

        set_list(props.offer)

        console.log('Hello', props)

        // console.log(OfferValue)
        setTitle(props.title)

        // var navigationdata = props.navigation.addListener('didFocus', () => {

        //     set_list(props.offer)

        // });

        // return () => {

        //     navigationdata.remove();
        // }


    }, []);


    const renderItem_hotelList = useCallback(
        ({ item, index }) => (

            <View
                style={{ width: '46%', marginHorizontal: '2%', marginBottom: 15, marginTop: 5 }}
            >

                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{

                        backgroundColor: Design.white,
                        paddingTop: 12,
                        paddingHorizontal: 10,
                        width: '100%',

                    }}

                >
                    <View>

                        <Imageview
                            url={item.image_gallery}
                            // width={Platform.OS == "ios" ? 30 : 25}
                            height={Platform.OS == "ios" ? 110 : 90}
                            image_type={"server"}
                            resize_mode={"cover"}
                            radius={8}
                        />

                        <View style={{

                            flexDirection: 'row',
                            height: 25,
                            width: '100%',
                            justifyContent: 'flex-start',
                            position: 'absolute', bottom: 2,
                            //  backgroundColor: 'violet',
                            paddingHorizontal: 2,


                        }}>

                            {
                                item.feather_points != 0 ?
                                    <View style={{
                                        flexDirection: 'row',
                                        height: 25,
                                        // width: '50%',
                                        justifyContent: 'flex-start',
                                        backgroundColor: 'white', borderRadius: 10,
                                        alignItems: 'center',
                                        paddingHorizontal: 5,
                                        marginRight: 10,

                                    }}>
                                        <Imageview
                                            url={GlobalImages.AppOffer}
                                            width={15}
                                            height={15}
                                            image_type={"local"}
                                            resize_mode={"contain"}
                                            margin_right={5}
                                        />

                                        <Textview
                                            text={item.feather_points}
                                            font_family={"regular"}
                                            color={Design.black}
                                            font_size={Design.font_13}
                                        />

                                        <Textview
                                            text={' pts'}
                                            font_family={"regular"}
                                            color={Design.black}
                                            font_size={Design.font_13}

                                        />

                                    </View>
                                    :
                                    null
                            }

                            {
                                item.venue_points != 0 ?

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        // width: '50%',
                                        height: 25,
                                        backgroundColor: 'white', borderRadius: 10,
                                        alignItems: 'center',
                                        paddingHorizontal: 5,


                                    }}>
                                        <Imageview
                                            url={GlobalImages.VenueOffer}
                                            width={15}
                                            height={15}
                                            image_type={"local"}
                                            resize_mode={"contain"}
                                            margin_right={5}
                                        />
                                        <Textview
                                            text={item.venue_points}
                                            font_family={"regular"}
                                            color={Design.black}
                                            font_size={Design.font_13}
                                        />

                                        <Textview
                                            text={' pts'}
                                            font_family={"regular"}
                                            color={Design.black}
                                            font_size={Design.font_13}

                                        />
                                    </View>

                                    :
                                    null
                            }


                        </View>




                    </View>

                    <Textview
                        text={item.offer_name}
                        font_family={"medium"}
                        color={Design.black}
                        font_size={Design.font_18}
                        margin_top={Platform.OS == "ios" ? 8 : 4}


                    />

                    <Textview
                        text={item.description}
                        font_family={"regular"}
                        color={Design.light_grey}
                        font_size={Design.font_10}
                        margin_top={Platform.OS == "ios" ? 5 : 0}
                        lines={1}


                    />

                    {

                        item.check_redeem == 0 ?

                            <View style={{ flexDirection: 'row', marginVertical: 15 }}>

                                <CardView
                                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                                    cornerRadius={30}
                                    style={{
                                        backgroundColor: Design.white,
                                        paddingHorizontal: Platform.OS == "ios" ? 0 : 2,
                                        //paddingVertical: Platform.OS == "ios" ? 7 : 7,
                                        flex: 1,
                                        height: Platform.OS == "ios" ? 30 : 25,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 10


                                    }}

                                >

                                    <Textview
                                        text={item.favourite == 0 ? 'Save' : "Remove"}
                                        font_family={"regular"}
                                        color={Design.light_blue}
                                        font_size={Design.font_8}
                                        text_click={fav_click.bind(this, item, index)}
                                    />

                                </CardView>

                                <CardView
                                    onPress={item.check_redeem == 0 ? redeem_click.bind(this, item.redeem_points, item.id, item) : null}
                                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                                    cornerRadius={20}
                                    style={{
                                        backgroundColor: item.check_redeem == 0 ? Design.primary_color_orange : Design.grey_line,
                                        paddingHorizontal: Platform.OS == "ios" ? 0 : 7,
                                        //paddingVertical: Platform.OS == "ios" ? 7 : 7,
                                        flex: 1,
                                        height: Platform.OS == "ios" ? 30 : 25,
                                        alignItems: 'center',
                                        justifyContent: 'center'

                                    }}

                                >
                                    <TouchableOpacity
                                        onPress={item.check_redeem == 0 ? redeem_click.bind(this, item.redeem_points, item.id, item) : null}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>

                                        <Textview
                                            text={item.check_redeem == 0 ? 'Redeem Now' : 'Redeemed'}
                                            font_family={"regular"}
                                            color={item.check_redeem == 0 ? Design.white : Design.grey}
                                            //color={Design.light_grey}
                                            font_size={Design.font_8}
                                            text_click={item.check_redeem == 0 ? redeem_click.bind(this, item.redeem_points, item.id, item) : null}

                                        />

                                    </TouchableOpacity>

                                </CardView>

                            </View>
                            :

                            <View style={{ flexDirection: 'row', marginVertical: 15 }}>

                                <TouchableOpacity

                                    onPress={QRCode_click.bind(this, item.verify_qr_id, item.id, item.offer_name)}

                                    //cardElevation={Platform.OS == "ios" ? 2.5 : 7}

                                    style={{
                                        backgroundColor: Design.grey_line,
                                        paddingHorizontal: Platform.OS == "ios" ? 0 : 7,
                                        //paddingVertical: Platform.OS == "ios" ? 7 : 7,
                                        flex: 1,
                                        height: Platform.OS == "ios" ? 30 : 25,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 15

                                    }}

                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                        <Textview
                                            text={'Show QR Code'}
                                            font_family={"regular"}
                                            color={Design.grey}
                                            //color={Design.light_grey}
                                            active_opacity={0}
                                            font_size={Design.font_8}
                                            text_click={QRCode_click.bind(this, item.verify_qr_id, item.id, item.offer_name)}

                                        />

                                    </View>

                                </TouchableOpacity>

                            </View>
                    }

                    {/* <View style={{position:'absolute',top:15,left:12,backgroundColor:Design.white,paddingVertical:Platform.OS == "ios" ? 2 : 0,paddingHorizontal:10,borderRadius:10}}>
                    <Textview
                        text={'Food'}
                        font_family={"regular"}
                        color={Design.grey}
                        font_size={Design.font_10}
         
                    />
                    </View> */}

                </CardView>
            </View>

        ), [list]);


    const keyExtractor_hotellist = (item) => item.id;

    // function done_click() {
    //     set_success_dialog(false)

    // }


    // function redeem_click(redeem_points, id) {
    //     points = redeem_points

    //     NetInfo.fetch().then(state => {
    //         if (state.isConnected == false) {

    //             Snackbar.show({
    //                 text: 'Please turn on your internet',
    //                 duration: Snackbar.LENGTH_SHORT,
    //                 fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
    //                 backgroundColor: Design.primary_color_orange
    //             });


    //         }
    //         else {
    //             DATA_API(id)
    //         }
    //     });

    // }

    function redeem_click(redeem_points, id, item) {
        points = redeem_points

        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {

                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });


            }
            else {

                console.log(item)

                setOfferValue(item)

                setOpenTransactionType(true)

                // RedeemOption(item)

            }
        });

    }

    function done_click() {

        if (RedeemType == '') {

            Snackbar.show({
                text: `Select Redeem Type`,
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });

        } else {

            if (RedeemType == 'feather_points') {

                if (parseInt(OfferValue.user_avail_feather_points) < parseInt(OfferValue.feather_points)) {

                    Snackbar.show({
                        text: `Insufficient Feather Point`,
                        duration: Snackbar.LENGTH_SHORT,
                        fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                        backgroundColor: Design.primary_color_orange
                    });
                }
                else {
                    console.log('App Point')
                    console.log(OfferValue.user_avail_feather_points)
                    console.log(OfferValue.user_avail_venue_points)
                    DATA_API(OfferValue.id)
                    setOpenTransactionType(false)
                }

            } else if (RedeemType == 'venue_points') {

                if (parseInt(OfferValue.user_avail_venue_points) < parseInt(OfferValue.venue_points)) {

                    Snackbar.show({
                        text: `Insufficient Venue Point`,
                        duration: Snackbar.LENGTH_SHORT,
                        fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                        backgroundColor: Design.primary_color_orange
                    });

                } else {
                    console.log('Venue Point')
                    console.log(OfferValue.user_avail_feather_points)
                    console.log(OfferValue.user_avail_venue_points)

                    DATA_API(OfferValue.id)
                    setOpenTransactionType(false)
                }
            }

            else {

                console.log(OfferValue.user_avail_feather_points)
                console.log(OfferValue.user_avail_venue_points)
                // console.log('OK Report')

                setOpenTransactionType(false)
                // DATA_API(OfferValue.id)

            }


        }

    }

    // function RedeemOption(item) {
    //     setOpenTransactionType(true)
    //     console.log(item)
    //     done_click(item.id)
    //     // DATA_API(id)

    // }

    function QRCode_click(QR_Id, id, offerName) {

        // console.log('Redeem Points: ', redeem_points)
        console.log('QR Id:', QR_Id)

        let obj = {

            'offerid': id,
            'venueId': props.venue_id,
            'userId': props.user_id,
            'qrCode': QR_Id,
            'offerName': offerName,
            'checkRedeem': '0',

        }

        props.navigation.push('QRCodeScreen', obj)

    }

    function back_btn() {

        set_success_dialog(false)
        props.navigation.goBack()

    }

    function DATA_API(id) {

        setLoader(true)
        var data = new FormData();
        data.append("user_id", props.user_id);
        data.append("venue_id", props.venue_id);
        data.append("offer_id", id);
        data.append('check_redeem', 1);
        data.append('redeem_type', RedeemType);
        data.append('redeem_verify_id', `FLOCK${props.venue_id}${id}_${(Math.random() + 1).toString(36).substring(7).toUpperCase()}`)

        if (RedeemType == 'feather_points') {
            data.append('feather_points', OfferValue.user_avail_feather_points);
            data.append('venue_points', '');
        } else if (RedeemType == 'venue_points') {
            data.append('venue_points', OfferValue.user_avail_venue_points);
            data.append('feather_points', '');
        } else {
            data.append('venue_points', '');
            data.append('feather_points', '');
        }

        console.log(Server.buy_coupon)
        console.log(data)

        ApiCall.postRequest(Server.buy_coupon, data, (response, error) => {
            setLoader(false)
            console.log({ response }, response.status, response.message)

            if (response != undefined && response.status == "success") {

                setResponseMsg(response.message)
                set_success_dialog(true)
            
                // ` You're already Redeem offer!! Please wait for 24 hours`
            } else {
                setResponseMsg(response.message)
                set_success_dialog(true)

                // below snackbar is not working. So I have used above dialog box to show the error message.
                Snackbar.show({
                    text: `${response.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            }

        });


    }

    function fav_click(item, index) {
        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {
                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            } else {
                FAV_UNFAV_API(item, index)
            }
        });

    }

    function FAV_UNFAV_API(item, index) {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", props.user_id);
        data.append("venue_id", props.venue_id);
        data.append("offer_id", item.id);

        console.log(data)
        console.log(Server.add_favouriteoffer)

        ApiCall.postRequest(Server.add_favouriteoffer, data, (response, error) => {
            setLoader(false)

            if (response != undefined && response.status == "success") {
                let val = ''
                if (response.message == "Your favourite offer Added successfully") {
                    val = 1
                }
                else {
                    val = 0
                }

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: response.message == "Your favourite offer Added successfully" ? Design.primary_color_orange : 'red'
                });

                console.log(list[index])
                const arr = [...list]

                list[index].favourite = val;
                set_list(arr)


                console.log(list[index])

            }
            else {

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            }

        });


    }

    function redeemType(type) {

        if (type != RedeemType) {
            setRedeemType(type)

            console.log(type)
            console.log(RedeemType)
        }

    }

    return (

        <View>

            <Loader loader={loader} />

            <Textview
                text={list.length + ' Active offers'}
                font_family={"medium"}
                color={Design.black}
                font_size={Design.font_18}
                margin_top={15}
                margin_horizontal={15}

            />

            <FlatList
                horizontal={false}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={list}
                style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 20 : 15, marginHorizontal: 3 }}
                renderItem={renderItem_hotelList}
                keyExtractor={keyExtractor_hotellist}
            />



            <Dialog
                onTouchOutside={() => set_success_dialog(false)}
                width={0.8}
                visible={OpenTransactionType}
                dialogAnimation={new ScaleAnimation()}
                onHardwareBackPress={() => {
                    setOpenTransactionType(false)
                    return true;
                }}
                actions={[
                    <DialogButton
                        text="DISMISS"
                        onPress={() => {
                            setOpenTransactionType(false)
                        }}
                        key="button-1"
                    />,
                ]}
                dialogStyle={{ borderRadius: 10, overflow: 'hidden' }}
            >

                <DialogContent>

                    <TouchableOpacity

                        onPress={() => setOpenTransactionType(false)}
                        style={{
                            //position: 'absolute',
                            width: 30, height: 30, justifyContent: 'center', alignItems: 'center',
                            alignSelf: 'flex-end', marginTop: 10
                        }}>

                        <Imageview
                            url={GlobalImages.close}
                            width={18}
                            height={18}
                            image_type={"local"}
                            resize_mode={"contain"}
                        />

                    </TouchableOpacity>

                    <View>

                        <Textview
                            text={"Offer Details"}
                            color={Design.black}
                            margin_top={0}
                            font_family={"bold"}
                            font_size={Design.font_18}
                            text_align={'center'}
                        />

                        {/* <View style={{flexDirection: 'row'}}>

                            <Textview
                                text={"Offer Name : "}
                                color={Design.black}
                                // margin_top={20}
                                font_family={"semi_bold"}
                                font_size={Design.font_18}
                            // text_align={'center'}
                            />

                            <Textview
                                text={OfferValue.offer_name}
                                color={Design.black}
                                font_family={"semi_bold"}
                                font_size={Design.font_16}
                            />


                        </View> */}
                        {/* <View style={{ width: '60%', flexDirection: 'row', alignItems: 'flex-start' }}> */}

                        <Textview
                            text={'Venue Name: ' + Title}
                            color={Design.black}
                            margin_vertical={15}
                            font_family={"semi_bold"}
                            font_size={Design.font_18}
                        />

                        {/* </View> */}

                        <Textview
                            text={"Offer Price"}
                            color={Design.black}
                            // margin_top={20}
                            font_family={"semi_bold"}
                            font_size={Design.font_18}
                        // text_align={'center'}
                        />

                        <View style={{ marginTop: 10 }}>

                            <View style={{
                                alignItems: 'flex-start',
                                alignSelf: 'flex-start',
                                flexDirection: 'row',
                                // marginTop: 5,

                            }}>

                                <TouchableOpacity
                                    onPress={redeemType.bind(this, 'feather_points')}
                                    style={{ flexDirection: 'row' }}
                                >
                                    {/* <Imageview
                                        url={RedeemType == 'App Point' ? GlobalImages.checkbox_fill : GlobalImages.checkbox}
                                        width={25}
                                        height={25}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                        margin_right={8}
                                    /> */}

                                    <Imageview
                                        url={GlobalImages.AppOffer}
                                        width={20}
                                        height={20}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                        margin_left={5}
                                        margin_right={10}
                                        margin_top={2}
                                    />

                                    <Textview
                                        text={(OfferValue.feather_points??'0') + " Feather Point"}
                                        // active_opacity={0.4}
                                        color={Design.black}
                                        font_family={"regular"}
                                        font_size={Design.font_14}
                                        margin_top={2}

                                    />

                                </TouchableOpacity>

                            </View>

                            <View style={{
                                alignItems: 'flex-start',
                                alignSelf: 'flex-start',
                                flexDirection: 'row',
                                marginTop: 5
                                // marginLeft: 15,
                            }}>

                                <TouchableOpacity
                                    onPress={redeemType.bind(this, 'venue_points')}
                                    style={{ flexDirection: 'row' }}
                                >
                                    {/* <Imageview
                                        url={RedeemType == 'Venue Point' ? GlobalImages.checkbox_fill : GlobalImages.checkbox}
                                        width={25}
                                        height={25}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                        margin_right={8}
                                    /> */}

                                    <Imageview
                                        url={GlobalImages.VenueOffer}
                                        width={20}
                                        height={20}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                        margin_left={5}
                                        margin_right={10}
                                        margin_top={2}
                                    />

                                    <Textview
                                        text={(OfferValue.venue_points??'0') + " Venue Point"}
                                        // active_opacity={0.4}
                                        color={Design.black}
                                        font_family={"regular"}
                                        font_size={Design.font_14}
                                        margin_top={2}

                                    />

                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={{ marginTop: 10 }}>

                            {/* <Textview
                                text={`You currently have:`}
                                active_opacity={0.4}
                                color={Design.black}
                                font_family={"regular"}
                                font_size={Design.font_14}
                                margin_top={15}
                                text_align={'center'}

                            /> */}

                            <Textview
                                text={"You currently have"}
                                color={Design.black}
                                // margin_top={20}
                                font_family={"semi_bold"}
                                font_size={Design.font_18}
                            // text_align={'center'}
                            />
                        </View>

                        <View style={{ marginTop: 10 }}>

                            <View style={{
                                alignItems: 'flex-start',
                                alignSelf: 'flex-start',
                                flexDirection: 'row',
                                // marginTop: 5,

                            }}>

                                <TouchableOpacity
                                    onPress={redeemType.bind(this, 'feather_points')}
                                    style={{ flexDirection: 'row' }}
                                >
                                    <Imageview
                                        url={RedeemType == 'feather_points' ? GlobalImages.checkbox_fill : GlobalImages.checkbox}
                                        width={25}
                                        height={25}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                        margin_right={8}
                                    />

                                    <Imageview
                                        url={GlobalImages.AppOffer}
                                        width={20}
                                        height={20}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                        margin_left={5}
                                        margin_right={10}
                                        margin_top={2}
                                    />

                                    <Textview
                                        text={OfferValue.user_avail_feather_points + " Feather Point"}
                                        // active_opacity={0.4}
                                        color={Design.black}
                                        font_family={"regular"}
                                        font_size={Design.font_14}
                                        margin_top={2}

                                    />

                                </TouchableOpacity>

                            </View>

                            <View style={{
                                alignItems: 'flex-start',
                                alignSelf: 'flex-start',
                                flexDirection: 'row',
                                marginTop: 5
                                // marginLeft: 15,
                            }}>

                                <TouchableOpacity
                                    onPress={redeemType.bind(this, 'venue_points')}
                                    style={{ flexDirection: 'row' }}
                                >
                                    <Imageview
                                        url={RedeemType == 'venue_points' ? GlobalImages.checkbox_fill : GlobalImages.checkbox}
                                        width={25}
                                        height={25}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                        margin_right={8}
                                    />

                                    <Imageview
                                        url={GlobalImages.VenueOffer}
                                        width={20}
                                        height={20}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                        margin_left={5}
                                        margin_right={10}
                                        margin_top={2}
                                    />

                                    <Textview
                                        text={OfferValue.user_avail_venue_points + " Venue Point"}
                                        // active_opacity={0.4}
                                        color={Design.black}
                                        font_family={"regular"}
                                        font_size={Design.font_14}
                                        margin_top={2}

                                    />

                                </TouchableOpacity>

                            </View>

                        </View>


                        <Textview
                            text={"Redeem Now"}
                            active_opacity={0.4}
                            color={"#96a7f0"}
                            font_family={"semi_bold"}
                            margin_top={30}
                            text_align={'center'}
                            font_size={Design.font_15}
                            text_click={() => done_click()}
                        />

                    </View>

                </DialogContent>

            </Dialog>



            {/* {
                OpenTransactionType == true ?

                    <View style={{ position: 'absolute', height: '100%', width: '100%', height: '100%' }}>

                        <TouchableOpacity activeOpacity={1}
                            onPress={() => setOpenTransactionType(false)}
                            style={{
                                height: '100%', width: '100%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center',
                                backgroundColor: 'rgba(52, 52, 52, 0.5)'

                            }}
                        >
                            <View

                                borderRadius={10}

                                style={{
                                    width: '90%',
                                    minHeight: '23%',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: Design.white,
                                    marginTop: '0%'

                                }}
                            >
                                <View>

                                    <Textview
                                        text={"Redeem Type"}
                                        color={Design.black}
                                        margin_top={20}
                                        font_family={"bold"}
                                        font_size={Design.font_18}
                                        text_align={'center'}
                                    />

                                    <View>
                                        <Textview
                                            text={`You have ${OfferValue.feather_points} App Points & ${OfferValue.venue_points} Venue Points.`}
                                            active_opacity={0.4}
                                            color={Design.black}
                                            font_family={"regular"}
                                            font_size={Design.font_14}
                                            margin_top={1}
                                            text_align={'center'}

                                        />
                                    </View>

                                    <View style={{
                                        alignItems: 'flex-start',
                                        alignSelf: 'flex-start',
                                        flexDirection: 'row',
                                        marginTop: 20
                                    }}>

                                        <TouchableOpacity
                                            onPress={redeemType.bind(this, 'Venue Point')}
                                            style={{ flexDirection: 'row' }}
                                        >
                                            <Imageview
                                                url={RedeemType == 'Venue Point' ? GlobalImages.checkbox_fill : GlobalImages.checkbox}
                                                width={25}
                                                height={25}
                                                image_type={"local"}
                                                resize_mode={"contain"}
                                                margin_right={10}
                                            />

                                            <Textview
                                                text={"By Venue Point"}
                                                active_opacity={0.4}
                                                color={Design.black}
                                                font_family={"regular"}
                                                font_size={Design.font_14}
                                                margin_top={1}

                                            />

                                        </TouchableOpacity>

                                    </View>

                                    <View style={{
                                        alignItems: 'flex-start',
                                        alignSelf: 'flex-start',
                                        flexDirection: 'row',
                                        marginTop: 20
                                    }}>

                                        <TouchableOpacity
                                            onPress={redeemType.bind(this, 'App Point')}
                                            style={{ flexDirection: 'row' }}
                                        >
                                            <Imageview
                                                url={RedeemType == 'App Point' ? GlobalImages.checkbox_fill : GlobalImages.checkbox}
                                                width={25}
                                                height={25}
                                                image_type={"local"}
                                                resize_mode={"contain"}
                                                margin_right={10}
                                            />

                                            <Textview
                                                text={"By Feather Point"}
                                                active_opacity={0.4}
                                                color={Design.black}
                                                font_family={"regular"}
                                                font_size={Design.font_14}
                                                margin_top={1}

                                            />

                                        </TouchableOpacity>

                                    </View>

                                    <Textview
                                        text={"DONE"}
                                        active_opacity={0.4}
                                        color={"#96a7f0"}
                                        font_family={"semi_bold"}
                                        margin_vertical={30}
                                        text_align={'center'}
                                        font_size={Design.font_12}
                                        text_click={() => done_click()}

                                    />



                                </View>


                            </View>

                        </TouchableOpacity>

                    </View>
                    :
                    null
            } */}

            <Dialog
                onTouchOutside={() => {
                    set_success_dialog(false)

                }}
                width={0.8}
                visible={success_dialog}
                dialogAnimation={new ScaleAnimation()}
                onHardwareBackPress={() => {
                    set_success_dialog(false)
                    return true;
                }}
                actions={[
                    <DialogButton
                        text="DISMISS"
                        onPress={() => {
                            set_success_dialog(false)
                        }}
                        key="button-1"
                    />,
                ]}
                dialogStyle={{ borderRadius: 10, overflow: 'hidden' }}
            >
                <DialogContent>

                    <View>
                        <Textview
                            text={responseMsg}
                            color={Design.black}
                            margin_top={20}
                            font_family={"bold"}
                            font_size={Design.font_18}
                            text_align={'center'}
                        />

                        {/* <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            marginTop: 20
                            }}>
                            <Textview
                                text={"You have used "}
                                active_opacity={0.4}
                                color={Design.black}
                                font_family={"regular"}
                                font_size={Design.font_14}

                            />
                            <Textview
                                text={points}
                                active_opacity={0.4}
                                color={"#96a7f0"}
                                font_family={"medium"}
                                font_size={Design.font_18}

                            />
                            <Textview
                                text={"  points"}
                                active_opacity={0.4}
                                color={Design.black}
                                font_family={"regular"}
                                font_size={Design.font_14}

                            />
                        </View>

                        <Lottie
                            style={{
                                width: 150,
                                height: 150,
                                alignSelf: 'center',
                                marginTop: 5
                            }}
                            autoPlay
                            loop
                            source={require("../assets/succ.json")}
                        /> */}

                        <Textview
                            text={"DONE"}
                            active_opacity={0.4}
                            color={"#96a7f0"}
                            font_family={"semi_bold"}
                            margin_vertical={30}
                            text_align={'center'}
                            font_size={Design.font_12}
                            text_click={back_btn}

                        />

                    </View>
                </DialogContent>
            </Dialog>

        </View>
    )
}