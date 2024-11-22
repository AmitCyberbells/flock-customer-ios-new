import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import { ScrollView } from "react-native-gesture-handler";


import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";


import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import Nodata from "../child_class/no_data";


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

function MySavedOffers(props) {
    const { info, saved_offer_list } = props;
    const [loader, setLoader] = useState(false)
    const [data_found, set_data_found] = useState("")
    const [success_dialog, set_success_dialog] = useState(false)


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
    function done_click() {
        set_success_dialog(false)

    }
    function DATA_API() {
        if (saved_offer_list.length == 0) {
            setLoader(true)
        }
        var data = new FormData();
        data.append("user_id", info.user_id);
        ApiCall.postRequest(Server.favourite_offerlist, data, (response, error) => {
            setLoader(false)

            if (response != undefined && response.status == "success") {
                let { actions } = props;
                actions.saved_offer_data(response.offerfavoritelist);
                if (response.offerfavoritelist.length == 0) {
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
                                text={'Remove'}
                                font_family={"regular"}
                                color={Design.light_blue}
                                font_size={Design.font_8}
                                text_click={fav_click.bind(this, item, index)}

                            />


                        </CardView>
                        <CardView
                            cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                            cornerRadius={20}
                            style={{
                                backgroundColor: Design.light_color_orange,
                                paddingHorizontal: Platform.OS == "ios" ? 0 : 7,
                                //paddingVertical: Platform.OS == "ios" ? 7 : 7,
                                flex: 1,
                                height: Platform.OS == "ios" ? 30 : 25,
                                alignItems: 'center',
                                justifyContent: 'center'


                            }}

                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Textview
                                    text={'Redeem Now'}
                                    font_family={"regular"}
                                    color={Design.primary_color_orange}
                                    font_size={Design.font_8}
                                    text_click={redeem_click.bind(this, item)}


                                />
                            </View>

                        </CardView>
                    </View>


                </CardView>
            </View>

        ), [props.saved_offer_list]);
    const keyExtractor_hotellist = (item) => item.id;

    function click_back() {
        props.navigation.goBack()
    }


    function redeem_click(item) {


        points = item.redeem_points

        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {
                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            } else {
                SAVED_OFFER_DATA_API(item)
            }
        });

    }


    function SAVED_OFFER_DATA_API(item) {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_id", item.venue_id);
        data.append("offer_id", item.id);
        ApiCall.postRequest(Server.buy_coupon, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                set_success_dialog(true)
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
        data.append("user_id", info.user_id);
        data.append("venue_id", item.venue_id);
        data.append("offer_id", item.id);
        ApiCall.postRequest(Server.add_favouriteoffer, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: response.message == "Your favourite offer Added successfully" ? Design.primary_color_orange : 'red'
                });

                const reducedArr = [...props.saved_offer_list];
                reducedArr.splice(index, 1);

                let { actions } = props;
                actions.saved_offer_data(reducedArr);


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
                        text={'Saved Offers'}
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
                    data={props.saved_offer_list}
                    style={{ marginTop: 5, marginHorizontal: 3 }}
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
                            text={"Offer Redeem Successfully"}
                            color={Design.black}
                            margin_top={20}
                            font_family={"bold"}
                            font_size={Design.font_18}
                            text_align={'center'}
                        />

                        <View style={{
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
                        />

                        <Textview
                            text={"DONE"}
                            active_opacity={0.4}
                            color={"#96a7f0"}
                            font_family={"semi_bold"}
                            margin_vertical={30}
                            text_align={'center'}
                            font_size={Design.font_12}
                            text_click={done_click}


                        />


                    </View>
                </DialogContent>
            </Dialog>

        </View>
    )
}

const mapStateToProps = state => ({
    info: state.info.info,
    saved_offer_list: state.saved_offer_list.saved_offer_list

});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySavedOffers);