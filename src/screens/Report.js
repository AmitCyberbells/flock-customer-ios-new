import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, ScrollView, Platform, ImageBackground, TextInput } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";

function Report(props) {
    const { info, report_list } = props;
    const [report_status, set_report_status] = useState("false")
    const [report, set_report] = useState("")
    const [loader, setLoader] = useState(false)
    const [desc, set_desc] = useState("")

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
                GET_DATA_API()
            }
        });
    }, []);

    function GET_DATA_API() {
        if (props.report_list.length == 0) {
            setLoader(true)
        }
        var data = new FormData();
        data.append("user_id", info.user_id);
        ApiCall.postRequest(Server.report_type, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                let { actions } = props;
                actions.report_type_data(response.report_type)
                console.log(response.report_type)
            }
        });
    }

    function click_back() {
        props.navigation.goBack()
    }

    const renderItem_report = useCallback(
        ({ item, index }) => (
            <Textview
                text={item.venue_title}
                font_family={"regular"}
                color={Design.grey}
                margin_top={15}
                font_size={Design.font_15}
                text_click={select_report.bind(this, item)}
            />

        ), [props.report_list]);

    const keyExtractor_notificationList = (item) => item.id;

    function click_handle() {
        if (report_status == "false") {
            set_report_status("true")
        }
        else {
            set_report_status("false")
        }

    }

    function select_report(item) {
        set_report(item.venue_title)
        set_report_status("false")
    }

    function submit_click() {
        console.log("call")
        console.log(report)
        console.log(desc)
        if (report == "") {
            Snackbar.show({
                text: "Choose your report type",
                duration: Snackbar.LENGTH_SHORT,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: Design.primary_color_orange
            });
        }
        else if (desc == "") {
            Snackbar.show({
                text: "Please enter description",
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
                    submit_data()
                }
            });
        }
    }

    function submit_data() {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("report_type", report);
        data.append("description", desc);
        data.append("image", "");
        

        console.log(data)
        console.log(Server.venue_reportt)
        ApiCall.postRequest(Server.venue_reportt, data, (response, error) => {
            setLoader(false)
            //console.log(response)
            if (response != undefined && response.status == "success") {
                Snackbar.show({
                    text: "Your report sent successfully.",
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
                props.navigation.goBack()
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
                        text={'Report'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>
            <ScrollView showsVerticalScrollIndicator={false}
                style={{ marginHorizontal: Platform.OS == "ios" ? 12 : 10 }}>
                <Textview
                    text={'Enter Details'}
                    font_family={"medium"}
                    color={Design.black}
                    margin_top={Platform.OS == "ios" ? 25 : 25}
                    font_size={Design.font_20}


                />

                <Textview
                    text={'Choose report type'}
                    font_family={"regular"}
                    color={Design.light_grey}
                    margin_top={Platform.OS == "ios" ? 20 : 10}
                    font_size={Design.font_16}
                />

                <TouchableOpacity activeOpacity={1} style={{

                    backgroundColor: Design.light_purple,
                    paddingVertical: Platform.OS == "ios" ? 15 : 10,
                    paddingHorizontal: Platform.OS == "ios" ? 20 : 20,
                    borderRadius: 10,
                    marginTop: 10



                }}
                    onPress={click_handle}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                        <Textview
                            text={report == "" ? "Select report" : report}
                            font_family={report == "" ? "regular" : "medium"}
                            color={report == "" ? Design.grey : Design.black}
                            font_size={Design.font_17}
                        />
                        <Imageview
                            url={report_status == "false" ? GlobalImages.dropDown : GlobalImages.dropUp}
                            width={Platform.OS == "ios" ? 20 : 15}
                            height={Platform.OS == "ios" ? 20 : 15}
                            image_type={"local"}
                            resize_mode={"contain"}
                        />
                    </View>

                    {
                        report_status == "true"
                            ?
                            <FlatList
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                                data={props.report_list}
                                style={{ height: 110 }}
                                renderItem={renderItem_report}
                                keyExtractor={keyExtractor_notificationList}

                            />
                            :
                            null
                    }




                </TouchableOpacity>



                <Textview
                    text={'Description'}
                    font_family={"regular"}
                    color={Design.light_grey}
                    margin_top={Platform.OS == "ios" ? 20 : 10}
                    font_size={Design.font_16}
                />
                
                    <TextInput
                        style={{
                            color: Design.black, 
                            fontSize: Design.font_15, 
                            fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                            backgroundColor: Design.light_purple,
                            minHeight: 120,
                            borderRadius: 10,
                            marginTop: 10,
                            paddingLeft:15,
                            paddingTop:15,
                            textAlignVertical:'top'
                        }}
                        value={desc}
                        placeholder=""
                        placeholderTextColor={Design.grey}
                        onChangeText={value => set_desc(value)}
                        multiline={true}
                    />


               

                <TouchableOpacity onPress={submit_click} style={{ backgroundColor: Design.light_blue, flex: 1, marginVertical: 35, paddingVertical: Platform.OS == "ios" ? 17 : 10, borderRadius: 10 }}>
                    <Textview
                        text={'Submit'}
                        font_family={"regular"}
                        color={Design.white}
                        text_align={'center'}
                        font_size={Design.font_16}
                        text_click={submit_click}
                    />
                </TouchableOpacity>
            </ScrollView>


        </View>
    )
}
const mapStateToProps = state => ({
    info: state.info.info,
    report_list: state.report_list.report_list,
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);