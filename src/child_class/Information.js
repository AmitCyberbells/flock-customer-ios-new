import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, Touchable, Linking } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import MapView, { Marker, Callout } from "react-native-maps";
import Global from "../global/Global";
import Snackbar from "react-native-snackbar";
import { useSelector } from "react-redux";

export default function SingleDetail(props) {

    const { redeem_now_click } = props

    const [seeAll, setseeAll] = useState('false')
    const [seeAlldays, setseeAlldays] = useState('false')

    const location = useSelector(state => state.global.location);
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

    const renderItem_maplist = useCallback(
        ({ item, index }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Platform.OS == "ios" ? 10 : 5, alignItems: 'center' }}>
                <Textview
                    text={item.venue_title}
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
        ), [props.nearby]);


    const renderItem_category = useCallback(
        ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    alignItems: 'center',
                    width: 80,
                    borderWidth: 1,
                    borderColor: "#dfe4fb",
                    borderRadius: 10,
                    overflow: 'hidden',
                    padding: 10,
                    marginRight: 15,
                    backgroundColor: "#dfe4fb"
                }}>
                <Imageview
                    url={item.image}
                    width={50}
                    height={50}
                    image_type={"server"}
                    resize_mode={"contain"}
                    tint_color={"#3251e4"}

                />
                <Textview
                    text={item.name}
                    font_family={"regular"}
                    color={"#3251e4"}
                    margin_top={5}
                    lines={1}
                    text_align={'center'}
                    font_size={Design.font_12}
                />
            </TouchableOpacity>

        ), [props.amenties]);

    const keyExtractor_banner = (item) => item.img;

    const keyExtractor_maplist = (item) => item.title;

    useEffect(() => {

        console.log({props});


    }, []);

   

    function seeAllFun() {
        if (seeAll == 'false') {
            setseeAll('true')
        }
        else {
            setseeAll('false')
        }
    }

    function showAlldays() {
        if (seeAlldays == 'false') {
            setseeAlldays('true')
        }
        else {
            setseeAlldays('false')
        }
    }

    function locationBtn(lat, lng, label) {

        const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        const query = Platform.OS === 'ios'
            ? `daddr=${lat},${lng}&dirflg=d`
            : `?q=${lat},${lng}(${label})&mode=d`;

        const url = scheme + (Platform.OS === 'ios' ? '?' : '') + query;
        Linking.openURL(url);
    }

    function click_handle() {

        if (props.checkin_enable == "false") {
            Snackbar.show({
                text: "You are so far away from venue location",
                duration: Snackbar.LENGTH_LONG,
                fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                backgroundColor: 'red'
            });
        }

        else {
            if (props.checkuser == "false") {
                props.navigation.navigate("QR_Code", { "venue_id": props.venue_id, "points": props.points, 'appPoints': props.appPoints, 'venuePoints': props.venuePoints, "type": "singleDetailPage" })

            }

            else {
                Snackbar.show({
                    text: "You are already checkin in this venue",
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: 'red'
                });
            }
        }

    }

    const formatTime = (timeString) => {
        // Assuming timeString is in the format "HH:mm:ss"
        const [hours, minutes] = timeString.split(':');
        return `${pad(hours)}:${minutes}`;
        
        // Create a Date object with arbitrary date and provided hours and minutes
        const date = new Date(2000, 1, 1, hours, minutes);

        // Format the time to "hh:mm AM/PM"
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return formattedTime;
    };

    const pad = (num) => {
        num = Number(num);
        return num >= 10 ? num : `0${num}`;
    }

    return (

        <View style={{ 
            marginHorizontal: 15
        }}>

            <Textview
                text={'Description'}
                font_size={Design.font_15}
                color={Design.black}
                font_family={'medium'}
                margin_top={Platform.OS == "ios" ? 24 : 15}

            />

            <Textview
                text={props.desc}
                font_size={Design.font_13}
                color={Design.light_grey}
                font_family={'regular'}
                margin_top={Platform.OS == "ios" ? 10 : 3}

            />
            <View>
                <Textview
                    text={'Opening Hours'}
                    font_size={Design.font_15}
                    color={Design.black}
                    font_family={'medium'}
                    margin_top={Platform.OS == "ios" ? 24 : 15}

                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                    <Textview
                        text={'Mon'}
                        font_size={Design.font_14}
                        color={Design.black}
                        font_family={'regular'}
                        margin_top={Platform.OS == "ios" ? 10 : 3}

                    />
                    {props.mon.status == 1 ?
                        <Textview
                            text={formatTime(props.mon.start_time) + ' - ' + formatTime(props.mon.end_time)}
                            font_size={Design.font_14}
                            color={Design.black}
                            font_family={'regular'}
                            margin_top={Platform.OS == "ios" ? 10 : 3}

                        />
                        :
                        <Textview
                            text={'Closed'}
                            font_size={Design.font_14}
                            color={Design.red}
                            font_family={'regular'}
                            margin_top={Platform.OS == "ios" ? 10 : 3}

                        />
                    }

                </View>
                {seeAlldays == 'true' ?
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Textview
                                text={'Tue'}
                                font_size={Design.font_14}
                                color={Design.black}
                                font_family={'regular'}
                                margin_top={Platform.OS == "ios" ? 10 : 3}

                            />
                            {props.tuse.status == 1 ?
                                <Textview
                                    text={formatTime(props.tuse.start_time) + ' - ' + formatTime(props.tuse.end_time)}
                                    font_size={Design.font_14}
                                    color={Design.black}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                                :
                                <Textview
                                    text={'Closed'}
                                    font_size={Design.font_14}
                                    color={Design.red}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                            }

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Textview
                                text={'Wed'}
                                font_size={Design.font_14}
                                color={Design.black}
                                font_family={'regular'}
                                margin_top={Platform.OS == "ios" ? 10 : 3}

                            />
                            {props.wed.status == 1 ?
                                <Textview
                                    text={formatTime(props.wed.start_time) + ' - ' + formatTime(props.wed.end_time)}
                                    font_size={Design.font_14}
                                    color={Design.black}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                                :
                                <Textview
                                    text={'Closed'}
                                    font_size={Design.font_14}
                                    color={Design.red}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                            }

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Textview
                                text={'Thu'}
                                font_size={Design.font_14}
                                color={Design.black}
                                font_family={'regular'}
                                margin_top={Platform.OS == "ios" ? 10 : 3}

                            />
                            {props.thus.status == 1 ?
                                <Textview
                                    text={formatTime(props.thus.start_time) + ' - ' + formatTime(props.thus.end_time)}
                                    font_size={Design.font_14}
                                    color={Design.black}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                                :
                                <Textview
                                    text={'Closed'}
                                    font_size={Design.font_14}
                                    color={Design.red}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                            }

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Textview
                                text={'Fri'}
                                font_size={Design.font_14}
                                color={Design.black}
                                font_family={'regular'}
                                margin_top={Platform.OS == "ios" ? 10 : 3}

                            />
                            {props.fri.status == 1 ?
                                <Textview
                                    text={formatTime(props.fri.start_time) + ' - ' + formatTime(props.fri.end_time)}
                                    font_size={Design.font_14}
                                    color={Design.black}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                                :
                                <Textview
                                    text={'Closed'}
                                    font_size={Design.font_14}
                                    color={Design.red}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                            }

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Textview
                                text={'Sat'}
                                font_size={Design.font_14}
                                color={Design.black}
                                font_family={'regular'}
                                margin_top={Platform.OS == "ios" ? 10 : 3}

                            />
                            {props.sat.status == 1 ?
                                <Textview
                                    text={formatTime(props.sat.start_time) + ' - ' + formatTime(props.sat.end_time)}
                                    font_size={Design.font_14}
                                    color={Design.black}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                                :
                                <Textview
                                    text={'Closed'}
                                    font_size={Design.font_14}
                                    color={Design.red}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                            }

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Textview
                                text={'Sun'}
                                font_size={Design.font_14}
                                color={Design.black}
                                font_family={'regular'}
                                margin_top={Platform.OS == "ios" ? 10 : 3}

                            />
                            {props.sun.status == 1 ?
                                <Textview
                                    text={formatTime(props.sun.start_time) + ' - ' + formatTime(props.sun.end_time)}
                                    font_size={Design.font_14}
                                    color={Design.black}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                                :
                                <Textview
                                    text={'Closed'}
                                    font_size={Design.font_14}
                                    color={Design.red}
                                    font_family={'regular'}
                                    margin_top={Platform.OS == "ios" ? 10 : 3}

                                />
                            }

                        </View>
                    </>
                    : ''}

                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Textview
                        text={'See all'}
                        font_size={Design.font_15}
                        color={Design.light_blue}
                        font_family={'regular'}
                        text_click={showAlldays}

                    />
                    <TouchableOpacity onPress={showAlldays}>
                        <Imageview
                            width={Platform.OS == "ios" ? 15 : 12}
                            height={Platform.OS == "ios" ? 15 : 12}
                            image_type={"local"}
                            // url={GlobalImages.blueDropdown}
                            url={seeAlldays == 'false' ? GlobalImages.blueDropdown : GlobalImages.dropUp}
                            resize_mode={'contain'}
                            margin_left={5}
                            tint_color={Design.light_blue}

                        />
                    </TouchableOpacity>

                </View>
            </View>

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    flexDirection: 'row',
                    backgroundColor: Design.white,
                    paddingHorizontal: Platform.OS == "ios" ? 20 : 15,
                    paddingVertical: Platform.OS == "ios" ? 10 : 10,
                    marginTop: Platform.OS == "ios" ? 30 : 20,
                    alignItems: 'center',
                    justifyContent: 'space-between'

                }}

            >








                <View>

                    <Textview
                        text={'Available Points'}
                        font_size={Design.font_15}
                        color={Design.black}
                        font_family={'medium'}


                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <Textview
                            text={'Feather'}
                            font_size={Design.font_14}
                            color={Design.black}
                            font_family={'regular'}
                            margin_top={Platform.OS == "ios" ? 10 : 3}

                        />

                        <Textview
                            text={'Venue'}
                            font_size={Design.font_14}
                            color={Design.black}
                            font_family={'regular'}
                            margin_top={Platform.OS == "ios" ? 10 : 3}

                        />

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <Textview
                            text={props.points + ' fts'}
                            font_size={Design.font_14}
                            color={Design.light_grey}
                            font_family={'regular'}
                            margin_top={Platform.OS == "ios" ? 10 : 3}

                        />

                        <Textview
                            text={props.venue_points + ' pts'}
                            font_size={Design.font_14}
                            color={Design.light_grey}
                            font_family={'regular'}
                            margin_top={Platform.OS == "ios" ? 10 : 3}

                        />

                    </View>

                </View>

                <View>
                    <Textview
                        text={'Redeem Now'}
                        font_size={Design.font_13}
                        color={Design.white}
                        font_family={'regular'}
                        bg_color={Design.primary_color_orange}
                        padding_vertical={Platform.OS == "ios" ? 10 : 7}
                        padding_horizontal={7}
                        radius={5}
                        text_click={redeem_now_click}

                    />
                </View>
            </CardView>

            <Textview
                text={'Property Amenities'}
                font_size={Design.font_15}
                color={Design.black}
                font_family={'medium'}
                margin_top={Platform.OS == "ios" ? 24 : 15}

            />
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={props.amenties}
                style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15 }}
                renderItem={renderItem_category}
                keyExtractor={keyExtractor_banner}
            />

            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

                <Textview
                    text={'Nearby Spots'}
                    font_size={Design.font_15}
                    color={Design.black}
                    font_family={'medium'}
                    margin_top={Platform.OS == "ios" ? 25 : 18}
                />

                <TouchableOpacity
                    onPress={() => locationBtn(props.lat, props.long, props.address)}
                >
                    <Imageview
                        width={Platform.OS == "ios" ? 15 : 20}
                        height={Platform.OS == "ios" ? 15 : 20}
                        image_type={"local"}
                        url={GlobalImages.location}
                        //resize_mode={'contain'}
                        margin_top={Platform.OS == "ios" ? 25 : 20}
                        tint_color={Design.black}
                    />
                </TouchableOpacity>
            </View>


            <MapView
                showsUserLocation
                style={{
                    height: 225,
                    width: '100%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginTop: 15
                }}
                initialRegion={{
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                    latitudeDelta: 0.0322,
                    longitudeDelta: 0.0421
                }}

            >

                {
                    props.nearby.length == 0
                        ?
                        null
                        :
                        <View>

                            {props.nearby.map((marker, index) => {
                                return (
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(marker.lat),
                                            longitude: parseFloat(marker.long),
                                        }}
                                        title={marker.venue_title}
                                        pinColor={Design.primary_color_orange}
                                    >

                                    </Marker>
                                )
                            })}

                        </View>
                }

            </MapView>

            {
                seeAll == "false" ?
                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={props.nearby_two}
                        initialNumToRender={2}
                        style={{ marginVertical: 13 }}
                        renderItem={renderItem_maplist}
                        keyExtractor={keyExtractor_maplist}
                    />
                    :
                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={props.nearby}
                        initialNumToRender={2}
                        style={{ marginVertical: 13 }}
                        renderItem={renderItem_maplist}
                        keyExtractor={keyExtractor_maplist}
                    />
            }


            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <Textview
                    text={'See all'}
                    font_size={Design.font_15}
                    color={Design.light_blue}
                    font_family={'regular'}
                    text_click={seeAllFun}

                />
                <TouchableOpacity onPress={seeAllFun}>
                    <Imageview
                        width={Platform.OS == "ios" ? 15 : 12}
                        height={Platform.OS == "ios" ? 15 : 12}
                        image_type={"local"}
                        // url={GlobalImages.blueDropdown}
                        url={seeAll == 'false' ? GlobalImages.blueDropdown : GlobalImages.dropUp}
                        resize_mode={'contain'}
                        margin_left={5}
                        tint_color={Design.light_blue}

                    />
                </TouchableOpacity>

            </View>

        </View>
    )
}