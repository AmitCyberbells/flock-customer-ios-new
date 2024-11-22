import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, TextInput } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import Function from "../global/Functions";


import Nodata from "../child_class/no_data";
import AppIntroSlider from 'react-native-app-intro-slider';
import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import { Rating, AirbnbRating } from 'react-native-ratings';

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

var inputTimer;

function Hot(props) {
    const { info, venue_hot_list } = props;
    const [loader, setLoader] = useState(false)
    const [data_found, set_data_found] = useState("")
    const [radius, set_radius] = useState(20)


    //const []

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
                GET_DATA_API();
            }
        });
    }, []);


    function GET_DATA_API() {

        if (venue_hot_list.length == 0) {
            setLoader(true)
        }
        else {
            set_data_found("true")
        }

        var data = new FormData();
        data.append("type", "Hot");
        data.append("user_id", info.user_id);

        if (radius) {
            data.append('radius', radius)
        }

        console.log(data)
        console.log(Server.hot_boost)

        ApiCall.postRequest(Server.hot_boost, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {

                let { actions } = props;
                actions.saved_vanue_hot(response.result);
                if (response.result.length == 0) {
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

    /* const onChangeRadius = (value) => {

        var duration = 1000;
        set_radius(value)
        clearTimeout(inputTimer);
        inputTimer = setTimeout(() => {
            if (value.length !== 0) {
                GET_DATA_API();
            }
        }, duration);

    }; */

    function fav_unfav_click(item, index) {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_id", item.venue_id);
        data.append("cat_id", item.cat_id);
        ApiCall.postRequest(Server.mark_favourite_venue, data, (response, error) => {
            setLoader(false)
            let val;
            if (item.favourite == "1") {
                val = "0"
            }
            else {
                val = "1"
            }
            if (response != undefined && (response.status == "success")) {
                const aar = [...props.venue_hot_list]
                aar[index].favourite = val
                let { actions } = props;
                actions.saved_vanue_hot(aar);
                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: item.favourite == "1" ? "green" : 'red'
                });
            }

        });


    }

    function click_hot(item) {
        props.navigation.navigate('SingleDetail', { "venue_id": item.venue_id })

        // props.navigation.navigate('SingleDetail')
    }

    const renderItem_hotelList = useCallback(
        ({ item, index }) => (

            <TouchableOpacity
                onPress={click_hot.bind(this, item)}
                style={{ width: '46%', height: Platform.OS == "ios" ? 190 : 160, marginHorizontal: '2%', marginTop: 15 }}>
                <ImageBackground
                    source={{ uri: item.image }}
                    imageStyle={{ opacity: 0.45 }}
                    resizeMode={'stretch'}
                    style={{
                        width: '100%',
                        height: 100,
                        height: Platform.OS == "ios" ? 190 : 160,
                        //marginVertical: 7,
                        borderRadius: 10,
                        overflow: 'hidden',
                        backgroundColor: '#000000'

                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        {<View style={{ paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            { (item.venue_type === 'Boosted') ? 
                            <Imageview
                                url={GlobalImages.star}
                                width={15}
                                height={15}
                                image_type={"local"}
                                resize_mode={"contain"}
                                radius={10}

                                tint_color={Design.white}
                            />
                            : 
                            <Imageview
                                url={GlobalImages.hot}
                                width={15}
                                height={15}
                                image_type={"local"}
                                resize_mode={"contain"}a
                                radius={10}

                                tint_color={Design.white}
                            />
                            }
                            <Textview
                                text={item.venue_type}
                                font_family={"regular"}
                                color={Design.white}
                                font_size={Design.font_14}
                                margin_horizontal={5}
                            />
                        </View>}
                        <TouchableOpacity onPress={fav_unfav_click.bind(this, item, index)}>
                            <Imageview
                                url={GlobalImages.favourite}
                                width={Platform.OS == "ios" ? 27 : 22}
                                height={Platform.OS == "ios" ? 27 : 22}
                                image_type={"local"}
                                resize_mode={"cover"}
                                align_self={'flex-start'}
                                margin_top={10}
                                margin_right={10}
                                tint_color={item.favourite == "0" ? Design.grey : Design.primary_color_orange}
                            />
                        </TouchableOpacity>

                    </View>

                    <View style={{ marginHorizontal: 5, marginTop: '18%' }}>

                        <Textview
                            text={item.venue_title}
                            font_family={"medium"}
                            color={Design.white}
                            font_size={Design.font_15}
                            margin_horizontal={5}
                            text_click={click_hot.bind(this, item)}
                        />

                        <Textview
                            text={item.location}
                            font_family={"regular"}
                            color={Design.white}
                            font_size={Design.font_11}
                            margin_horizontal={5}
                            margin_top={Platform.OS == "ios" ? 3 : 0}
                            text_click={click_hot.bind(this, item)}
                        />



                        {/* <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            marginLeft: 6
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
                        </View> */}

                    </View>

                    {/* <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, right: 0, }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Imageview
                                url={GlobalImages.points}
                                width={Platform.OS == "ios" ? 20 : 18}
                                height={Platform.OS == "ios" ? 20 : 18}
                                image_type={"local"}
                                resize_mode={"contain"}
                                margin_left={5}


                            />
                            <View style={{ marginBottom: 5, marginLeft: 5 }}>
                                <Textview
                                    text={'Free Drinks on'}
                                    font_family={"regular"}
                                    color={Design.white}
                                    font_size={Design.font_10}

                                />
                                <Textview
                                    text={'13 Lit points'}
                                    font_family={"regular"}
                                    color={Design.white}
                                    font_size={Design.font_10}

                                />
                            </View>


                        </View> 

                       <View style={{

                            backgroundColor: Design.primary_color_orange, color: Design.white, borderTopLeftRadius: 10, overflow: 'hidden', height: Platform.OS == "ios" ? 35 : 36, paddingHorizontal: 7
                        }}>
                            <Textview
                                text={"$ " + item.price}
                                font_family={"medium"}
                                color={Design.white}
                                font_size={Design.font_15}
                                margin_top={6}

                            />

                        </View> 

                    </View> */}

                </ImageBackground>
            </TouchableOpacity>

        ), [venue_hot_list]);


    const keyExtractor_hotellist = (item) => item.id;

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
                        text={'Hot'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>

            {/* <View style={{ flexDirection: 'row', width: Platform.OS == "ios" ? Dimensions.get("window").width * 75 / 100 : Dimensions.get("window").width * 73 / 100, height: Platform.OS == "ios" ? 50 : 40, alignItems: 'center', paddingHorizontal: 15 }}>
                <Textview
                    text="Change km"
                    font_family={"medium"}
                    color={Design.black}
                    font_size={Design.font_15}
                    margin_horizontal={5}
                    //text_click={click_hot.bind(this, item)}
                />

                <TextInput
                    style={{
                        flex: 1, color: Design.black, paddingLeft: 20, fontSize: Design.font_14, backgroundColor: Design.edit_text, borderRadius: 25, fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular
                    }}
                    placeholder="Change km"
                    placeholderTextColor={Design.grey}
                    value={radius}
                    onChangeText={(value) => onChangeRadius(value)}
                />

            </View> */}


            {
                data_found == "true"
                    ?
                    <FlatList
                        horizontal={false}
                        numColumns={2}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={venue_hot_list}
                        style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15, marginBottom: Platform.OS == "ios" ? 80 : 65, marginHorizontal: '2%' }}
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
    venue_hot_list: state.venue_hot_list.venue_hot_list

});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Hot);
