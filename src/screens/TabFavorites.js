import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
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
import Nodata from "../child_class/no_data";


function TabFavorites(props) {
    const { info, category_list } = props;

    const [colors, set_colors] = useState([Design.color_one, Design.color_two, Design.color_three, Design.color_four])
    const [loader, setLoader] = useState(false)
    const [cardposition, setcardposition] = useState(0)

    const [categoryList, setcategoryList] = useState([

        {
            title: 'Hotels',
            img: GlobalImages.favHotel
        },
        {
            title: 'Food',
            img: GlobalImages.favFood
        },
        {
            title: 'Stores',
            img: GlobalImages.favStore
        },
        {
            title: 'Night Life',
            img: GlobalImages.favNight
        },
        {
            title: 'Entertain',
            img: GlobalImages.favEnter
        }
    ])

    const [list, set_list] = useState([

        // {
        //     id: 1,
        //     category: 'Hot',
        //     title: 'Hotel Berlin',
        //     address: '1.5 km dal centro',
        //     img: GlobalImages.hotelback1
        // },
        // {
        //     id: 2,
        //     category: 'Star',
        //     title: 'Hotel Smartz',
        //     address: '1.5 km dal centro',
        //     img: GlobalImages.hotelback2
        // },
        // {
        //     id: 3,
        //     category: 'Star',
        //     title: 'Hotel Taj',
        //     address: '1.5 km dal centro',
        //     img: GlobalImages.hotelback1
        // },

    ])

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
                if (props.category_list.length == 0) {
                    Snackbar.show({
                        text: 'Data Not Found',
                        duration: Snackbar.LENGTH_SHORT,
                        fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                        backgroundColor: Design.primary_color_orange
                    });
                }
                else {
                    GET_DATA(props.category_list[0].category_id)
                }

            }
        });
    }, []);

    function GET_DATA(catID) {
        set_list([])
        setLoader(true)


        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("cat_id", catID);

        console.log(data)
        console.log(Server.venue_favourite_list)

        ApiCall.postRequest(Server.venue_favourite_list, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {

                set_list(response.favouritedetail)
            }
        });
    }

    function click_handle(i, item) {
        setcardposition(i)
        GET_DATA(item.category_id)
    }

    function click_hot(item) {
        props.navigation.navigate('SingleDetail', { "venue_id": item.venue_id })

        // props.navigation.navigate('SingleDetail')
    }

    function unfav_click(item, index) {
        setLoader(true)
        var data = new FormData();
        data.append("user_id", info.user_id);
        data.append("venue_id", item.venue_id);
        data.append("cat_id", item.cat_id);

        console.log(data)
        console.log(Server.mark_favourite_venue)
        ApiCall.postRequest(Server.mark_favourite_venue, data, (response, error) => {
            //console.log(response)
            setLoader(false)
            if (response != undefined && (response.status == "success")) {
                const arr = [...list]
                arr.splice(index, 1)
                set_list(arr)
                Snackbar.show({
                    text: response.message,
                    duration: Snackbar.LENGTH_LONG,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: 'red'
                });
            }

        });


    }

    const renderItem_hotelList = useCallback(
        ({ item, index }) => (
            <TouchableOpacity
                onPress={click_hot.bind(this, item)}
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
                    <View style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
                        <TouchableOpacity
                            onPress={unfav_click.bind(this, item, index)}
                            style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

                            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Imageview
                                    url={GlobalImages.hot}
                                    width={22}
                                    height={22}
                                    image_type={"local"}
                                    resize_mode={"cover"}
                                    radius={10}
                                    margin_vertical={7}
                                    tint_color={Design.white}
                                />
                                <Textview
                                    text={item.category}
                                    font_family={"regular"}
                                    color={Design.white}
                                    font_size={Design.font_18}
                                    margin_horizontal={10}
                                />
                            </View> */}
                            <Imageview
                                url={GlobalImages.remove}
                                width={100}
                                height={55}
                                image_type={"local"}
                                resize_mode={"cover"}

                            />
                        </TouchableOpacity>




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
                                <Imageview
                                    url={GlobalImages.ratingStar}
                                    width={100}
                                    height={12}
                                    image_type={"local"}
                                    resize_mode={"contain"}



                                />
                            </View>

                            <Textview
                                text={item.location}
                                font_family={"regular"}
                                color={Design.white}
                                font_size={Design.font_14}
                                margin_top={Platform.OS == "ios" ? 5 : 0}

                            />
                        </View>
                        <Imageview
                            url={GlobalImages.favourite}
                            width={Platform.OS == "ios" ? 40 : 35}
                            height={Platform.OS == "ios" ? 40 : 35}
                            image_type={"local"}
                            resize_mode={"cover"}
                            align_self={'flex-start'}
                            margin_top={10}
                            tint_color={Design.primary_color_orange}

                        />
                    </View>

                </ImageBackground>


            </TouchableOpacity>

        ), [list]);
    const keyExtractor_hotellist = (item) => item.id;


    const renderItemcategory = useCallback(
        ({ item, index }) => (
            <TouchableOpacity onPress={click_handle.bind(this, index, item)} style={{
                alignItems: 'center',
                marginHorizontal: 7,
                width: Platform.OS == "ios" ? 90 : 75
            }}>

                {
                    cardposition == index ?

                        <CardView
                            cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                            cornerRadius={50}
                            style={{

                                alignItems: 'center',
                                margin: 10,
                                backgroundColor: Design.white,
                                padding: 5,


                            }}
                        >

                            <View style={{
                                backgroundColor: colors[index % colors.length],
                                height: 65,
                                width: 65,
                                borderRadius: 32.5,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Imageview
                                    url={item.category_image}
                                    width={30}
                                    height={30}
                                    image_type={"server"}
                                    resize_mode={"contain"}
                                />
                            </View>

                            <Textview
                                text={item.category_name}
                                font_family={"regular"}
                                color={Design.black}
                                margin_top={Platform.OS == "ios" ? 14 : 9}
                                margin_bottom={Platform.OS == "ios" ? 17 : 12}
                                lines={1}
                                text_align={'center'}
                                font_size={Design.font_11}
                            />
                        </CardView>


                        :


                        <View style={{}}>
                            <CardView
                                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                                cornerRadius={50}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    margin: 10,
                                    backgroundColor: Design.white,
                                    padding: 4,


                                }}
                            >

                                <View style={{
                                    backgroundColor: colors[index % colors.length],
                                    height: 65,
                                    width: 65,
                                    borderRadius: 32.5,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Imageview
                                        url={item.category_image}
                                        width={30}
                                        height={30}
                                        image_type={"server"}
                                        resize_mode={"contain"}

                                    />
                                </View>


                            </CardView>


                            <Textview
                                text={item.category_name}
                                font_family={"regular"}
                                color={Design.black}
                                margin_top={2}
                                lines={1}
                                text_align={'center'}
                                font_size={Design.font_11}
                            />

                        </View>
                }




            </TouchableOpacity>

        ), [cardposition]);

    const keyExtractorcategory = (item) => item.img;


    return (
        <View style={CSS.Favcontainer}>
            <Loader loader={loader} />
            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={20}
                style={{



                    backgroundColor: Design.white,
                    padding: 4


                }}

            >
                <Textview
                    text={'Favourites'}
                    font_family={"medium"}
                    color={Design.black}
                    margin_top={Platform.OS == "ios" ? 50 : 10}
                    font_size={Design.font_25}
                    margin_horizontal={15}
                />

                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={props.category_list}
                    style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15, paddingBottom: Platform.OS == "ios" ? 10 : 5 }}
                    renderItem={renderItemcategory}
                    keyExtractor={keyExtractorcategory}
                />

            </CardView>



            {
                list.length != 0

                    ?

                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={list}
                        style={{ marginTop: Platform.OS == "ios" ? 18 : 15, paddingBottom: Platform.OS == "ios" ? 10 : 5, marginHorizontal: 10, marginBottom: Platform.OS == "ios" ? 80 : 60 }}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        renderItem={renderItem_hotelList}
                        keyExtractor={keyExtractor_hotellist}
                    />

                    :

                    <Nodata />

            }

        </View>
    )
}
const mapStateToProps = state => ({
    info: state.info.info,
    category_list: state.category_list.category_list,

});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TabFavorites);