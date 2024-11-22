import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native'
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

function TabProfile(props) {

    const { info, dashboard_list } = props;
    const [Loader, setLoader] = useState(false)
    const [profileList, setprofileList] = useState([

        {
            title: 'Profile Settings',

        },
        {
            title: 'Change Password',

        },
        {
            title: 'Transaction History',

        },

        // {
        //     title: 'Payment Details',
        // },

    ])

    useEffect(() => {
        console.log(info.image)
        
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


    function GET_DATA_API() {

        if (Object.keys(props.dashboard_list).length == 0) {
            setLoader(true)
        }

        var data = new FormData();
        data.append("user_id", info.user_id);
        console.log(data)
        console.log(Server.dashboard)
        ApiCall.postRequest(Server.dashboard, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                let { actions } = props;
                //console.log(response)
                actions.dashboarddata(response)
            }

        });

    }

    function click_handle(title) {

        if (title == "Transaction History") {

            props.navigation.navigate("AllTransactions")
        
        }

        else if (title == "Change Password") {
            props.navigation.navigate("ChangePassword")
        }

        else if (title == "Profile Settings") {
            props.navigation.navigate("EditProfile")
        }

    }

    const renderItem_profile = useCallback(
        ({ item, index }) => (

            <TouchableOpacity onPress={click_handle.bind(this, item.title)}
            // style={{
            //     flex: 1, backgroundColor: 'red', marginBottom: 10, height: '20%'
            // }}
            >

                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        backgroundColor: Design.white,
                        paddingHorizontal: Platform.OS == "ios" ? 20 : 15,
                        paddingVertical: Platform.OS == "ios" ? 15 : 10,
                        marginVertical: Platform.OS == "ios" ? 7 : 5,
                        marginHorizontal: Platform.OS == "ios" ? 10 : 5,
                    }}

                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Textview
                            text={item.title}
                            font_family={"regular"}
                            color={Design.black}
                            lines={1}
                            font_size={Design.font_17}
                            active_opacity={0}
                            text_click={click_handle.bind(this, item.title)}
                        />
                        <Imageview
                            url={GlobalImages.blackArrow}
                            width={Platform.OS == "ios" ? 12 : 10}
                            height={Platform.OS == "ios" ? 12 : 10}
                            image_type={"local"}
                            resize_mode={"contain"}
                        />
                    </View>

                </CardView>

            </TouchableOpacity>

        ), [profileList]);
    const keyExtractor_profile = (item) => item.title;


    function click_back() {
        props.navigation.goBack()
    }

    function feather_click() {
        props.navigation.navigate('Feathers')
    }

    return (
       
       <View style={[CSS.Favcontainer, { paddingBottom: Platform.OS == "ios" ? 80 : 50 }]}>

            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 50 : 10, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>

                <View style={{ flex: 1 }}>
                    <Textview
                        text={'My Profile'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>



            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center', marginTop: Platform.OS == "ios" ? 35 : 25 }}>
                    {/* <CardView
                        cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                        cornerRadius={80}
                        style={{
                            backgroundColor: Design.white,
                            height: Platform.OS == "ios" ? 160 : 140,
                            width: Platform.OS == "ios" ? 160 : 140,
                            padding: Platform.OS == "ios" ? 12.5 : 12.5

                        }}

                    > */}


                    {/* </CardView> */}

                    <View style={{
                        height: Platform.OS == "ios" ? 160 : 140,
                        width: Platform.OS == "ios" ? 160 : 140,
                        borderWidth: 0.4,
                        borderColor: Design.grey,
                        borderRadius: Platform.OS == "ios" ? 80 : 70,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Imageview
                            url={info.image}
                            width={Platform.OS == "ios" ? 135 : 115}
                            height={Platform.OS == "ios" ? 135 : 115}
                            radius={Platform.OS == "ios" ? 80 : 57}
                            align_self={'center'}
                            image_type={"server"}
                            resize_mode={"cover"}
                        />
                    </View>

                    <Textview
                        text={info.first_name + " " + info.last_name}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_18}
                        margin_top={Platform.OS == "ios" ? 15 : 7}


                    />
                    <Textview
                        text={info.email}
                        font_family={"medium"}
                        color={Design.light_grey}
                        text_align={'center'}
                        font_size={Design.font_14}
                        margin_top={Platform.OS == "ios" ? 5 : 0}
                    />
                    {/* <View style={{ position: 'absolute', top: 0, right: Platform.OS == "ios" ? 35 : 27 }}>
                        <Imageview
                            url={GlobalImages.edit}
                            width={Platform.OS == "ios" ? 22 : 19}
                            height={Platform.OS == "ios" ? 22 : 19}
                            image_type={"local"}
                            resize_mode={"contain"}



                        />
                    </View> */}
                </View>

                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        backgroundColor: Design.white,
                        paddingHorizontal: Platform.OS == "ios" ? 20 : 15,
                        paddingVertical: Platform.OS == "ios" ? 10 : 7,
                        //height: Dimensions.get("window").height * 20 / 100,
                        marginTop: Platform.OS == "ios" ? 30 : 20,
                        marginHorizontal: Platform.OS == "ios" ? 17 : 15,
                    }}

                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Textview
                            text={'Feathers'}
                            font_family={"medium"}
                            color={Design.light_grey}
                            text_align={'center'}
                            font_size={Design.font_14}


                        />

                        {/* <TouchableOpacity
                           // onPress={feather_click}
                        >
                            <Imageview
                                url={GlobalImages.sideArrow}
                                width={Platform.OS == "ios" ? 22 : 18}
                                height={Platform.OS == "ios" ? 22 : 18}
                                image_type={"local"}
                                resize_mode={"contain"}
                            />

                        </TouchableOpacity> */}

                    </View>

                    <Textview
                        text={(props.dashboard_list.total_feather??'0') + ' fts'}
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

                                <Textview
                                    text={(props.dashboard_list.earn_feather??'0') + ' fts'}
                                    font_family={"medium"}
                                    color={Design.black}
                                    font_size={Design.font_17}
                                    margin_top={Platform.OS == "ios" ? 2 : 0}

                                />
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
                                <Textview
                                    text={(props.dashboard_list.spend_feather??'0') + ' fts'}
                                    font_family={"medium"}
                                    color={Design.black}
                                    font_size={Design.font_17}
                                    margin_top={Platform.OS == "ios" ? 2 : 0}

                                />
                            </View>
                        </View>

                    </View>


                </CardView>

                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={10}
                    style={{
                        backgroundColor: Design.white,
                        paddingHorizontal: Platform.OS == "ios" ? 20 : 15,
                        paddingVertical: Platform.OS == "ios" ? 10 : 7,
                        //height: Dimensions.get("window").height * 20 / 100,
                        marginTop: Platform.OS == "ios" ? 30 : 20,
                        marginHorizontal: Platform.OS == "ios" ? 17 : 15,
                    }}

                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Textview
                            text={'Venue Points'}
                            font_family={"medium"}
                            color={Design.light_grey}
                            text_align={'center'}
                            font_size={Design.font_14}


                        />

                        {/* <TouchableOpacity
                           // onPress={feather_click}
                        >
                            <Imageview
                                url={GlobalImages.sideArrow}
                                width={Platform.OS == "ios" ? 22 : 18}
                                height={Platform.OS == "ios" ? 22 : 18}
                                image_type={"local"}
                                resize_mode={"contain"}
                            />

                        </TouchableOpacity> */}

                    </View>

                    <Textview
                        text={(props.dashboard_list.total_venue_points??'0') + ' pts'}
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

                                <Textview
                                    text={(props.dashboard_list.earn_venue_points??'0') + ' pts'}
                                    font_family={"medium"}
                                    color={Design.black}
                                    font_size={Design.font_17}
                                    margin_top={Platform.OS == "ios" ? 2 : 0}

                                />
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
                                <Textview
                                    text={(props.dashboard_list.spend_venue_points??'0') + ' pts'}
                                    font_family={"medium"}
                                    color={Design.black}
                                    font_size={Design.font_17}
                                    margin_top={Platform.OS == "ios" ? 2 : 0}

                                />
                            </View>
                        </View>

                    </View>


                </CardView>

                <Textview
                    text={'General'}
                    font_family={"medium"}
                    color={Design.black}
                    font_size={Design.font_18}
                    margin_top={Platform.OS == "ios" ? 15 : 10}
                    margin_horizontal={Platform.OS == "ios" ? 17 : 15}

                />

                <FlatList
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    data={profileList}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    style={{ flexGrow: 0, marginBottom: 10, marginTop: Platform.OS == "ios" ? 10 : 2, paddingBottom: Platform.OS == "ios" ? 10 : 5, marginHorizontal: 10, }}
                    renderItem={renderItem_profile}
                    keyExtractor={keyExtractor_profile}
                />

            </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(TabProfile);