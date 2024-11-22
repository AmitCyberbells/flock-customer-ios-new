import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, ViewComponent } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import { ScrollView } from "react-native-gesture-handler";

import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';

export default function Feathers(props) {

    const [hotelList, sethotelList] = useState([

        {
            id: 1,
            category: 'Hotels',
            title: 'Hotel Berlin',
            address: '1.5 km dal centro',
            img: GlobalImages.featherHotel
        },
        {
            id: 2,
            category: 'Food',
            title: 'Hotel Smartz',
            address: '1.5 km dal centro',
            img: GlobalImages.featherFood
        },
        {
            id: 3,
            category: 'Night Life',
            title: 'Hotel Taj',
            address: '1.5 km dal centro',
            img: GlobalImages.featherNight
        },
        {
            id: 4,
            category: 'Entertainment',
            title: 'Hotel Berlin',
            address: '1.5 km dal centro',
            img: GlobalImages.featherEntertain
        },

    ])

    const [FeathersList, setFeathersList] = useState(props.navigation.getParam('FeathersList', ''));

    const colors = ['#FEF2BF', '#CAD2F7', '#C3CED6', '#CAD2F7', "#FBDFC3"];

    const imgColor = ['#FACC48', '#2B4CE0', '#103E5B', '#2B4CE0', '#F1813A'];

    useEffect(() => {

        console.log(FeathersList);

        console.log('Feather Data')

       console.log(Server.imgURL + FeathersList[0].image);

    }, []);

    // function FeathersAPI() {
    //     setLoader(true)
    //     var data = new FormData();
    //     data.append("email", email);
    //     data.append("password", password);
    //     data.append("device_token", token);
    //     data.append("device_type", Platform.OS);


    //     ApiCall.postRequest(Server.loginuser, data, (response, error) => {
    //         setLoader(false)

    //         if (response != undefined && response.status == "success") {
    //             let { actions } = props;
    //             actions.saved_user_info(response.info);
    //             AsyncStorage.setItem("user_details", JSON.stringify(response.info));

    //             AsyncStorage.setItem("login", "true")

    //             console.log(response.info)
    //             Snackbar.show({
    //                 text: response.message,
    //                 duration: Snackbar.LENGTH_LONG,
    //                 fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
    //                 backgroundColor: "green"
    //             });
    //             props.navigation.replace('HomeScreen')
    //         } else {
    //             Alert.alert(response.message)
    //             Snackbar.show({
    //                 text: response.message,
    //                 duration: Snackbar.LENGTH_SHORT,
    //                 fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
    //                 backgroundColor: "red"
    //             });
    //         }
    //     });


    // }

    const renderItem_hotelList = useCallback(
        ({ item, index }) => (

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    backgroundColor: Design.white,
                    paddingHorizontal: Platform.OS == "ios" ? 10 : 7,
                    paddingVertical: Platform.OS == "ios" ? 10 : 7,
                    height: Dimensions.get("window").height * 21.5 / 100,
                    marginBottom: Platform.OS == "ios" ? 10 : 5,
                    marginTop: Platform.OS == "ios" ? 10 : 5,
                    marginHorizontal: Platform.OS == "ios" ? 17 : 15,
                }}

            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <View style={{
                        width: 70, height: 70, justifyContent: 'center',
                        alignItems: 'center', borderRadius: 60, backgroundColor: 'white',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 5

                    }}>
                        <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 60, backgroundColor: colors[index % colors.length] }}>
                            <Imageview
                                url={{ uri: `${Server.imgURL + item.image}` }}
                                width={25}
                                height={25}
                                image_type={"local"}
                                resize_mode={"contain"}
                                tint_color={imgColor[index % imgColor.length]}
                            />
                        </View>

                    </View>

                    <View style={{ marginHorizontal: 10 }}>
                        <Textview
                            text={item.name}
                            font_family={"medium"}
                            color={Design.black}
                            font_size={Design.font_17}

                        />
                        <Textview
                            text={'Lorem Ipsum is simply dummy text'}
                            font_family={"regular"}
                            color={Design.light_grey}
                            margin_top={Platform.OS == "ios" ? 10 : 2}
                            font_size={Design.font_13}


                        />

                    </View>

                </View>

                <View style={{ borderColor: Design.grey_line, borderWidth: Platform.OS == "ios" ? 0.6 : 0.3, marginVertical: Platform.OS == "ios" ? 10 : 8, }} />
                <View style={{ flexDirection: 'row', marginVertical: Platform.OS == "ios" ? 12 : 5, paddingHorizontal: Platform.OS == "ios" ? 10 : 7, }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Imageview
                            url={GlobalImages.available}
                            width={Platform.OS == "ios" ? 40 : 30}
                            height={Platform.OS == "ios" ? 40 : 30}
                            image_type={"local"}
                            resize_mode={"contain"}
                        />
                        <View style={{ paddingHorizontal: 10 }}>
                            <Textview
                                text={'Available Feathers'}
                                font_family={"medium"}
                                color={Design.light_grey}
                                font_size={Design.font_12}
                                margin_bottom={Platform.OS == "ios" ? 5 : 0}


                            />
                            <Textview
                                text={item.user_transactions.avail_feather}
                                font_family={"medium"}
                                color={Design.black}
                                font_size={Design.font_17}
                                margin_top={Platform.OS == "ios" ? 2 : 0}

                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: Platform.OS == "ios" ? 25 : 18 }}>
                        <Imageview
                            url={GlobalImages.spend}
                            width={Platform.OS == "ios" ? 40 : 30}
                            height={Platform.OS == "ios" ? 40 : 30}
                            image_type={"local"}
                            resize_mode={"contain"}
                        />
                        <View style={{ paddingHorizontal: 10 }}>
                            <Textview
                                text={'Last Spent'}
                                font_family={"medium"}
                                color={Design.light_grey}
                                font_size={Design.font_12}
                                margin_bottom={Platform.OS == "ios" ? 5 : 0}

                            />
                            <Textview
                                text={item.user_transactions.last_spent}
                                font_family={"medium"}
                                color={Design.black}
                                font_size={Design.font_17}
                                margin_top={Platform.OS == "ios" ? 2 : 0}

                            />
                        </View>
                    </View>

                </View>

            </CardView>

        ), [FeathersList]);

    const keyExtractor_hotellist = (item) => item.img;

    function click_back() {
        props.navigation.goBack()
    }

    return (
        <View style={CSS.Favcontainer}>
            
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
                        text={'Feathers'}
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
                data={FeathersList}
                style={{ flexGrow: 0, }}
                renderItem={renderItem_hotelList}
                keyExtractor={keyExtractor_hotellist}
            />

        </View>
    )
}