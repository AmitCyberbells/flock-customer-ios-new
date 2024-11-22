import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, TextInput } from 'react-native'
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

var inputTimer;

function Search(props) {
    const { info, category_list } = props;
    const [loader, setLoader] = useState(false)
    const [data_found, set_data_found] = useState("")
    const [list, set_list] = useState([])
    const [search, set_search] = useState("")

    useEffect(() => {

    }, []);



    function GET_DATA(search) {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_keyword", search);
        ApiCall.postRequest(Server.searchvenue, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                if (response.resultData.length != 0) {
                    set_data_found("true")
                    set_list(response.resultData)
                }
                else {
                    set_data_found("false")
                }
            }
            else {
                set_data_found("false")
            }
        });
    }

    function fav_unfav_click(item, index) {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_id", item.venue_id);
        data.append("cat_id", item.cat_id);

        ApiCall.postRequest(Server.mark_favourite_venue, data, (response, error) => {
            //console.log(response)
            setLoader(false)

            let val;
            if (item.favourite == "1") {
                val = "0"
            }
            else {
                val = "1"
            }


            if (response != undefined && (response.status == "success")) {
                const aar = [...list]
                aar[index].favourite = val
                set_list(aar)

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: item.favourite == "1" ? "green" : 'red'
                });
            }

        });


    }

    const onInput = (value) => {
        var duration = 900;
        set_search(value)
        clearTimeout(inputTimer);
        inputTimer = setTimeout(() => {
            if (value.length == 0) {
                set_list([])
                set_data_found("false")
            }
            else {
                set_list([])
                GET_DATA(value)
            }
        }, duration);
    };

    function click_hot(item) {
        props.navigation.navigate('SingleDetail', { "venue_id": item.venue_id })

        // props.navigation.navigate('SingleDetail')
    }
    const renderItem_hotelList = useCallback(
        ({ item, index }) => (




            <TouchableOpacity
            onPress={click_hot.bind(this,item)}

                style={{ width: Dimensions.get("window").width }}>



                <ImageBackground
                    source={{ uri: item.image }}
                    imageStyle={{ opacity: 0.45 }}
                    resizeMode={'stretch'}
                    style={{
                        width: Platform.OS == "ios" ? Dimensions.get("window").width * 95 / 100 : Dimensions.get("window").width * 94 / 100,
                        height: Platform.OS == "ios" ? 180 : 150,
                        marginVertical: 7,
                        borderRadius: 10,
                        overflow: 'hidden',
                        backgroundColor: '#000000'

                    }}
                >

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

                        <View style={{ backgroundColor: Design.primary_color_orange, color: Design.white, paddingHorizontal: Platform.OS == "ios" ? 30 : 25, borderBottomLeftRadius: 10, overflow: 'hidden', height: Platform.OS == "ios" ? 35 : 30 }}>
                            <Textview
                                text={"$ " + item.price}
                                font_family={"medium"}
                                color={Design.white}
                                font_size={Design.font_17}
                                margin_top={Platform.OS == "ios" ? 6 : 3}
                            />

                        </View>

                    </View>





                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: Platform.OS == "ios" ? 15 : 10, paddingHorizontal: 15, justifyContent: 'space-between', width: '100%' }}>

                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Textview
                                    text={item.venue_title}
                                    font_family={"medium"}
                                    color={Design.white}
                                    font_size={Design.font_20}

                                />
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    marginLeft: 10
                                }}>
                                    <Imageview
                                        url={GlobalImages.singleStar}
                                        width={13}
                                        height={13}
                                        image_type={"local"}
                                        resize_mode={"cover"}
                                        margin_top={Platform.OS == "ios" ? 4 : 2}

                                    />
                                    <Textview
                                        text={item.rating}
                                        font_family={"regular"}
                                        color={Design.white}
                                        font_size={Design.font_11}
                                        margin_horizontal={5}
                                        margin_top={Platform.OS == "ios" ? 3 : 0}
                                    />
                                </View>
                            </View>

                            <Textview
                                text={item.location}
                                font_family={"regular"}
                                color={Design.white}
                                font_size={Design.font_14}
                                margin_top={Platform.OS == "ios" ? 5 : 0}

                            />
                        </View>
                        <TouchableOpacity onPress={fav_unfav_click.bind(this, item, index)}>
                            <Imageview
                                url={GlobalImages.favourite}
                                width={Platform.OS == "ios" ? 40 : 35}
                                height={Platform.OS == "ios" ? 40 : 35}
                                image_type={"local"}
                                resize_mode={"cover"}
                                align_self={'flex-start'}
                                margin_top={10}
                                tint_color={item.favourite == "0" ? Design.grey : Design.primary_color_orange}

                            />
                        </TouchableOpacity>

                    </View>

                </ImageBackground>



            </TouchableOpacity>

        ), [list]);

    const keyExtractor_hotellist = (item) => item.id;

    function click_back() {
        props.navigation.goBack()
    }
    function map_click() {
        props.navigation.navigate('Map')
    }
    return (
        <View style={CSS.Favcontainer}>
            <Loader loader={loader} />
            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 50 : 5, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>
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
                        text={'Search'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>
            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 13 : 10, marginHorizontal: Platform.OS == "ios" ? 15 : 15, justifyContent: 'space-between', alignItems: 'center' }}>

                <View style={{ flexDirection: 'row', width: Platform.OS == "ios" ? Dimensions.get("window").width * 75 / 100 : Dimensions.get("window").width * 73 / 100, height: Platform.OS == "ios" ? 50 : 40, backgroundColor: Design.edit_text, borderRadius: 25, alignItems: 'center', paddingHorizontal: 15 }}>
                    <Imageview
                        url={GlobalImages.search}
                        width={Platform.OS == "ios" ? 20 : 18}
                        height={Platform.OS == "ios" ? 20 : 18}
                        image_type={"local"}
                        resize_mode={"cover"}



                    />

                    <TextInput
                        style={{
                            flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                        }}
                        placeholder="Hotels"
                        placeholderTextColor={Design.grey}
                        value={search}
                        onChangeText={(value) => onInput(value)}
                    />
                    {/* <Imageview
                        url={GlobalImages.filter}
                        width={Platform.OS == "ios" ? 20 : 18}
                        height={Platform.OS == "ios" ? 20 : 18}
                        image_type={"local"}
                        resize_mode={"cover"}



                    /> */}

                </View>
                <Imageview
                    url={GlobalImages.scanner}
                    width={Platform.OS == "ios" ? 40 : 35}
                    height={Platform.OS == "ios" ? 40 : 35}
                    image_type={"local"}
                    resize_mode={"cover"}
                    align_self={'flex-start'}


                />
            </View>

            <TouchableOpacity
                onPress={map_click}
                style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: Platform.OS == "ios" ? 22 : 15 }}>
                <Imageview
                    url={GlobalImages.nearby}
                    width={Platform.OS == "ios" ? 30 : 25}
                    height={Platform.OS == "ios" ? 30 : 25}
                    image_type={"local"}
                    resize_mode={"cover"}
                    align_self={'flex-start'}


                />
                <Textview
                    text={"Find Nearby"}
                    font_size={Design.font_17}
                    color={Design.black}
                    font_family={'medium'}
                    margin_left={15}
                    text_click={map_click}

                />
            </TouchableOpacity>

            <View style={{ borderColor: Design.grey_line, borderWidth: Platform.OS == "ios" ? 0.6 : 0.3, marginVertical: Platform.OS == "ios" ? 20 : 15, marginHorizontal: Platform.OS == "ios" ? 20 : 15 }} />


            {
                data_found == "true"
                    ?
                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={list}
                        style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 7 : 5, marginHorizontal: 10, marginBottom: Platform.OS == "ios" ? 80 : 65 }}
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

});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);