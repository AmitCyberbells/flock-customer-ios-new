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

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import Nodata from "../child_class/no_data";
var ans = ""
function SupportList(props) {
    const { info, support_list } = props;
    const [loader, setLoader] = useState(false)
    const [answer_dialog, set_answer_dialog] = useState(false)
    const [data_found, set_data_found] = useState("")

    useEffect(() => {
        const isFocused = props.navigation.isFocused();
        if (isFocused) {
            api_hit()
        }
        const navFocusListener = props.navigation.addListener('didFocus', () => {
            api_hit()
        });
        return () => {
            navFocusListener.remove()
        }
    }, []);

    function api_hit() {
        if (props.support_list.length == 0) {
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
    }

    function GET_DATA_API() {
        if (props.support_list.length == 0) {
            setLoader(true)
        }
        var data = new FormData();
        data.append("user_id", info.user_id);
        console.log(data);
        console.log(Server.spoton_list)
        ApiCall.postRequest(Server.spoton_list, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                let { actions } = props;
                actions.support_data(response.spotdata)

                if (response.spotdata.length == 0) {
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


    function click_back() {
        props.navigation.goBack()
    }
    function add() {
        props.navigation.navigate("Support")
    }

    function see_ans_click(type) {
        ans = type
        set_answer_dialog(true)
    }
    function cross_click() {
        set_answer_dialog(false)
    }

    const renderItem_tutorialList = useCallback(
        ({ item, index }) => (

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    backgroundColor: Design.white,
                    marginHorizontal: 15,
                    marginTop: 20,
                    paddingVertical: 8,
                    paddingHorizontal: 15

                }}
            >

                <Textview
                    text={item.title}
                    font_family={"medium"}
                    color={Design.black}
                    font_size={Design.font_15}
                />

                <Textview
                    // text={'Lorem Sum adsf;asd asdfnsakdgn adfasdf asdfhsgnas asdhsadvnas ;asdfasfas hasdvjasd sdghasdgas adadsva gasdva asfkjasdfasf ;safhjadfasf sdfhasfaf ;asfjhsadfsadf sdfhsfafhj asfasfjhf hjkasdfjasf sdkafsadf sdfhsadfksdf kjasfjsah'}
                    text={item.msg}
                    font_family={"regular"}
                    lines={4}
                    color={Design.black}
                    font_size={Design.font_13}
                />
                {
                    item.reply == ""
                        ?
                        null
                        :
                        <Textview
                            text={'See Answer'}
                            font_family={"medium"}
                            color={Design.black}
                            font_size={Design.font_12}
                            margin_top={8}
                            text_decoration_line={'underline'}
                            text_click={see_ans_click.bind(this, item.reply)}
                        />
                }

                <Textview
                    text={item.datetime}
                    font_family={"regular"}
                    color={Design.grey}
                    text_align={'right'}
                    margin_top={15}
                    font_size={Design.font_12}
                />

            </CardView>

        ), [props.support_list]);


    const keyExtractor_category = (item) => item.img;


    return (
        <View style={CSS.Favcontainer}>
            <Loader loader={loader} />
            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 35 : 10, alignItems: 'center', marginHorizontal: 6 }}>
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
                        text={'Support'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>

                <TouchableOpacity
                    onPress={add}
                >
                    <Imageview
                        url={GlobalImages.add}
                        width={Platform.OS == "ios" ? 55 : 50}
                        height={Platform.OS == "ios" ? 55 : 50}
                        image_type={"local"}
                        resize_mode={"contain"}
                    />
                </TouchableOpacity>
            </View>


            <View>


                {
                    data_found == "true"
                        ?
                        <FlatList
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            data={props.support_list}
                            contentContainerStyle={{ height: '100%', paddingBottom: 15, }}
                            style={{ paddingBottom: Platform.OS == "ios" ? 10 : 5, }}
                            renderItem={renderItem_tutorialList}
                            keyExtractor={keyExtractor_category}

                        />

                        :
                        data_found == "false"
                            ?
                            <Nodata />
                            :
                            null
                }
            </View>








            <Dialog
                onTouchOutside={() => {
                    set_answer_dialog(false)

                }}
                width={0.8}
                visible={answer_dialog}
                dialogAnimation={new ScaleAnimation()}
                onHardwareBackPress={() => {
                    set_answer_dialog(false)
                    return true;
                }}
                actions={[
                    <DialogButton
                        text="DISMISS"
                        onPress={() => {
                            set_answer_dialog(false)
                        }}
                        key="button-1"
                    />,
                ]}
                dialogStyle={{ borderRadius: 10, overflow: 'hidden' }}
            >
                <DialogContent>
                    <View>
                        <TouchableOpacity
                            onPress={cross_click}

                        >
                            <Imageview
                                url={GlobalImages.close}
                                width={15}
                                height={15}
                                image_type={"local"}
                                resize_mode={"contain"}
                                align_self={'flex-end'}
                                margin_top={15}
                            />
                        </TouchableOpacity>
                        <Textview
                            text={ans}
                            color={Design.black}
                            font_family={"regular"}
                            font_size={Design.font_12}
                            margin_top={15}

                        />



                    </View>
                </DialogContent>
            </Dialog>
        </View>
    )
}
const mapStateToProps = state => ({
    info: state.info.info,
    support_list: state.support_list.support_list
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SupportList);