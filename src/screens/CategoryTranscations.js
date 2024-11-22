import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
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

var item;
function CategoryTranscations(props) {

    const {
        info,
    } = props;

    const { navigation } = props
    item = navigation.getParam("item", "")
    const [loader, setLoader] = useState(false)
    const [data_found, set_data_found] = useState("")
    const [list, set_list] = useState([])
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
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("cat_id", item.id);

        console.log(Server.categorywise_booking)
        console.log(data)

        ApiCall.postRequest(Server.categorywise_booking, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                //console.log(response)
                console.log(response.transactions[0])
                set_list(response.transactions[0].transactions)
                set_data_found("true")
            }
            else {
                set_data_found("false")
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


        ), [list]);
    const keyExtractor_transactionList = (item) => item.title;


    function click_back() {
        props.navigation.goBack()
    }
    return (
        <View style={CSS.Favcontainer}>

            <Loader loader={loader} />


            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 50 : 10, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>
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
                        text={item.catname}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>

                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>

            <View style={{ flex: 1 }}>
                {
                    data_found == "true"
                        ?
                        <FlatList
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={list}
                            nestedScrollEnabled={false}
                            style={{ flexGrow: 0, height: '100%', marginTop: Platform.OS == "ios" ? 18 : 15, marginHorizontal: 10 }}
                            renderItem={renderItem_transactionList}
                            keyExtractor={keyExtractor_transactionList}
                        />
                        :
                        data_found == "false"
                            ?
                            <Nodata />
                            :
                            null
                }

            </View>


        </View>
    )
}
const mapStateToProps = state => ({
    info: state.info.info,
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryTranscations);