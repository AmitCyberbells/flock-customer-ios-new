import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, TextInput, PermissionsAndroid } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"

//var item_index;
//var cal = 1
//var cat_id = ""
import Nodata from "../child_class/no_data";

import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { open_phone_setting } from "../component/UtilityService";
import Geolocation from "@react-native-community/geolocation";
import { requestLocationPermission } from "../global/GetCurrentLocation";

var inputTimer;
function Categories(props) {
    const { info, selected_category, location, current_location, actions, navigation } = props;

    //item_index = navigation.getParam('item_index', null)
    //cat_id = navigation.getParam('cat_id', null)

    const [loader, setLoader] = useState(false)
    const [category_id, set_category_id] = useState(navigation.getParam('cat_id', null))
    const [search, set_search] = useState("")
    const [selected_cat_index, set_selected_cat_index] = useState(navigation.getParam('item_index', 0))
    const [list, set_list] = useState([])
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
            }
        });

        var navigationdata = props.navigation.addListener('didFocus', () => {
            console.log('page is focused: ');
            set_list([]);
            getSelectedTab();
        });

        return () => {
            navigationdata.remove();
        }

    }, []);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            let pinLocation = await AsyncStorage.getItem('pin_location');
            if (!pinLocation) {
                fetch_venues_on_interval(category_id);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [])

    const storeSelectedTab = async (index, category) => {
        console.log('storeSelectedTab ', index, category);

        try {
            //AsyncStorage.setItem('selectedCategoryIndex', index);
            AsyncStorage.setItem('selectedCategoryId', category.category_id);

        } catch (error) {
            console.error('Error storing selected category ID: ', error);
        }
    };

    const getSelectedTab = async () => {
        try {

            //const index = await AsyncStorage.getItem('selectedCategoryIndex');
            const catid = await AsyncStorage.getItem('selectedCategoryId');

            set_category_id(catid);
            //set_selected_cat_index(index);
            GET_DATA(catid);

            console.log('getSelectedTab ', catid);
        } catch (error) {
            console.error('Error storing selected category ID: ', error);
        }
    };


    function Nearby_Venues() {
        props.navigation.navigate("Map");
    }

    function getDefaultCategory() {
        if ((props.category_list ?? []).length > 0) {
            set_selected_cat_index(0);
            return props.category_list[0].category_id;
        }

        return null;
    }

    async function fetch_venues_on_interval(catID) {
        if (!catID) {
            catID = getDefaultCategory();
        }

        let pin_location = current_location ?? location;

        try {
            const coords = await requestLocationPermission();
            if (coords) {
                console.log('requested location', coords)
                pin_location = coords;
                pin_location['radius'] = location.radius;
            }
        } catch (err) {
            console.log(err.message);
        }

        fetchVenuesApi(catID, pin_location);
    }

    function fetchVenuesApi(catID, pin_location)
    {
        var data = new FormData();

        data.append("user_id", info.user_id);
        data.append("cat_id", catID);
        data.append("venue_keyword", search);

        data.append("lat", pin_location.latitude);
        data.append("long", pin_location.longitude);
        data.append('radius', pin_location.radius);

        ApiCall.postRequest(Server.venue_list_by_category, data,
            (response, error) => {

                setLoader(false);

                if (response != undefined && response.status == "success") {
                    console.log('venue list by category: ');

                    if (response.venues.length != 0) {
                        set_data_found("true");
                        set_list(response.venues);
                    } else {
                        set_data_found("false");
                    }
                } else {
                    set_data_found("false");
                }
            });
    }

    async function GET_DATA(catID) {

        setLoader(true);

        if (!catID) {
            catID = getDefaultCategory();
        }

        let pinLocation = await AsyncStorage.getItem('pin_location');
        let pin_location = current_location ?? location;

        if (pinLocation) {
            pin_location = JSON.parse(pinLocation);
        } else {
            // get current user location

            try {
                const coords = await requestLocationPermission();
                if (coords) {
                    console.log('requested location', coords)
                    pin_location = coords;
                    pin_location['radius'] = location.radius;
                }
            } catch (err) {
                console.log(err.message);
            }
        }

        fetchVenuesApi(catID, pin_location);
    }

    const isVenueSleepy = (venue) => {
        return venue.is_sleepy;
    }

    const onInput = (value) => {

        var duration = 900;

        set_search(value)
        clearTimeout(inputTimer);
        inputTimer = setTimeout(() => {
            if (value.length == 0) {
                set_list([])
                GET_DATA(category_id)
            }
            else {
                set_list([])
                GET_DATA(category_id)
            }
        }, duration);

    };

    const click_cat = (item, index) => {
        console.log(item, index);

        set_selected_cat_index(index);
        set_list([]);
        set_search("");
        set_category_id(item.category_id);
        storeSelectedTab(index, item);
        GET_DATA(item.category_id);
    }

    function fav_unfav_click(item, index) {

        setLoader(true);

        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_id", item.venue_id);
        data.append("cat_id", item.cat_id);
        console.log(data);

        ApiCall.postRequest(Server.mark_favourite_venue, data, (response, error) => {
            setLoader(false)

            if (response != undefined && (response.status == "success")) {
                console.log(response.status)
                let val;
                if (item.favourite == "1") {
                    val = "0"
                }
                else {
                    val = "1"
                }

                const aar = [...list]
                aar[index].favourite = val
                set_list(aar)

                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: item.favourite == "1" ? "green" : 'red'
                });
            } else {
                console.log("else")
            }

        });
    }

    function click_hot(item) {
        props.navigation.push('SingleDetail', { "venue_id": item.id })
    }

    function click_back() {
        props.navigation.goBack();
    }

    const renderItem_category = useCallback(
        ({ item, index }) => (
            <TouchableOpacity
                onPress={() => click_cat(item, index)}
                style={{ alignItems: 'center', marginTop: Platform.OS == "ios" ? 27 : 25, width: Platform.OS == "ios" ? 90 : 75, marginBottom: Platform.OS == "ios" ? 7 : 15 }}>

                <View style={{
                    height: Platform.OS == "ios" ? 67 : 58,
                    width: Platform.OS == "ios" ? 67 : 58,
                    borderRadius: 10,
                    overflow: 'hidden',
                    alignItems: 'center',
                    backgroundColor: selected_cat_index == index ? "#2b4ce0" : "#dfe4fb",
                    justifyContent: 'center'
                }}>
                    <Imageview
                        url={item.category_image}
                        width={Platform.OS == "ios" ? 30 : 25}
                        height={Platform.OS == "ios" ? 30 : 25}
                        image_type={"server"}
                        resize_mode={"contain"}
                        tint_color={selected_cat_index == index ? Design.white : "#2b4ce0"}

                    />
                </View>

                <Textview
                    text={item.category_name}
                    font_family={"regular"}
                    color={'#2b4ce0'}
                    margin_top={5}
                    lines={1}
                    text_align={'center'}
                    font_size={Design.font_12}
                />
            </TouchableOpacity>

        ), [selected_cat_index]);

    const renderItem_hotelList = useCallback(
        ({ item, index }) => (
            <TouchableOpacity
                onPress={click_hot.bind(this, item)}
                style={{ width: '46%', height: Platform.OS == "ios" ? 190 : 160, marginHorizontal: '2%', marginTop: 15 }}>
                <ImageBackground
                    source={{ uri: item.image[0] }}
                    imageStyle={{ opacity: item.status == 0 ? 0.1 : 0.45 }}
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

                    <View style={{ position: 'relative', height: Platform.OS == "ios" ? 190 : 160 }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            {isVenueSleepy(item) ?
                                <View style={{
                                    width: '30%',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Imageview
                                        url={GlobalImages.sleepy}
                                        width={Platform.OS == "ios" ? 40 : 40}
                                        height={Platform.OS == "ios" ? 40 : 40}
                                        image_type={"local"}
                                        resize_mode={"cover"}
                                        align_self={'flex-start'}
                                        margin_top={10}
                                        margin_left={10}
                                    />
                                    <Text
                                        style={{
                                            color: 'white'
                                        }}
                                    >Closed</Text>
                                </View>
                                : ''}


                            <View >

                                <TouchableOpacity
                                    onPress={fav_unfav_click.bind(this, item, index)}
                                >
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

                        </View>

                        <View style={{ marginHorizontal: 5, marginTop: 5 }}>

                            <Textview
                                text={item.venue_title}
                                font_family={"medium"}
                                color={Design.white}
                                font_size={Design.font_15}
                                margin_horizontal={5}
                                text_click={click_hot.bind(this, item)}
                            />

                            <Textview
                                text={(item.suburb ?? '') + ' - ' + (item.important_notice.length < 40
                                    ? item.important_notice
                                    : item.important_notice.substring(0, 39) + '...')}

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

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            position: 'absolute',
                            bottom: 10,
                            right: 10
                        }}>

                            {<View>

                                {
                                    item.boosted ?

                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            marginLeft: 6,
                                        }}>
                                            <Imageview
                                                url={GlobalImages.star}
                                                width={13}
                                                height={13}
                                                image_type={"local"}
                                                resize_mode={"contain"}
                                                margin_top={Platform.OS == "ios" ? 14 : 12}
                                                margin_left={5}

                                            />

                                            <Textview
                                                text={'Boosted'}
                                                font_family={"regular"}
                                                color={Design.white}
                                                font_size={Design.font_11}
                                                margin_horizontal={5}
                                                margin_top={Platform.OS == "ios" ? 14 : 12}
                                            />

                                        </View>

                                        : item.total_checkins > 0 ?

                                            <View style={{
                                                flexDirection: 'row', alignItems: 'center',
                                                marginLeft: 6
                                            }}>
                                                <Imageview
                                                    url={GlobalImages.hot}
                                                    width={13}
                                                    height={13}
                                                    image_type={"local"}
                                                    resize_mode={"contain"}
                                                    margin_top={Platform.OS == "ios" ? 14 : 12}
                                                    margin_left={5}

                                                />
                                                <Textview
                                                    text={'Hot'}
                                                    font_family={"regular"}
                                                    color={Design.white}
                                                    font_size={Design.font_11}
                                                    margin_horizontal={5}
                                                    margin_top={Platform.OS == "ios" ? 14 : 12}
                                                />
                                            </View>

                                            :

                                            null

                                }

                            </View>}

                        </View>
                    </View>

                </ImageBackground>
            </TouchableOpacity>

        ), [list]);

    const keyExtractor_hotellist = (item) => item.id;

    const keyExtractor_category = (item) => item.img;

    function scan_QR() {
        props.navigation.navigate("QR_Code", { "venue_id": "", "points": "", "type": "otherpage" })
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
                        text={'Categories'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}

                    />
                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>
            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 13 : 10, marginHorizontal: Platform.OS == "ios" ? 15 : 15, justifyContent: 'space-between', alignItems: 'center' }}>

                <View style={{ flexDirection: 'row', width: Platform.OS == "ios" ? Dimensions.get("window").width * 70 / 100 : Dimensions.get("window").width * 73 / 100, height: Platform.OS == "ios" ? 50 : 40, backgroundColor: Design.edit_text, borderRadius: 25, alignItems: 'center', paddingHorizontal: 15 }}>
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
                        placeholder="Search here"
                        placeholderTextColor={Design.grey}
                        value={search}
                        onChangeText={(value) => onInput(value)}
                    />

                </View>

                <View style={CSS.home_mapicon}>
                    <TouchableOpacity onPress={scan_QR}>
                        <Imageview
                            url={GlobalImages.scanner}
                            width={Platform.OS == "ios" ? 40 : 35}
                            height={Platform.OS == "ios" ? 40 : 35}
                            image_type={"local"}
                            resize_mode={"cover"}
                            align_self={'flex-start'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={Nearby_Venues}>
                        <Imageview
                            width={Platform.OS == "ios" ? 40 : 35}
                            height={Platform.OS == "ios" ? 40 : 35}
                            image_type={"local"}
                            align_self={'flex-start'}
                            url={GlobalImages.location}
                        />
                    </TouchableOpacity>
                </View>

            </View>

            <View style={{ alignItems: 'center' }}>

                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={props.category_list}
                    style={{ flexGrow: 0, height: 130, marginHorizontal: Platform.OS == "ios" ? 7 : 7 }}
                    renderItem={renderItem_category}
                    keyExtractor={keyExtractor_category}
                />

            </View>


            <View style={{ flex: 1, }}>
                {
                    data_found == "true"
                        ?
                        <FlatList
                            horizontal={false}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={list}
                            style={{ marginHorizontal: '2%', marginTop: Platform.OS == "ios" ? 2 : 0, paddingBottom: Platform.OS == "ios" ? 100 : 65 }}
                            contentContainerStyle={{ paddingBottom: 10 }}
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

        </View>
    )
}

const mapStateToProps = state => ({
    info: state.info.info,
    category_list: state.category_list.category_list,
    location: state.global.location,
    current_location: state.global.current_location,
    selected_category: state.selected_category
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);