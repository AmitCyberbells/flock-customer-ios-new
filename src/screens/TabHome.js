import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, ScrollView, Platform, ImageBackground, PermissionsAndroid } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import TextView from "../component/Textview"
import Nodata from "../child_class/no_data";
import AppIntroSlider from 'react-native-app-intro-slider';
import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import Typewriter from "../component/TypeWriter";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import CustomSideBar from "./CustomSideBar";
import SideNavigation from "./SideNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "@react-native-community/geolocation";
import { open_phone_setting } from "../component/UtilityService";

function TabHome(props) {

    const { info, category_list, venue_list, actions, location } = props;
    const [loader, setLoader] = useState(false)
    const [isSideBar, setIsSideBar] = useState(false);
    const [data_found, set_data_found] = useState("")
    const [categoryList, setcategoryList] = useState([

        {
            title: 'Night Life',
            img: GlobalImages.one,
            status: "false"
        },
        {
            title: 'Food',
            img: GlobalImages.two,
            status: "false"
        },
        {
            title: 'Clubs',
            img: GlobalImages.three,
            status: "false"
        },
        {
            title: 'Stays',
            img: GlobalImages.four,
            status: "false"
        },
        {
            title: 'Entertainment',
            img: GlobalImages.five,
            status: "false"
        }
    ])

    const deviceHeight = Dimensions.get('window').height;

    function click_venue(item) {
       console.log("click item", item)
        if (item.clickable) {
            props.navigation.navigate('SingleDetail', { "venue_id": item.venue_id })
        }

        // props.navigation.navigate('SingleDetail')
    }

    useEffect(() => {
        let home_data_fectched = false;

        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {
                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            } else {
                home_data_fectched = true;
                requestLocationPermission();
                HOME_DATA_API();
            }
        });

        if (!home_data_fectched) {
            requestLocationPermission();
            HOME_DATA_API();
        }

    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            getOneTimeLocation();
        } else {
            console.log('click_1')
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                console.log({granted});

                if (granted == "denied") {

                    //Function.snackbar("Please allow Phone and Application's location permission", Design.pink, "high")
                    setTimeout(() => {
                        open_phone_setting()
                    }, 4000);


                }
                else if (granted == "never_ask_again") {
                    //Function.snackbar("Please allow Phone and Application's location permission", Design.pink, "high")
                    setTimeout(() => {
                        open_phone_setting()
                    }, 4000);
                }
                else if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getOneTimeLocation();
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const getOneTimeLocation = () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                console.log('location from geo: ', position);
                actions.current_location({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                if (error.message == "User denied access to location services.") {
                    // Function.snackbar("Please allow Phone and Application's location permission", Design.pink, "high")
                    setTimeout(() => {
                        open_phone_setting();
                    }, 3000);
                }
                else {
                    console.log('location error: ', error.message)
                    //  Function.snackbar("" + error.message, Design.pink, "high")
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 2000
            },
        );
    };

    function category_click(item, index) {

        AsyncStorage.setItem('selectedCategoryId', item.category_id);

        props.navigation.navigate('Categories', { 'item_index': index, "cat_id": item.category_id })
    }

    const renderItem_category = useCallback(
        ({ item, index }) => (

            <TouchableOpacity
                onPress={category_click.bind(this, item, index)}
                style={{ alignItems: 'center', marginTop: Platform.OS == "ios" ? 0 : 0, width: Platform.OS == "ios" ? 90 : 75, marginBottom: Platform.OS == "ios" ? 7 : 15 }}>

                <View style={{
                    height: Platform.OS == "ios" ? 67 : 58,
                    width: Platform.OS == "ios" ? 67 : 58,
                    borderRadius: 10,
                    overflow: 'hidden',
                    alignItems: 'center',
                    backgroundColor: item.status == "true" ? "#2b4ce0" : "#dfe4fb",
                    justifyContent: 'center'
                }}>
                    <Imageview
                        url={item.category_image}
                        width={Platform.OS == "ios" ? 30 : 25}
                        height={Platform.OS == "ios" ? 30 : 25}
                        image_type={"server"}
                        resize_mode={"contain"}
                        tint_color={item.status == "true" ? Design.white : "#2b4ce0"}

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

        ), [categoryList]);


    const keyExtractor_banner = (item) => item.img;
    const keyExtractor_dots = (item) => item.img;


    function navigation_handle() {
        setIsSideBar(!isSideBar)
        // props.navigation.navigate('SideNavigation')
    }

    function click_star() {

        props.navigation.navigate('Stars')
    }

    function click_hot() {

        props.navigation.navigate('Hot')

    }

    function click_search() {
        console.log("click")
        props.navigation.navigate('Search')
    }

    const keyExtractor_value = (item) => item.id;

    const renderItem_value = useCallback(
        ({ item, index }) => (

            <View>

                <AppIntroSlider
                    renderItem={_renderItem}
                    data={item.venues}
                    showNextButton={false}
                    showDoneButton={false}
                    onSlideChange={(value) => slider_change(index, value)}
                    style={{
                        marginTop: 20
                    }}
                    showSkipButton={false}
                    // dotStyle={{ justifyContent: 'flex-end', height: 6, width: 6, backgroundColor: 'rgba(255, 255, 255, 0.9)', marginTop: 45 }}
                    // activeDotStyle={{ justifyContent: 'flex-end', height: 6, width: 20, backgroundColor: 'rgba(255, 255, 255, 0.9)', marginTop: 45 }}
                    dotStyle={{
                        backgroundColor: 'transparent'
                    }}
                    activeDotStyle={{
                        backgroundColor: 'transparent'
                    }}
                />

                {
                    dots_fun(item.position, item.venues)
                }

            </View>

        ), [venue_list]);


    const _renderItem = ({ item }) => {

        return (
            <View>
                <TouchableOpacity onPress={click_venue.bind(this, item)}>
                    <ImageBackground
                        style={CSS.home_value_image}
                        resizeMode='cover'
                        source={{ uri: item.image }}>
                        {/* <View style={CSS.overlay} /> */}

                        {/* <Textview
                        text={item.earn_feather + " PTS"}
                        font_size={Design.font_20}
                        color={Design.white}
                        font_family={'regular'}
                        margin_top={10}
                        margin_left={15}
                    />
                    <Textview
                        text={"Earn " + item.earn_feather + " points on check in"}
                        font_size={Design.font_16}
                        color={Design.white}
                        font_family={'regular'}
                        margin_top={25}
                        margin_left={15}
                        margin_right={60}
                    />
                    <Textview
                        text={item.venue_title}
                        font_size={Design.font_18}
                        color={Design.white}
                        font_family={'semi_bold'}
                        margin_top={5}
                        margin_left={15}
                    />


                    <Textview
                        text={"View Details"}
                        font_size={Design.font_16}
                        color={Design.white}
                        font_family={'regular'}
                        text_decoration_line={"underline"}
                        margin_left={15}
                        margin_top={30}
                        text_click={click_venue.bind(this, item)}
                    /> */}

                    </ImageBackground>
                </TouchableOpacity>
            </View>
        );
    }

    const dots_fun = (position, data) => {

        return (
            <View style={CSS.dot_view}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={data}
                    style={{ flexGrow: 0 }}
                    renderItem={({ item, index }) =>
                        <View>
                            {
                                position == index ?
                                    <View style={CSS.active_dot}>
                                    </View>
                                    :
                                    <View style={CSS.inactive_dot_view}>
                                    </View>
                            }
                        </View>

                    }
                    keyExtractor={keyExtractor_dots}

                />
            </View>
        )

    }

    const slider_change = (index, value) => {

        const arr = [...venue_list]
        arr[index].position = value
        let { actions } = props;
        actions.saved_vanue(arr);

    }

    function HOME_DATA_API() {

        setLoader(true);

        var data = new FormData();
        data.append("user_id", info.user_id);
        ApiCall.postRequest(Server.home, data, (response, error) => {
            console.log('home api', response)
            setLoader(false)
            if (response != undefined && response.status == "success") {
                let { actions } = props;
                actions.saved_category(response.category);
                actions.saved_vanue(response.data);
                if (response.category.length != 0 && response.data.length != 0) {
                    set_data_found("true")
                }
                else {
                    set_data_found("false")
                }
            } else {
                set_data_found("false")
            }

        });

    }

    function scan_QR() {

        props.navigation.navigate("QR_Code", { "venue_id": "", "points": "", "type": "otherpage" })

        // props.navigation.navigate('ScanningScreen')

    }

    function Nearby_Venues() {

        props.navigation.navigate("Map")

    }

    return (
        <View style={[CSS.Homecontainer, { paddingBottom: 80 }]}>
            <Loader loader={loader} />
            <View style={CSS.home_toolbar}>
                <TouchableOpacity onPress={navigation_handle.bind(this)}>
                    <Imageview
                        width={Platform.OS == "ios" ? 45 : 40}
                        height={Platform.OS == "ios" ? 45 : 40}
                        image_type={"local"}
                        url={GlobalImages.sideNav}
                    />
                </TouchableOpacity>

                <View style={CSS.home_mapicon}>
                    <TouchableOpacity onPress={Nearby_Venues}>
                        <Imageview
                            width={Platform.OS == "ios" ? 45 : 40}
                            height={Platform.OS == "ios" ? 45 : 40}
                            image_type={"local"}
                            url={GlobalImages.location}
                        />
                    </TouchableOpacity>
                    {/*<TouchableOpacity onPress={scan_QR}>
                        <Imageview
                            width={Platform.OS == "ios" ? 45 : 40}
                            height={Platform.OS == "ios" ? 45 : 40}
                            image_type={"local"}
                            url={GlobalImages.scanner}
                        />
                    </TouchableOpacity>*/}
                </View>

            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignSelf: 'center'
                    }}>
                        <Imageview
                            width={Platform.OS == "ios" ? 80 : 75}
                            height={Platform.OS == "ios" ? 80 : 75}
                            image_type={"local"}
                            url={GlobalImages.bird_logo}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                        <Textview
                            text={"Let's "}
                            font_size={Design.font_27}
                            color={Design.black}
                            font_family={'medium'}
                            //margin_top={35}
                            text_click={click_search}
                        />

                        <Typewriter text="Flock it" delay={300} infinite />

                    </View>

                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                        <TouchableOpacity onPress={scan_QR}>
                            <Imageview
                                width={Platform.OS == "ios" ? 65 : 60}
                                height={Platform.OS == "ios" ? 65 : 60}
                                image_type={"local"}
                                url={GlobalImages.scanner}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    data_found == "true"
                        ?
                        <View style={{ justifyContent: 'space-evenly', height: Platform.OS === 'ios' ? (deviceHeight-400) : 'auto' }}>

                            <Textview
                                text={"Categories "}
                                font_size={Design.font_20}
                                color={Design.dark_blue}
                                font_family={'regular'}
                                margin_top={Platform.OS == "ios" ? 30 : 10}
                            />

                            <View style={{ alignItems: 'center' }}>

                                <FlatList

                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={category_list}
                                    contentContainerStyle={{ justifyContent: 'center' }}
                                    style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15, }}
                                    renderItem={renderItem_category}
                                    keyExtractor={keyExtractor_banner}

                                />

                            </View>

                            <View
                                style={CSS.home_tab_click}>

                                <TouchableOpacity
                                    onPress={click_hot}
                                    style={CSS.hot_button}>
                                    <Imageview
                                        width={Platform.OS == "ios" ? 30 : 25}
                                        height={Platform.OS == "ios" ? 30 : 25}
                                        image_type={"local"}
                                        url={GlobalImages.hot}
                                    />
                                    <Textview
                                        text={"Hot"}
                                        font_size={Design.font_20}
                                        color={Design.primary_color_orange}
                                        font_family={'regular'}
                                        margin_left={10}
                                        text_click={click_hot}

                                    />
                                </TouchableOpacity>

                                {/* <TouchableOpacity
                                    onPress={click_star}
                                    style={CSS.hot_button}>
                                    <Imageview
                                        width={Platform.OS == "ios" ? 30 : 25}
                                        height={Platform.OS == "ios" ? 30 : 25}
                                        image_type={"local"}
                                        url={GlobalImages.star}
                                    />
                                    <Textview
                                        text={"Stars"}
                                        font_size={Design.font_20}
                                        color={Design.primary_color_orange}
                                        font_family={'regular'}
                                        margin_left={10}
                                        text_click={click_star}

                                    />
                                </TouchableOpacity> */}
                            </View>

                            {
                                (venue_list.length > 1 || venue_list[0].venues.length > 0) ?
                                    <FlatList
                                        horizontal={false}
                                        showsVerticalScrollIndicator={false}
                                        data={venue_list}
                                        style={{ flexGrow: 0 }}
                                        renderItem={renderItem_value}
                                        keyExtractor={keyExtractor_value}

                                    /> :

                                    <Textview
                                        text={"No Venue Found!"}
                                        font_size={Design.font_20}
                                        color={Design.primary_color_orange}
                                        font_family={'regular'}
                                        text_align={'center'}
                                        margin_left={10}
                                        margin_top={Platform.OS == 'ios' ? '10%' : '30%'}
                                    />
                            }

                        </View>
                        :
                        data_found == "false"
                            ?
                            <Nodata />
                            :
                            null
                }

            </ScrollView>
            {
                isSideBar
                    ?
                    <View style={{ position: 'absolute', height: '110%', width: '100%' }
                    } >
                        {/* <CustomSideBar navigation={props.navigation}
                                closeMenu={() => {
                                    setIsSideBar(!isSideBar)
                                }}
                            /> */}

                        <SideNavigation navigation={props.navigation}
                            closeMenu={() => {
                                setIsSideBar(!isSideBar)
                            }}
                        />
                    </View >
                    :
                    null
            }
        </View>


    )
}

const mapStateToProps = state => ({
    current_location: state.global.current_location,
    info: state.info.info,
    category_list: state.category_list.category_list,
    venue_list: state.venue_list.venue_list,
    selected_category: state.global.selected_category
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TabHome);