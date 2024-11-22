import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Image, Text, TouchableOpacity, Dimensions, Animated, Platform, FlatList, Alert } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import Global from "../global/Global"
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, NavigationActions } from "react-navigation";
import ApiCall from '../util/Network';

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import Server from "../util/Server";
import Snackbar from "react-native-snackbar";
import { json } from "body-parser";
import Loader from "../component/AnimatedLoader";
import ActionButton from "../component/ActionButton";

var DeviceToken;

function SideNavigation(props) {
    const { info } = props;
    console.log(info)

    const [logout_dialog, set_logout_dialog] = useState(false)
    const [loader, setLoader] = useState(false)
    const [navList, setnavList] = useState([

        // {
        //     img: GlobalImages.navProfile,
        //     title: 'My Profile',

        // },
        // {
        //     img: GlobalImages.navDashboard,
        //     title: 'My Dashboard',

        // },

        {
            img: GlobalImages.discount,
            title: 'My Offers',
            slug: 'my_offers',
        },
        {
            img: GlobalImages.favourite,
            title: 'Saved Offers',
            slug: 'saved_offers',
        },
        {
            img: GlobalImages.navFaq,
            title: 'FAQs',
            slug: 'faq',

        },
        {
            img: GlobalImages.navReport,
            title: 'Report',
            slug: 'report',
        },
        {
            img: GlobalImages.tutorials,
            title: 'How To',
            slug: 'tutorials',
        },
        {
            img: GlobalImages.bird,
            title: 'Request venue',
            slug: 'request_venue',
        },
        {
            img: GlobalImages.navSetting,
            title: 'Settings',
            slug: 'settings',

        },
        {
            img: GlobalImages.navLogout,
            title: 'Logout',
            slug: 'logout',
        },

    ])

    const moveAnimationA = useRef(new Animated.Value(-300)).current;

    useEffect(() => {
        getToken()
        animation()
        console.log(info.user_id)
    }, []);

    function animation() {
        Animated.timing(moveAnimationA, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }

    function side_click(slug, index) {
        console.log({ slug })
        if (slug == "report") {
            props.navigation.navigate('Report')
            props.closeMenu()
        }
        else if (slug == "faq") {
            props.closeMenu()
            props.navigation.navigate('Faq')
        }
        else if (slug == "request_venue") {
            props.closeMenu();

            props.navigation.navigate('RequestVenue');
        }
        // else if (slug == "My Profile") {
        //     Global.index = 4
        //     props.navigation.navigate('TabProfile')
        //     props.closeMenu()
        // }
        // else if (slug == "My Dashboard") {
        //     Global.index = 2
        //     props.closeMenu()
        //     props.navigation.navigate('TabInu')
        // }
        else if (slug == "settings") {
            Global.index = 2
            props.closeMenu()
            props.navigation.navigate('Settings')
        }
        else if (slug == "saved_offers") {
            Global.index = 2
            props.closeMenu()
            props.navigation.navigate('MySavedOffers')
        }
        else if (slug == "my_offers") {
            Global.index = 2
            props.closeMenu()
            props.navigation.navigate('UsedOffered')
        }
        else if (slug == "logout") {
            //  props.closeMenu()
            //AsyncStorage.removeItem('startUpScreen');

            set_logout_dialog(true)
        }
        else if (slug == "tutorials") {
            props.closeMenu()
            props.navigation.navigate('Tutorials')
        }
    }

    const renderItem_nav = useCallback(
        ({ item, index }) => (

            <TouchableOpacity
                onPress={side_click.bind(this, item.slug, index)}

                style={{
                    backgroundColor: Design.white,
                    paddingHorizontal: Platform.OS == "ios" ? 25 : 20,
                    paddingVertical: Platform.OS == "ios" ? 15 : 10,
                    marginVertical: Platform.OS == "ios" ? 7 : 5,

                }}

            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Imageview
                        url={item.img}
                        width={Platform.OS == "ios" ? 27 : 23}
                        height={Platform.OS == "ios" ? 27 : 23}
                        image_type={"local"}
                        resize_mode={"contain"}
                        tint_color={Design.grey}

                    />

                    <Textview
                        text={item.title}
                        font_family={"medium"}
                        color={Design.light_grey}
                        lines={1}
                        font_size={Design.font_18}
                        margin_left={Platform.OS == "ios" ? 25 : 25}
                        active_opacity={0.4}
                        text_click={side_click.bind(this, item.slug)}
                    />

                </View>

            </TouchableOpacity>

        ), [navList]);

    const keyExtractor_nav = (item) => item.slug;

    function cancel_click() {
        set_logout_dialog(false)
    }

    async function getToken() {

        var fcmToken = await AsyncStorage.getItem("device_token")

        DeviceToken = fcmToken;

        console.log('Login Token:---------> ', DeviceToken)

    }

    function ok_click() {

        set_logout_dialog(false);
        logoutApi();
    }

    function logoutApi() {

        setLoader(true);

        var data = new FormData();

        data.append("user_id", info.user_id);
        data.append("token", DeviceToken);
        data.append("device_type", Platform.OS);

        console.log(data)
        console.log(Server.logout)

        ApiCall.postRequest(Server.logout, data, async (response, error) => {

            if (response != undefined && response.status == "success") {
                await AsyncStorage.clear();
                props.navigation.replace('Login');

            } else {
                Snackbar.show({
                    text: 'Something went wrong while logout!',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            }

            props.closeMenu();
            setLoader(false);

        });

    }

    return (

        <TouchableOpacity activeOpacity={1}
            style={{
                flex: 1,
                width: "110%",
                height: "110%",
                backgroundColor: 'rgba(0,0,0,0.2)'
            }}
            onPress={() => props.closeMenu()}>

            <Loader loader={loader} />

            <Animated.View style={{ flex: 1, height: '100%', width: Dimensions.get('window').width - 70, backgroundColor: 'white', transform: [{ translateX: moveAnimationA }] }}>

                <View style={{ flex: 1, marginTop: 30, backgroundColor: Design.white, maxHeight: Dimensions.get("window").height * 88 / 100 }}>

                    <CardView

                        cardElevation={2.5}
                        cornerRadius={10}

                        style={{

                            backgroundColor: Design.white,
                            paddingHorizontal: Platform.OS == "ios" ? 20 : 15,
                            paddingVertical: Platform.OS == "ios" ? 10 : 7,
                            marginTop: Platform.OS == "ios" ? 20 : 15,
                            marginHorizontal: Platform.OS == "ios" ? 17 : 15,

                        }}

                    >
                        <View style={{ flexDirection: 'row', overflow: 'hidden', padding: 2 }}>

                            <CardView
                                cardElevation={2.5}
                                cornerRadius={80}
                                style={{
                                    backgroundColor: Design.white,
                                    height: Platform.OS == "ios" ? 90 : 70,
                                    width: Platform.OS == "ios" ? 90 : 70,
                                    padding: Platform.OS == "ios" ? 10 : 8,
                                }}

                            >
                                <Imageview
                                    url={info.image}
                                    width={Platform.OS == "ios" ? 70 : 54}
                                    height={Platform.OS == "ios" ? 70 : 54}
                                    radius={Platform.OS == "ios" ? 80 : 57}

                                    align_self={'center'}
                                    image_type={"server"}
                                    resize_mode={"cover"}
                                />

                            </CardView>

                            <View style={{ justifyContent: 'center', marginHorizontal: 12 }}>

                                <Textview
                                    text={info.first_name + " " + info.last_name}
                                    font_family={"medium"}
                                    color={Design.black}
                                    lines={1}
                                    font_size={Design.font_16}
                                />

                                <View style={{ width: '90%' }}>
                                    <Textview
                                        text={info.email}
                                        font_family={"medium"}
                                        color={Design.light_grey}
                                        lines={1}
                                        font_size={Design.font_14}
                                    />
                                </View>

                            </View>

                        </View>

                    </CardView>

                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        data={navList}
                        style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 10 : 10, paddingBottom: Platform.OS == "ios" ? 10 : 5, }}
                        renderItem={renderItem_nav}
                        keyExtractor={keyExtractor_nav}
                    />

                </View>

            </Animated.View >

            {
                logout_dialog == true ?

                    <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgba(52,52,52,0.5)', justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ width: '85%', paddingVertical: 10, backgroundColor: 'white', borderRadius: 10 }}>

                            <Textview
                                text={"Confirmation"}
                                color={Design.black}
                                margin_top={20}
                                font_family={"bold"}
                                font_size={Design.font_18}
                                text_align={'center'}
                            />

                            <Textview

                                text={"Are you sure you want to logout ? "}
                                active_opacity={0.4}
                                color={Design.black}
                                font_family={"medium"}
                                margin_top={25}
                                font_size={Design.font_16}
                                margin_horizontal={10}
                                text_align={'center'}

                            />

                            <View style={[CSS.logout_text_view, { marginBottom: 10 }]}>

                                <ActionButton
                                    button_text={'Cancel'}
                                    click_fun={cancel_click}
                                />

                                <ActionButton
                                    button_text={'OK'}
                                    click_fun={ok_click}
                                />
                            </View>

                        </View>

                    </View>

                    :
                    null
            }


        </TouchableOpacity >


    )
}
const mapStateToProps = state => ({
    info: state.info.info
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNavigation);