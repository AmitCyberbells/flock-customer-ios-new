import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ImageBackground,
    Alert,
    Platform
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import { StackActions, NavigationActions } from "react-navigation";

import { connect, useSelector } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import { createLog } from "../global/CreateLogs";

var venue_id = ""
var points = ""
var type = ""

import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';

import Lottie from "lottie-react-native";

function QR_Code(props) {

    const { info, location, current_location } = props;
    //const current_location = useSelector(state => state.global.current_location);

    const focus_qrcode = useRef();

    const { navigation } = props
    venue_id = navigation.getParam("venue_id", "")
    points = navigation.getParam("points", "")
    type = navigation.getParam("type", "")

    const [appPoint, setAppPoints] = useState(navigation.getParam("appPoints", ""));
    const [venuePoint, setVenuePoints] = useState(navigation.getParam("venuePoints", ""));
    const [venueTitle, setVenueTitle] = useState('');

    const [success_dialog, set_success_dialog] = useState(false)
    const [loader, setLoader] = useState(false);

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {

        // console.log (Global.latitude)
        // console.log(Global.longitude)
        /* let timer = setTimeout(() => {
            var data = new FormData();
            data.append("user_id", info.user_id);
            data.append("venue_id", 15);
            data.append("lat", '-33.915501');
            data.append("long", '151.170044');

            HOME_DATA_API(15, data);
        }, 3000);

        return () => clearTimeout(timer); */

    }, []);


    const onSuccess = e => {

        if (type == "singleDetailPage") {
            qr_code_handle_single_page(e)
        }
        else {
            qr_code_handle_other_page(e)
        }

    };

    const qr_code_handle_single_page = (e) => {

        if (e.data.includes("flockapp")) {
            var venueId = e.data.replace("flockapp", "");
            if (venue_id == venueId) {
                NetInfo.fetch().then(state => {
                    if (state.isConnected == false) {
                        Snackbar.show({
                            text: 'Please turn on your internet',
                            duration: Snackbar.LENGTH_SHORT,
                            fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                            backgroundColor: Design.primary_color_orange
                        });
                    } else {
                        HOME_DATA_API(venue_id)
                    }
                });
            }
            else {
                Snackbar.show({
                    text: 'This QR code is not for this venue',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
                focus_qrcode.current.reactivate()
            }
        }
        else {
            Snackbar.show({
                text: 'Invalid QR Code',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
            focus_qrcode.current.reactivate()
        }

    }


    const qr_code_handle_other_page = (e) => {

        if (e.data.includes("flockapp")) {
            var venueId = e.data.replace("flockapp", "");
            NetInfo.fetch().then(state => {
                if (state.isConnected == false) {
                    Snackbar.show({
                        text: 'Please turn on your internet',
                        duration: Snackbar.LENGTH_SHORT,
                        fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                        backgroundColor: Design.primary_color_orange
                    });
                } else {
                    HOME_DATA_API(venueId)
                }
            });
        }
        else {
            Snackbar.show({
                text: 'Invalid QR Code',
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
            focus_qrcode.current.reactivate()
        }

    }


    function click_back() {
        props.navigation.goBack()
        console.log('Back Button')
    }

    function getCheckinFormData(v_id) {
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_id", v_id);
        data.append("lat", current_location.latitude);
        data.append("long", current_location.longitude);

        return data;
    }

    /* function plainData(formData) {
        const plainObject = {};

        for (const [key, value] of formData.entries()) {
            plainObject[key] = value;
        }

        return plainObject;
    } */

    async function HOME_DATA_API(v_id) {
        setLoader(true)

        var data = getCheckinFormData(v_id);
        console.log(data)
        console.log(Server.checkin)

        ApiCall.postRequest(Server.checkin, data, (response, error) => {
            setLoader(false)

            // create app logs
            createLog('checkin api response: ', {
                user_id: info.user_id,
                response
            });

            console.log('checkin api done: ', response, typeof response)

            if (response != undefined && response.status == "success") {
                setVenuePoints(response.venue_points);
                setAppPoints(response.feather_points);

                if (response.venuedetail.length > 0) {
                    setVenueTitle(response.venuedetail[0].venue_title);
                }
                set_success_dialog(true)
            }
            else {
                Alert.alert("Checkin Failed!", response.message)
            }

        });

    }

    function done_click() {
        set_success_dialog(false)
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: "CustomTabBar"
                })
            ]
        });
        props.navigation.dispatch(resetAction);
    }

    return (

        <View
            style={CSS.qr_code_container}>
            <Loader loader={loader} />

            <View style={[CSS.qr_code_toolbar, { marginTop: Platform.OS == 'ios' ? 40 : 10 }]}>
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
                        text={'Scan QR Code'}
                        font_family={"medium"}
                        color={Design.white}
                        text_align={'center'}
                        font_size={Design.font_20}
                    />
                </View>

                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />

            </View>

            <Textview
                text={'Please place the QR code within the frame. Avoid shaking for best results.'}
                font_family={"regular"}
                color={Design.white}
                text_align={'center'}
                font_size={Design.font_15}
                margin_horizontal={30}
                margin_top={50}

            />

            <View style={{ position: 'relative' }}>
                <View style={CSS.qr_code_view}>

                    <QRCodeScanner
                        ref={focus_qrcode}
                        onRead={(e) => onSuccess(e)}
                    />

                </View>
                <View style={{ width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', top: Platform.OS == 'ios' ? '9%' : '9%', }}>

                    <Imageview
                        width={60}
                        height={60}
                        align_self={'center'}
                        //resize_mode={'contain'}
                        image_type={"local"}
                        url={GlobalImages.FlockBird}

                    />

                </View>

                <Textview
                    text={'If you can\'t find the QR code, please ask a staff member for assistance.'}
                    font_family={"regular"}
                    color={Design.white}
                    text_align={'center'}
                    font_size={Design.font_14}
                    margin_horizontal={30}
                    margin_top={30}
                />
            </View>



            <Dialog
                onTouchOutside={() => {
                    set_success_dialog(true)

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
                    <Textview
                        text={"Check in Successful"}
                        color={Design.black}
                        margin_top={20}
                        font_family={"bold"}
                        font_size={Design.font_18}
                        text_align={'center'}
                    />

                    <View style={{
                        marginTop: 20,
                        textAlign: 'center'
                    }}>
                        {venueTitle ?
                            <Text style={{
                                color: '#96a7f0',
                                fontSize: Design.font_18,
                                fontFamily: 'medium',
                                textAlign: 'center',
                                width: '100%'
                            }}>
                                <Imageview
                                    url={GlobalImages.businessEggs}
                                    width={20}
                                    height={20}
                                    image_type={"local"}
                                    resize_mode={"contain"}
                                    tint_color={Design.primary_color_orange}
                                />
                                &nbsp;
                                <Textview
                                    text={venueTitle}
                                    color={Design.primary_color_orange}
                                    font_family={"semi_bold"}
                                    text_align={'center'}
                                    font_size={Design.font_14}
                                />
                            </Text>
                            : null
                        }

                        {appPoint ?
                            <View>
                                <Text style={{
                                    color: '#96a7f0',
                                    fontSize: Design.font_18,
                                    fontFamily: 'medium',
                                    textAlign: 'center'
                                }}>
                                    App Points Credited: +{appPoint}
                                </Text></View>
                            : null
                        }

                        {venuePoint ? <View>
                            <Text style={{
                                color: '#96a7f0',
                                fontSize: Design.font_18,
                                fontFamily: 'medium',
                                textAlign: 'center'
                            }}>
                                Venue Points Credited: +{venuePoint}
                            </Text></View> : null
                        }


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
                </DialogContent>
            </Dialog>

        </View>

    )
}

const mapStateToProps = state => ({
    info: state.info.info,
    category_list: state.category_list.category_list,
    venue_list: state.venue_list.venue_list,
    current_location: state.global.current_location
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(QR_Code);


