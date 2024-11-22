import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, Linking } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import Information from "../child_class/Information";
import Offers from "../child_class/Offers";


import AppIntroSlider from 'react-native-app-intro-slider';
import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";

import { connect, useSelector } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import Nodata from "../child_class/no_data";

var venue_id = "";

function SingleDetail(props) {

    const { navigation } = props
    venue_id = navigation.getParam("venue_id", "")
    console.log(venue_id)
    const [img_count, set_img_count] = useState(5)
    const [position, set_position] = useState(0)
    const [choose, setchoose] = useState('Information')
    const [viewMore, setviewMore] = useState('false')
    const [seeAll, setseeAll] = useState('false')
    const [categoryList, setcategoryList] = useState([
        {
            title: 'WiFi',
            img: GlobalImages.wifi
        },
        {
            title: 'Food',
            img: GlobalImages.food
        },
        {
            title: 'Bar',
            img: GlobalImages.bar
        },
        {
            title: 'Pool',
            img: GlobalImages.pool
        },
        {
            title: 'Gaming',
            img: GlobalImages.gaming
        }
    ])

    const [mapList, setmapList] = useState([

        {
            title: 'Hybrid Park',
            distance: '2 km/ 1.2 min'

        },
        {
            title: 'Wok N Tok Restaurant',
            distance: '2 km/ 1.2 min'
        },

    ])

    const [mapList_old, setmap_old_List] = useState([

        {
            title: 'Hybrid Park',
            distance: '2 km/ 1.2 min'

        },
        {
            title: 'Wok N Tok Restaurant',
            distance: '2 km/ 1.2 min'
        },
        {
            title: 'Shopping Mall',
            distance: '2.4 km/ 1.2 min'
        },
        {
            title: 'Movie Theater',
            distance: '8.9 km/ 1.2 min'
        },
        {
            title: 'Hybrid Park',
            distance: '2 km/ 1.2 min'

        },
        {
            title: 'Wok N Tok Restaurant',
            distance: '2 km/ 1.2 min'
        },

    ])

    const { info, category_list, venue_list } = props;
    const [loader, setLoader] = useState(false)
    const [title, set_title] = useState("")
    const [favourite, set_favourite] = useState("")
    const [price, set_price] = useState("")
    const [address, set_address] = useState("")
    const [rating, set_rating] = useState("")
    const [images, set_images] = useState([])
    const [desc, set_desc] = useState("")
    const [points, set_points] = useState("")
    const [venue_points, set_venue_points] = useState("")
    const [important_notice, set_important_notice] = useState("")
    const [nearby, set_nearby] = useState([])
    const [nearby_two, set_nearby_two] = useState([])
    const [amenties, set_amenties] = useState([])
    const [cat_id, set_cat_id] = useState("")
    const [offer, set_offer] = useState([])
    const [Latitude, setLatitude] = useState('0.0')
    const [Longitude, setLongitude] = useState('0.0')
    const [data_found, set_data_found] = useState("")
    const [checkin_enable, set_checkin_enable] = useState("false")
    const [checkuser, set_checkuser] = useState("false")
    const [Button_Text, setButton_Text] = useState('Check In');

    const [appPoints, setappPoints] = useState("")
    const [venuePoints, setvenuePoints] = useState("")
    const [mon, setMon] = useState({ start_time: '', end_time: '', status: '' })
    const [tuse, setTuse] = useState({ start_time: '', end_time: '', status: '' })
    const [wed, setWed] = useState({ start_time: '', end_time: '', status: '' })
    const [thus, setThus] = useState({ start_time: '', end_time: '', status: '' })
    const [fri, setFri] = useState({ start_time: '', end_time: '', status: '' })
    const [sat, setSat] = useState({ start_time: '', end_time: '', status: '' })
    const [sun, setSun] = useState({ start_time: '', end_time: '', status: '' })

    const current_location = useSelector(state => state.global.current_location);

    useEffect(() => {
        let data_fetched = false;

        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {
                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            } else {
                DATA_API()
                getHours()
                data_fetched = true;
            }
        });

        /* if (!data_fetched) {
            DATA_API()
            getHours()
        } */

        console.log(images);
    }, []);

    async function DATA_API() {

        setLoader(true)

        var data = new FormData();
        data.append("venue_id", venue_id);
        data.append("user_id", info.user_id);
        data.append("lat", current_location.latitude);
        data.append("long", current_location.longitude);

        console.log(data)
        console.log(Server.single_venue_detail)

        ApiCall.postRequest(Server.single_venue_detail, data, (response, error) => {
            setLoader(false)

            if (response != undefined && response.status == "success") {

                console.log('single venue details: ', response, response.venuedetail.image)

                set_title(response.venuedetail.venue_title)
                set_favourite(response.venuedetail.favourite)
                set_price(response.venuedetail.price)
                set_address(response.venuedetail.location)
                set_rating(response.venuedetail.rating)
                set_images(response.venuedetail.image)
                set_desc(response.venuedetail.description)
                set_points(response.venuedetail.avail_app_points)
                set_venue_points(response.venuedetail.avail_venue_points)
                set_important_notice(response.venuedetail.important_notice)
                set_nearby(response.nearby)
                set_amenties(response.venuedetail.amenties)
                set_offer(response.offerdata)
                set_cat_id(response.venuedetail.cat_id)
                set_checkuser(response.venuedetail.checkuser)
                set_checkin_enable(response.venuedetail.km_stat)
                setButton_Text(response.venuedetail.button_text)
                setappPoints(response.venuedetail.app_points)
                setvenuePoints(response.venuedetail.venue_points)
                setLatitude(response.venuedetail.lat)
                setLongitude(response.venuedetail.lon)

                let arr = []

                if (response.nearby.length >= 2) {


                    for (let a = 0; a < 2; a++) {

                        //console.log("inder")
                        arr.push(response.nearby[a])
                    }
                    set_nearby_two(arr)
                }
                else {
                    //console.log("inder_else")
                    set_nearby_two(response.nearby)
                }

                set_data_found("true")
            }
            else {
                set_data_found("false")
            }

        });

    }

    async function getHours() {

        setLoader(true);

        var data = new FormData();
        data.append('venue_id', venue_id);

        ApiCall.postRequest(Server.get_hours_by_venue, data, (response, error) => {

            setLoader(false)
            console.log('hours api response', { response })

            if (response != undefined && response.status == 'success' && response.hours != undefined) {

                console.log('set horus....')
                const hoursData = response.hours;

                setHoursState(hoursData);

                console.log('all hours set now')
            } else {
                //  Toast.show(response.message);
            }
        });

    }

    function setHoursState(hours = {}) {

        if (hours.hasOwnProperty('Monday')) {
            setMon({
                start_time: hours.Monday.start_time,
                end_time: hours.Monday.end_time,
                status: hours.Monday.status
            })
        } 
        if (hours.hasOwnProperty('Tuesday')) {
            setTuse({
                start_time: hours.Tuesday.start_time,
                end_time: hours.Tuesday.end_time,
                status: hours.Tuesday.status,

            })
        } 
        if (hours.hasOwnProperty('Wednesday')) {
            setWed({
                start_time: hours.Wednesday.start_time,
                end_time: hours.Wednesday.end_time,
                status: hours.Wednesday.status,

            })
        } 
        if (hours.hasOwnProperty('Thursday')) {

            setThus({
                start_time: hours.Thursday.start_time,
                end_time: hours.Thursday.end_time,
                status: hours.Thursday.status,

            })
        } 
        if (hours.hasOwnProperty('Friday')) {
            setFri({
                start_time: hours.Friday.start_time,
                end_time: hours.Friday.end_time,
                status: hours.Friday.status,

            })
        } 
        if (hours.hasOwnProperty('Saturday')) {
            setSat({
                start_time: hours.Saturday.start_time,
                end_time: hours.Saturday.end_time,
                status: hours.Saturday.status,

            })
        } 
        if (hours.hasOwnProperty('Sunday')) {
            setSun({
                start_time: hours.Sunday.start_time,
                end_time: hours.Sunday.end_time,
                status: hours.Sunday.status,
            })
        }

    }

    function click_handle() {

        if (!checkin_enable) {
            Snackbar.show({
                text: "You are so far away from venue location",
                duration: Snackbar.LENGTH_LONG,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: 'red'
            });
        }

        else {

            if (!checkuser) {

                props.navigation.navigate("QR_Code", {
                    "venue_id": venue_id,
                    "points": points,
                    'appPoints': appPoints,
                    'venuePoints': venuePoints,
                    "type": "singleDetailPage"
                })

            } else {
                Snackbar.show({
                    text: "You are already checked-In. Wait for 24 hours",
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: 'red'
                });
            }
        }

    }

    const renderItem_maplist = useCallback(

        ({ item, index }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Platform.OS == "ios" ? 10 : 5, alignItems: 'center' }}>
                <Textview
                    text={item.title}
                    font_family={"regular"}
                    color={'#616161'}
                    lines={1}
                    font_size={Design.font_15}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Textview
                        text={item.distance}
                        font_family={"regular"}
                        color={'#103E5B'}
                        lines={1}
                        font_size={Design.font_12}
                    />
                    <Imageview
                        url={GlobalImages.directionArrow}
                        width={Platform.OS == "ios" ? 20 : 15}
                        height={Platform.OS == "ios" ? 20 : 15}
                        image_type={"local"}
                        resize_mode={"cover"}
                        margin_left={10}

                    />
                </View>
            </View>



        ), [mapList]);

    const renderItem_banner = useCallback(
        ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    alignItems: 'center', marginTop: Platform.OS == "ios" ? 30 : 20,
                    borderRadius: 10, overflow: 'hidden', marginRight: 5
                }}>

                <Imageview
                    url={item}
                    width={Dimensions.get("window").width * 92 / 100}
                    height={Platform.OS == "ios" ? 380 : 320}
                    image_type={"server"}
                    resize_mode={"cover"}

                />
                {/* <Image style={{resizeMode:'center'}}></Image> */}
            </TouchableOpacity>


        ), [images]);

    const renderItem_image = useCallback(
        ({ item, index }) => (

            <TouchableOpacity style={{ marginTop: Platform.OS == "ios" ? 10 : 8, borderRadius: 10, overflow: 'hidden', marginRight: 5, borderColor: Design.white, borderWidth: Platform.OS == "ios" ? 1.5 : 1 }}>

                <Imageview
                    url={item}
                    width={Dimensions.get("window").width * 13 / 100}
                    height={Platform.OS == "ios" ? 55 : 47}
                    image_type={"server"}
                    resize_mode={"cover"}

                />

                {
                    imageList.length > 2 && index == 2
                        ?
                        <View style={{ position: 'absolute', top: 11, left: 15 }}>
                            <Textview
                                text={img_count + "+"}
                                font_family={"medium"}
                                color={Design.white}
                                lines={1}
                                text_align={'center'}
                                font_size={Design.font_20}
                            />
                        </View>
                        :
                        null
                }


                {/* <Image style={{resizeMode:'center'}}></Image> */}
            </TouchableOpacity>


        ), [images]);

    const renderItem_dots = useCallback(
        ({ item, index }) => (

            <View>
                {
                    position == index ?
                        <View style={{ width: Platform.OS == "ios" ? 8 : 5, height: Platform.OS == "ios" ? 40 : 30, backgroundColor: Design.white, borderRadius: 10, marginVertical: 5 }}>

                        </View>
                        :
                        <View style={{ width: Platform.OS == "ios" ? 8 : 6, height: Platform.OS == "ios" ? 8 : 6, backgroundColor: Design.grey, borderRadius: 10, marginVertical: 5 }}>

                        </View>
                }

            </View>

        ), [position]);

    const handleScroll = (event) => {
        let yOffset = event.nativeEvent.contentOffset.x
        let contentHeight = event.nativeEvent.layoutMeasurement.width
        let value = yOffset / contentHeight.toFixed(0)

        console.log(value.toFixed(0))
        set_position(value.toFixed(0))
        // console.log(event.nativeEvent.layoutMeasurement.width)


    }

    const renderItem_category = useCallback(
        ({ item, index }) => (
            <TouchableOpacity
                // onPress={category_click.bind(this,item,index)}
                style={{ alignItems: 'center', width: Platform.OS == "ios" ? 90 : 75 }}>
                <Imageview
                    url={item.img}
                    width={Platform.OS == "ios" ? 67 : 58}
                    height={Platform.OS == "ios" ? 67 : 58}
                    image_type={"local"}
                    resize_mode={"contain"}

                />
                <Textview
                    text={item.title}
                    font_family={"regular"}
                    color={'#2b4ce0'}
                    margin_top={5}
                    lines={1}
                    text_align={'center'}
                    font_size={Design.font_12}
                />
            </TouchableOpacity>


        ), [categoryList]);

    const keyExtractor_banner = (item) => item;

    const keyExtractor_dots = (item) => item;
    const keyExtractor_image = (item) => item;
    const keyExtractor_maplist = (item) => item.title;

    function click_back() {
        props.navigation.goBack()
    }

    function viewMoreClick() {
        if (viewMore == 'false') {
            setviewMore('true')
        }
        else {
            setviewMore('false')
        }
    }

    function seeAllFun() {
        if (seeAll == 'false') {
            setseeAll('true')
        }
        else {
            setseeAll('false')
        }
    }

    function click_fun(type) {
        if (type == 'Information') {
            setchoose('Information')
        }
        else if (type == 'Offers') {
            setchoose('Offers')
        }
    }

    function fav_unfav_click() {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_id", venue_id);
        data.append("cat_id", cat_id);

        console.log(data)
        console.log(Server.mark_favourite_venue)
        ApiCall.postRequest(Server.mark_favourite_venue, data, (response, error) => {
            setLoader(false)
            console.log("RESPONSE")
            //console.log(response)
            console.log(error)
            if (response != undefined && (response.status == "success")) {
                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: favourite == 0 ? "green" : 'red'
                });

                if (favourite == 0) {
                    set_favourite(1)
                }
                else {
                    set_favourite(0)
                }
            }

        });

    }

    function locationBtn(lat, lng, label) {

        const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        const query = Platform.OS === 'ios'
            ? `daddr=${lat},${lng}&dirflg=d`
            : `?q=${lat},${lng}(${label})&mode=d`;

        const url = scheme + (Platform.OS === 'ios' ? '?' : '') + query;
        Linking.openURL(url);
    }

    const clickHandle = () => {
        console.log("hello")
        setchoose('Offers')
        // click_fun.bind(this, "Offers")
    }

    return (
        <View style={{ backgroundColor: Design.white, flex: 1 }}>
            {
                data_found == "true"
                    ?
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: Platform.OS == "ios" ? 20 : -5, marginHorizontal: 15, position: 'relative' }}>

                            {/** Start header */}
                            <View style={{
                                width: '100%',
                                position: 'absolute',
                                //backgroundColor: 'rgba(255,255,255,0.1)',
                                zIndex: 999,
                                top: 12,
                                right: 0,
                                left: 0,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: Platform.OS == "ios" ? 5 : 10,
                                    paddingTop: Platform.OS == "ios" ? 15 : 10,
                                    paddingBottom: Platform.OS == "ios" ? 10 : 10,
                                }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={click_back}>
                                        <Imageview
                                            width={Platform.OS == "ios" ? 37 : 30}
                                            height={Platform.OS == "ios" ? 37 : 30}
                                            image_type={"local"}
                                            url={GlobalImages.blackBack}
                                        //tint_color={Design.primary_color_orange}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={fav_unfav_click}>

                                        <Imageview
                                            width={Platform.OS == "ios" ? 45 : 36}
                                            height={Platform.OS == "ios" ? 45 : 36}
                                            image_type={"local"}
                                            url={favourite == 0 ? require("../assets/black_fav.png") : require("../assets/favv.png")}
                                        />

                                    </TouchableOpacity>
                                </View>

                            </View>
                            {/** End header */}

                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={images}
                                style={{ flexGrow: 0 }}
                                renderItem={renderItem_banner}
                                keyExtractor={keyExtractor_banner}

                                snapToAlignment={'start'}
                                viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
                                pagingEnabled={true}
                                decelerationRate={'normal'}
                                disableIntervalMomentum

                                onScroll={(event) => handleScroll(event)}

                            />

                            {
                                images.length > 1 ?
                                    <>
                                        <View style={{ position: 'absolute', top: 150, right: 15 }}>
                                            <FlatList
                                                horizontal={false}
                                                showsHorizontalScrollIndicator={false}
                                                data={images}
                                                style={{ flexGrow: 0 }}
                                                renderItem={renderItem_dots}
                                                keyExtractor={keyExtractor_dots}

                                            />
                                        </View>
                                        <View style={{ position: 'absolute', top: Platform.OS == "ios" ? 120 : 95, right: Platform.OS == "ios" ? 30 : 25 }}>
                                            <FlatList
                                                horizontal={false}
                                                showsHorizontalScrollIndicator={false}
                                                data={images}
                                                style={{ flexGrow: 0 }}
                                                renderItem={renderItem_image}
                                                keyExtractor={keyExtractor_image}

                                            />
                                        </View>
                                    </>

                                    :

                                    null
                            }



                            {/* <View style={{ backgroundColor: Design.primary_color_orange, width: Platform.OS == "ios" ? 90 : 80, height: Platform.OS == "ios" ? 90 : 80, borderRadius: 10, position: 'absolute', bottom: -38, right: 20, alignItems: 'center' }}>
                                <View style={{ alignItems: 'center', marginTop: Platform.OS == "ios" ? 18 : 13 }}>
                                    <Textview
                                        text={'$ ' + price}
                                        font_size={Design.font_20}
                                        color={Design.white}
                                        font_family={'medium'}
                                        align_self={'center'}

                                    />
                                    <Textview
                                        text={'per night'}
                                        font_size={Design.font_12}
                                        color={Design.white}
                                        font_family={'medium'}
                                        align_self={'center'}

                                    />
                                </View>

                            </View> */}

                        </View>

                        <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 15 : 10, marginBottom: 100 }}>

                            <Textview
                                text={title}
                                font_size={Design.font_25}
                                color={Design.black}
                                font_family={'medium'}
                                margin_left={15}
                            />
                            <TouchableOpacity
                                onPress={() => locationBtn(Latitude, Longitude, address)}

                            >
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginHorizontal: Platform.OS == "ios" ? 0 : 0,
                                    width: "90%"
                                }}>
                                    <Imageview
                                        width={Platform.OS == "ios" ? 15 : 15}
                                        height={Platform.OS == "ios" ? 15 : 15}
                                        image_type={"local"}
                                        url={GlobalImages.location}
                                        margin_left={15}
                                        //resize_mode={'contain'}
                                        tint_color={Design.black}
                                    />

                                    <Textview
                                        text_click={() => locationBtn(Latitude, Longitude, address)}
                                        text={address}
                                        font_size={Design.font_13}
                                        color={Design.black}
                                        font_family={'medium'}
                                        margin_left={5}
                                        lines={1}
                                    />

                                </View>
                            </TouchableOpacity>


                            <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 15 : 5, marginHorizontal: 15 }}>

                                <Textview
                                    text={'Important Notice'}
                                    font_size={Design.font_15}
                                    color={Design.black}
                                    font_family={'medium'}
                                //margin_top={Platform.OS == "ios" ? 10 : 3}
                                // margin_left={Platform.OS == "ios" ? 10 : 7}
                                />

                                <Textview
                                    text={important_notice}
                                    font_size={Design.font_13}
                                    color={Design.light_grey}
                                    font_family={'regular'}
                                    lines={viewMore == 'false' ? 4 : null}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}
                                // margin_left={Platform.OS == "ios" ? 10 : 7}
                                />

                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', marginTop: Platform.OS == "ios" ? 15 : 8, marginHorizontal: 15 }}>

                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', width: "65%" }}>
                                    <Imageview
                                        width={Platform.OS == "ios" ? 23 : 18}
                                        height={Platform.OS == "ios" ? 23 : 18}
                                        image_type={"local"}
                                        url={GlobalImages.location}
                                    /> 

                                    <Textview
                                        text={'Important Notice: '}
                                        font_size={Design.font_13}
                                        color={Design.black}
                                        font_family={'regular'}
                                        align_self={'center'}
                                        margin_left={Platform.OS == "ios" ? 10 : 7}
                                    />

                                    <Textview
                                        text={important_notice}
                                        font_size={Design.font_13}
                                        color={Design.light_grey}
                                        font_family={'regular'}
                                        lines={viewMore == 'false' ? 4 : null}
                                        margin_left={Platform.OS == "ios" ? 10 : 7}

                                    />


                                </View> 
                                 <View style={{ flexDirection: 'row', alignItems: 'center', width: "35%" }}>
                                    <Imageview
                                        width={Platform.OS == "ios" ? 23 : 18}
                                        height={Platform.OS == "ios" ? 23 : 18}
                                        image_type={"local"}
                                        url={GlobalImages.singleStar}
                                    />
                                    <Textview
                                        text={rating + ' Ratings'}
                                        font_size={Design.font_13}
                                        color={Design.light_grey}
                                        font_family={'regular'}
                                        align_self={'center'}
                                        margin_left={Platform.OS == "ios" ? 10 : 7}

                                    />
                                </View> */}

                                <View>

                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', flex: 1, marginTop: 20, borderRadius: 10, overflow: 'hidden', marginHorizontal: 15 }}>

                                <TouchableOpacity
                                    onPress={click_fun.bind(this, "Information")}
                                    style={{ flex: 1 }}>
                                    <Textview
                                        text={'Information'}
                                        font_size={Design.font_15}
                                        padding_vertical={Platform.OS == "ios" ? 15 : 10}
                                        padding_horizontal={10}
                                        color={choose == 'Information' ? Design.white : Design.light_grey}
                                        text_align={'center'}
                                        bg_color={choose == 'Information' ? Design.primary_color_orange : Design.grey_tab}
                                        font_family={'medium'}
                                        text_click={click_fun.bind(this, "Information")}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={click_fun.bind(this, "Offers")}
                                    style={{ flex: 1 }}>
                                    <Textview
                                        text={'Offers'}
                                        font_size={Design.font_15}
                                        color={choose == 'Offers' ? Design.white : Design.light_grey}
                                        font_family={'medium'}
                                        text_align={'center'}
                                        padding_horizontal={10}
                                        padding_vertical={Platform.OS == "ios" ? 15 : 10}
                                        bg_color={choose == 'Offers' ? Design.primary_color_orange : Design.grey_tab}
                                        text_click={click_fun.bind(this, "Offers")}
                                    />
                                </TouchableOpacity>
                            </View>


                            {
                                choose == "Information"

                                    ?

                                    <Information navigation={props.navigation}
                                        desc={desc}
                                        points={points}
                                        venue_points={venue_points}
                                        price={price}
                                        button_text={Button_Text}
                                        important_notice={important_notice}
                                        nearby={nearby}
                                        nearby_two={nearby_two}
                                        amenties={amenties}
                                        title={title}
                                        venue_id={venue_id}
                                        checkin_enable={checkin_enable}
                                        checkuser={checkuser}
                                        appPoints={appPoints}
                                        venuePoints={venuePoints}
                                        lat={Latitude}
                                        long={Longitude}
                                        address={address}
                                        mon={mon}
                                        tuse={tuse}
                                        wed={wed}
                                        thus={thus}
                                        fri={fri}
                                        sat={sat}
                                        sun={sun}
                                        redeem_now_click={() => clickHandle()
                                        }
                                    />

                                    :

                                    <Offers navigation={props.navigation}
                                        offer={offer}
                                        user_id={info.user_id}
                                        venue_id={venue_id}
                                        title={title}
                                    />
                            }

                        </View>

                    </ScrollView>

                    :
                    data_found == "false"
                        ?
                        <Nodata />
                        :
                        null
            }

            {
                data_found == 'true' ?

                    choose == "Information" ?

                        <View style={{ flex: 1, position: 'absolute', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', bottom: 0, width: '100%', borderRadius: 10, radius: 10 }}>
                            <Textview
                                text={Button_Text}
                                font_size={Design.font_18}
                                color={Design.white}
                                font_family={'medium'}
                                text_align={'center'}
                                bg_color={Design.primary_color_orange}
                                padding_vertical={Platform.OS == "ios" ? 20 : 17}
                                radius={10}
                                text_click={click_handle}

                            />

                        </View>

                        :
                        null

                    :

                    null
            }

            <Loader loader={loader} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SingleDetail);