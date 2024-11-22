import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";

import Nodata from "../child_class/no_data";
import AppIntroSlider from 'react-native-app-intro-slider';
import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';


function Stars(props) {
    const { info, venue_star_list } = props;
    const [loader, setLoader] = useState(false)
    const [data_found, set_data_found] = useState("")


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
        if (venue_star_list.length == 0) {
            setLoader(true)
        }
        else {
            set_data_found("true")
        }


        var data = new FormData();
        data.append("type", "Stars");
        data.append("user_id", info.user_id);

        
        ApiCall.postRequest(Server.venuedata_bytype, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {

                let { actions } = props;
                actions.saved_vanue_star(response.venuedetails);
                if (response.venuedetails.length == 0) {
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


    function click_hot(item) {
        props.navigation.navigate('SingleDetail', { "venue_id": item.venue_id })
    }

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
                const aar = [...props.venue_star_list]
                aar[index].favourite = val
                let { actions } = props;
                actions.saved_vanue_star(aar);

                console.log(val)
                console.log(aar)





                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: item.favourite == "1" ? "green" : 'red'
                });
            }

        });


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

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <View style={{ paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Imageview
                                url={GlobalImages.hot}
                                width={22}
                                height={22}
                                image_type={"local"}
                                resize_mode={"contain"}
                                radius={10}

                                tint_color={Design.white}
                            />
                            <Textview
                                text={item.venue_type}
                                font_family={"regular"}
                                color={Design.white}
                                font_size={Design.font_18}
                                margin_horizontal={10}
                            />
                        </View>
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

        ), [venue_star_list]);


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
                        text={'Stars'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>



            <FlatList
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={venue_star_list}
                style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15, marginHorizontal: 10, marginBottom: Platform.OS == "ios" ? 80 : 65 }}
                renderItem={renderItem_hotelList}
                keyExtractor={keyExtractor_hotellist}
            />


        </View>
    )
}
const mapStateToProps = state => ({
    info: state.info.info,
    venue_star_list: state.venue_star_list.venue_star_list

});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Stars);