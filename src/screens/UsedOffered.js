import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";


import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import Nodata from "../child_class/no_data";
import moment from "moment";

function UsedOffered(props) {

    const { info, my_redeem_list } = props;
    const [loader, setLoader] = useState(false)
    const [data_found, set_data_found] = useState("")

    useEffect(() => {

        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {
                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            } else {

                DATA_API()
            }
        });


    }, []);

    useEffect(() => {

        DATA_API();

        var navigationdata = props.navigation.addListener('didFocus', () => {

            DATA_API();

        });

        return () => {
            navigationdata.remove();
        }

    }, []);


    function DATA_API() {
        setLoader(true)

        var data = new FormData();
        data.append("user_id", info.user_id);
        console.log(my_redeem_list)
        console.log(data)
        console.log(Server.buy_coupon_list)

        ApiCall.postRequest(Server.buy_coupon_list, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                let { actions } = props;
                actions.my_redeem_data(response.buycouponlist);

                //console.log(response)
                if (response.buycouponlist.length == 0) {
                    set_data_found("false")
                }
                else {
                    set_data_found("true")

                }
            }
            else {
                set_data_found("false")
            }

        });


    }

    function QRCode_click(item, index) {

        let obj = {

            'offerid': item.offer_id,
            'venueId': item.venue_id,
            'userId': info.user_id,
            'qrCode': item.verify_qr_id,
            'offerName': item.offer_name,
            'checkRedeem': '0',
            'screenType': 'Used Offer',

        }

        props.navigation.push('QRCodeScreen', obj)

    }

    const renderItem_hotelList = useCallback(
        ({ item, index }) => (

            <View

                style={{ width: '46%', marginHorizontal: '2%', marginBottom: 15, marginTop: 5 }}>

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

                    <Imageview
                        url={item.image_gallery}
                        height={Platform.OS == "ios" ? 110 : 90}
                        image_type={"server"}
                        resize_mode={"cover"}
                        radius={8}

                    />


                    <View style={{ 
                        flex: 1, 
                        flexDirection: 'row', 
                        marginTop: 3,
                        width: "90%"
                        }}>

                        <Imageview
                            url={GlobalImages.businessEggs}
                            width={20}
                            height={20}
                            image_type={"local"}
                            resize_mode={"contain"}
                            margin_right={2}
                            margin_top={2}
                            tint_color={Design.primary_color_orange}
                        />
                        <Textview
                            text={item.venue_title}
                            font_family={"regular"}
                            color={Design.black}
                            font_size={Design.font_12}
                            margin_top={Platform.OS == "ios" ? 5 : 3}
                            lines={1}
                        />
                    </View>


                    <View style={{ marginVertical: 3 }}>
                    <Textview
                        text={item.offername}
                        font_family={"medium"}
                        color={Design.black}
                        font_size={Design.font_14}
                        margin_top={Platform.OS == "ios" ? 8 : 4}
                        lines={1}
                    />

                    <Textview
                        text={item.date + ' ' + item.time}
                        font_family={"regular"}
                        color={Design.grey}
                        font_size={Design.font_10}
                        margin_top={Platform.OS == "ios" ? 5 : 3}
                        lines={1}
                        margin_bottom={2}
                    />
                    </View>


                    {item.redeem_type == 'feather points' ?
                        <View style={{ flex: 1, flexDirection: 'row' }}>
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
                                text={item.redeem_points + " Feather Point"}
                                // active_opacity={0.4}
                                color={Design.black}
                                font_family={"regular"}
                                font_size={Design.font_10}
                                margin_top={2}

                            />
                        </View> :
                        <View style={{ flex: 1, flexDirection: 'row' }}>
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
                                text={item.redeem_points + " Venue Point"}
                                // active_opacity={0.4}
                                color={Design.black}
                                font_family={"regular"}
                                font_size={Design.font_10}
                                margin_top={2}

                            />
                        </View>
                    }



                    {/*  <Textview
                        text={"Time: " + item.time}
                        font_family={"regular"}
                        color={Design.grey}
                        font_size={Design.font_10}
                        margin_top={Platform.OS == "ios" ? 5 : 0}
                        lines={1}
                        margin_bottom={10}
                    /> */}

                    {

                        item.check_redeem != 0 ?

                            <View style={{ flexDirection: 'row', marginVertical: 15 }}>

                                <TouchableOpacity
                                    activeOpacity={1}
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
                                            text={'Redeemed'}
                                            font_family={"regular"}
                                            color={Design.grey}
                                            font_size={Design.font_8}

                                        />

                                    </View>

                                </TouchableOpacity>

                            </View>
                            :

                            <View style={{ flexDirection: 'row', marginVertical: 15 }}>

                                <TouchableOpacity

                                    onPress={QRCode_click.bind(this, item, index)}

                                    //cardElevation={Platform.OS == "ios" ? 2.5 : 7}

                                    style={{
                                        backgroundColor: Design.primary_color_orange,
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
                                            color={Design.white}
                                            font_size={Design.font_8}
                                            text_click={QRCode_click.bind(this, item, index)}

                                        />

                                    </View>

                                </TouchableOpacity>

                            </View>
                    }

                </CardView>

            </View>

        ), [props.my_redeem_list]);
    const keyExtractor_hotellist = (item) => item.id;

    function click_back() {
        props.navigation.goBack()
    }

    return (
        <View style={CSS.Favcontainer}>

            <Loader loader={loader} />

            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 35 : 5, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>
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
                        text={'My Offers'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}

                    />

                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>



            {
                data_found == "true"
                    ?
                    <FlatList
                        horizontal={false}
                        numColumns={2}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={props.my_redeem_list}
                        style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 20 : 15, marginHorizontal: 3 }}
                        renderItem={renderItem_hotelList}
                        keyExtractor={keyExtractor_hotellist}
                    />
                    :
                    data_found == "false"
                        ?
                        <Nodata />
                        :
                        null
            }


        </View>
    )
}

const mapStateToProps = state => ({
    info: state.info.info,
    my_redeem_list: state.my_redeem_list.my_redeem_list

});

const ActionCreators = Object.assign({}, userdata);

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsedOffered);