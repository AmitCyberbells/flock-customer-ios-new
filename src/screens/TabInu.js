import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, Alert } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import Nodata from "../child_class/no_data";


import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";

function TabInu(props) {

    const {
        info, dashboard_list
    } = props;


    const [loader, setLoader] = useState(false)
    const [dash_data, setDashData] = useState([])
    const [data_found, set_data_found] = useState("")

    useEffect(() => {
        console.log('props on tabInu: ', props)
        if (Object.keys(dash_data).length == 0) {
            set_data_found("")
        }
        else {
            set_data_found("true")
        }
        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {
                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            } else {
                GET_DATA_API()
            }
        });
    }, []);


    useEffect(() => {

        GET_DATA_API()

        var navigationdata = props.navigation.addListener('didFocus', () => {

            GET_DATA_API();

        });

        return () => {
            navigationdata.remove();
        }

    }, []);


    function GET_DATA_API() {

        setLoader(true)

        var data = new FormData();
        data.append("user_id", info.user_id);
        console.log(data)
        console.log(Server.dashboard)
        ApiCall.postRequest(Server.dashboard, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                console.log('dashbaord response: ', response)
                let { actions } = props;
                actions.dashboarddata(response)
                setDashData(response)
                set_data_found("true")
            }
            else {
                set_data_found("false")
            }
        });


    }


    function FeatherAPI() {

        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);

        console.log(data);
        console.log(Server.featherdashboard);

        ApiCall.postRequest(Server.featherdashboard, data, (response, error) => {
            setLoader(false)

            if (response != undefined && response.status == "success") {

                let { actions } = props;

                //actions.saved_user_info(response.info);
                //AsyncStorage.setItem("user_details", JSON.stringify(response.info));

                // AsyncStorage.setItem("login", "true")

                console.log(response.category)

                let obj = {

                    'FeathersList': response.category,
                }

                //console.log(response.user_transactions[0])

                // Snackbar.show({
                //     text: response.message,
                //     duration: Snackbar.LENGTH_LONG,
                //     fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                //     backgroundColor: "green"
                // });

                props.navigation.navigate('Feathers', obj)
            } else {

                //console.log(response)
                //Alert.alert(response.message)
                // Snackbar.show({
                //     text: response.message,
                //     duration: Snackbar.LENGTH_SHORT,
                //     fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                //     backgroundColor: "red"
                // });
            }
        });


    }


    const renderItem_transactionList = useCallback(
        ({ item, index }) => (



            <View>
                <View style={{ marginVertical: 10, flexDirection: 'row', marginHorizontal: Platform.OS == "ios" ? 5 : 2, alignItems: 'center' }}>

                    <CardView
                        cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                        cornerRadius={50}
                        style={{
                            backgroundColor: Design.white,
                            width: Platform.OS == "ios" ? 70 : 57,
                            height: Platform.OS == "ios" ? 70 : 57,
                            padding: 2
                        }}

                    >
                        <Imageview
                            url={item.image}
                            width={'100%'}
                            height={'100%'}
                            image_type={"server"}
                            resize_mode={"cover"}
                            radius={50}
                        />

                    </CardView>

                    <View style={{ marginHorizontal: 20, flex: 1 }}>
                        <Textview
                            text={item.name}
                            font_family={"medium"}
                            color={Design.black}
                            font_size={Design.font_17}

                        />
                        <Textview
                            text={item.datetime}
                            font_family={"regular"}
                            color={Design.grey}
                            font_size={Design.font_13}
                            margin_top={Platform.OS == "ios" ? 5 : 0}

                        />
                    </View>


                    <Textview
                        text={item.status == "add" ? '+' + item.feather + ' fts' : '-' + item.feather + ' fts'}
                        font_family={"medium"}
                        color={item.status == "add" ? Design.primary_color_orange : 'red'}
                        font_size={Design.font_16}

                    />

                </View>
                <View style={{ borderColor: Design.grey_line, borderWidth: Platform.OS == "ios" ? 0.6 : 0.3, marginVertical: Platform.OS == "ios" ? 2 : 0, }} />
            </View>


        ), [dash_data.Transaction]);

    const renderItem_category = useCallback(
        ({ item, index }) => (
            <View>
                <TouchableOpacity
                    onPress={category_click.bind(this, item)}
                    style={{ width: Platform.OS == "ios" ? Dimensions.get("window").width * 30 / 100 : Dimensions.get("window").width * 30 / 100, backgroundColor: Design.light_color_orange, marginHorizontal: 5, cornerRadius: 5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 14 }}>
                    <Imageview
                        url={item.image}
                        width={Platform.OS == "ios" ? 35 : 28}
                        height={Platform.OS == "ios" ? 35 : 28}
                        image_type={"server"}
                        resize_mode={"contain"}
                        tint_color={Design.primary_color_orange}

                    />
                    <Textview
                        text={item.catname}
                        font_family={"regular"}
                        lines={1}
                        color={Design.primary_color_orange}
                        font_size={Design.font_15}
                        margin_top={Platform.OS == "ios" ? 5 : 5}


                    />
                    <Textview
                        text={'Total Bookings'}
                        font_family={"regular"}
                        color={Design.light_grey}
                        font_size={Design.font_11}
                        margin_top={Platform.OS == "ios" ? 5 : 0}


                    />
                    <Textview
                        text={item.count}
                        font_family={"regular"}
                        color={Design.light_grey}
                        font_size={Design.font_11}
                        margin_top={Platform.OS == "ios" ? 5 : 0}


                    />
                </TouchableOpacity>

                <View style={{ position: 'absolute', top: 5, right: 10 }}>
                    <Imageview
                        url={GlobalImages.whiteSideArrow}
                        width={Platform.OS == "ios" ? 22 : 18}
                        height={Platform.OS == "ios" ? 22 : 18}
                        image_type={"local"}
                        resize_mode={"contain"}
                    />
                </View>

            </View>


        ), [dash_data.Booking]);

    const keyExtractor_category = (item) => item.title;
    const keyExtractor_transactionList = (item) => item.title;

    function feather_click() {

        FeatherAPI()

    }

    function setting_click() {
        props.navigation.navigate('Settings')
    }

    function see_all_click() {
        props.navigation.navigate('AllTransactions')
    }

    function category_click(item) {
        props.navigation.navigate('CategoryTranscations', { item: item })
    }

    return (
        <View style={CSS.Favcontainer}>
            <Loader loader={loader} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, alignItems: 'center', marginTop: Platform.OS == "ios" ? 50 : 10, marginBottom: Platform.OS == "ios" ? 30 : 20 }}>
                <Textview
                    text={'My Dashboard'}
                    font_family={"medium"}
                    color={Design.black}
                    font_size={Design.font_25}

                />
                <TouchableOpacity
                    onPress={setting_click}
                >
                    <Imageview
                        url={GlobalImages.setting}
                        width={Platform.OS == "ios" ? 52 : 47}
                        height={Platform.OS == "ios" ? 52 : 47}
                        image_type={"local"}
                        resize_mode={"contain"}
                    />
                </TouchableOpacity>

            </View>

            {
                data_found == "true"
                    ?
                    <ScrollView showsVerticalScrollIndicator={false}>


                        <CardView
                            cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                            cornerRadius={10}
                            style={{
                                backgroundColor: Design.white,
                                paddingHorizontal: Platform.OS == "ios" ? 20 : 15,
                                paddingVertical: Platform.OS == "ios" ? 10 : 7,
                                //height: Dimensions.get("window").height * 23 / 100,
                                marginTop: Platform.OS == "ios" ? 5 : 5,
                                marginHorizontal: Platform.OS == "ios" ? 17 : 15,
                                marginBottom: 20
                            }}

                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Textview
                                    text={'Total Balance'}
                                    font_family={"medium"}
                                    color={Design.light_grey}
                                    text_align={'center'}
                                    font_size={Design.font_14}


                                />
                                <TouchableOpacity
                                    onPress={feather_click}
                                >
                                    <Imageview
                                        url={GlobalImages.sideArrow}
                                        width={Platform.OS == "ios" ? 22 : 18}
                                        height={Platform.OS == "ios" ? 22 : 18}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                    />
                                </TouchableOpacity>

                            </View>
                            <Textview
                                text={(dash_data.total_feather??'0') + ' fts'}
                                font_family={"medium"}
                                color={Design.black}
                                font_size={Design.font_25}
                                margin_top={Platform.OS == "ios" ? 10 : 0}

                            />
                            <Textview
                                text={(dash_data.total_venue_points??'0') + ' pts'}
                                font_family={"medium"}
                                color={Design.black}
                                font_size={Design.font_25}
                                margin_top={Platform.OS == "ios" ? 10 : 0}

                            />
                            <View style={{ borderColor: Design.grey_line, borderWidth: Platform.OS == "ios" ? 0.6 : 0.3, marginVertical: Platform.OS == "ios" ? 10 : 5, }} />
                            <View style={{ flexDirection: 'row', marginVertical: Platform.OS == "ios" ? 12 : 5 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Imageview
                                        url={GlobalImages.earned}
                                        width={Platform.OS == "ios" ? 40 : 30}
                                        height={Platform.OS == "ios" ? 40 : 30}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                    />
                                    <View style={{ paddingHorizontal: 15 }}>
                                        <Textview
                                            text={'Earned'}
                                            font_family={"medium"}
                                            color={Design.light_grey}
                                            font_size={Design.font_14}
                                            margin_bottom={Platform.OS == "ios" ? 5 : 0}



                                        />
                                        <View style={{ flexDirection: 'row' }}>

                                            <Imageview
                                                url={GlobalImages.AppOffer}
                                                width={Platform.OS == "ios" ? 22 : 18}
                                                height={Platform.OS == "ios" ? 22 : 18}
                                                margin_top={Platform.OS == "ios" ? 2 : 3}
                                                image_type={"local"}
                                                resize_mode={"contain"}

                                            />
                                            <Textview
                                                text={(dash_data.earn_feather??'0') + ' fts'}
                                                font_family={"medium"}
                                                color={Design.black}
                                                font_size={Design.font_17}
                                                margin_top={Platform.OS == "ios" ? 2 : 0}
                                                margin_left={5}

                                            />
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>

                                            <Imageview
                                                url={GlobalImages.VenueOffer}
                                                width={Platform.OS == "ios" ? 22 : 18}
                                                height={Platform.OS == "ios" ? 22 : 18}
                                                margin_top={Platform.OS == "ios" ? 2 : 3}
                                                image_type={"local"}
                                                resize_mode={"contain"}
                                            />
                                            <Textview
                                                text={(dash_data.earn_venue_points??'0') + ' pts'}
                                                font_family={"medium"}
                                                color={Design.black}
                                                font_size={Design.font_17}
                                                margin_top={Platform.OS == "ios" ? 2 : 0}
                                                margin_left={5}

                                            />
                                        </View>

                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Imageview
                                        url={GlobalImages.spend}
                                        width={Platform.OS == "ios" ? 40 : 30}
                                        height={Platform.OS == "ios" ? 40 : 30}
                                        image_type={"local"}
                                        resize_mode={"contain"}
                                    />
                                    <View style={{ paddingHorizontal: 15 }}>
                                        <Textview
                                            text={'Spent'}
                                            font_family={"medium"}
                                            color={Design.light_grey}
                                            font_size={Design.font_14}
                                            margin_bottom={Platform.OS == "ios" ? 5 : 0}

                                        />

                                        <View style={{ flexDirection: 'row' }}>

                                            <Imageview
                                                url={GlobalImages.AppOffer}
                                                width={Platform.OS == "ios" ? 22 : 18}
                                                height={Platform.OS == "ios" ? 22 : 18}
                                                margin_top={Platform.OS == "ios" ? 2 : 3}
                                                image_type={"local"}
                                                resize_mode={"contain"}
                                            />
                                            <Textview
                                                text={(dash_data.spend_feather??'0') + ' fts'}
                                                font_family={"medium"}
                                                color={Design.black}
                                                font_size={Design.font_17}
                                                margin_top={Platform.OS == "ios" ? 2 : 0}
                                                margin_left={5}

                                            />

                                        </View>

                                        <View style={{ flexDirection: 'row' }}>

                                            <Imageview
                                                url={GlobalImages.VenueOffer}
                                                width={Platform.OS == "ios" ? 22 : 18}
                                                height={Platform.OS == "ios" ? 22 : 18}
                                                margin_top={Platform.OS == "ios" ? 2 : 3}
                                                image_type={"local"}
                                                resize_mode={"contain"}
                                            />
                                            <Textview
                                                text={(dash_data.spend_venue_points??'0') + ' pts'}
                                                font_family={"medium"}
                                                color={Design.black}
                                                font_size={Design.font_17}
                                                margin_top={Platform.OS == "ios" ? 2 : 0}
                                                margin_left={5}

                                            />

                                        </View>


                                        {/* <Textview
                                            text={dash_data.spend_feather + ' fts'}
                                            font_family={"medium"}
                                            color={Design.black}
                                            font_size={Design.font_17}
                                            margin_top={Platform.OS == "ios" ? 2 : 0}

                                        /> */}
                                    </View>
                                </View>

                            </View>


                        </CardView>


                        {
                            dash_data.Booking.length == 0
                                ?
                                null
                                :
                                <View>
                                    <Textview
                                        text={'My Bookings'}
                                        font_family={"medium"}
                                        color={Design.black}
                                        font_size={Design.font_18}
                                        margin_top={Platform.OS == "ios" ? 15 : 10}
                                        margin_horizontal={Platform.OS == "ios" ? 17 : 15}

                                    />
                                    <FlatList
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={dash_data.Booking}
                                        style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 12, marginHorizontal: 10 }}
                                        renderItem={renderItem_category}
                                        keyExtractor={keyExtractor_category}
                                    />
                                </View>
                        }


                        {
                            dash_data.Transaction.length == 0
                                ?
                                null
                                :
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS == "ios" ? 20 : 15 }}>
                                        <Textview
                                            text={'Transactions'}
                                            font_family={"medium"}
                                            color={Design.black}
                                            font_size={Design.font_18}
                                            margin_horizontal={Platform.OS == "ios" ? 17 : 15}

                                        />
                                        <Textview
                                            text={'See all'}
                                            font_family={"regular"}
                                            color={Design.text_light_grey}
                                            font_size={Design.font_14}
                                            margin_horizontal={Platform.OS == "ios" ? 17 : 15}
                                            text_click={see_all_click}

                                        />
                                    </View>

                                    <FlatList
                                        horizontal={false}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        data={dash_data.Transaction}
                                        nestedScrollEnabled={false}
                                        style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15, marginHorizontal: 10, marginBottom: Platform.OS == "ios" ? 80 : 85 }}
                                        renderItem={renderItem_transactionList}
                                        keyExtractor={keyExtractor_transactionList}
                                    />
                                </View>
                        }



                    </ScrollView>
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
    dashboard_list: state.dashboard_list.dashboard_list,
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TabInu);