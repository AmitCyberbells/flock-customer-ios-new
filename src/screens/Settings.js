import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";

export default function Settings(props) {
    const [settingList, setsettingList] = useState([
        {
            title: 'Account Settings',
            slug: 'account_settings',
            img: GlobalImages.profile

        },
        /* {
            title: 'How To?',
            slug: 'tutorials',
            img: GlobalImages.tutorials

        }, */
        {
            title: 'Support',
            slug: 'support',
            img: GlobalImages.support

        },
        {
            title: 'Account Delete',
            slug: 'account-delete',
            img: GlobalImages.delete

        },
    ])

    function click_handle(item) {
        console.log(item)
        if (item.slug == "tutorials") {
            props.navigation.navigate("Tutorials")
        }
        else if (item.slug == "account_settings") {
            props.navigation.navigate("EditProfile")
        }
        else if (item.slug == "support") {
            props.navigation.navigate("SupportList")

        } else if (item.slug == "account-delete") {
            props.navigation.navigate("DeleteAccount")
        }
    }

    const renderItem_settingList = useCallback(
        ({ item, index }) => (
            <TouchableOpacity
                onPress={click_handle.bind(this, item)}
            >
                <CardView
                    cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                    cornerRadius={5}
                    style={{
                        backgroundColor: Design.white,
                        paddingHorizontal: Platform.OS == "ios" ? 20 : 15,
                        paddingVertical: Platform.OS == "ios" ? 25 : 20,
                        marginVertical: Platform.OS == "ios" ? 12 : 8,
                        marginHorizontal: Platform.OS == "ios" ? 5 : 2,
                    }}

                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <Imageview
                                url={item.img}
                                width={Platform.OS == "ios" ? 35 : 30}
                                height={Platform.OS == "ios" ? 35 : 30}
                                image_type={"local"}
                                resize_mode={"contain"}
                            />
                            <Textview
                                text={item.title}
                                font_family={"medium"}
                                color={Design.black}
                                lines={1}
                                font_size={Design.font_17}
                                margin_left={20}
                            />
                        </View>


                        <Imageview
                            url={GlobalImages.blackArrow}
                            width={Platform.OS == "ios" ? 12 : 10}
                            height={Platform.OS == "ios" ? 12 : 10}
                            image_type={"local"}
                            resize_mode={"contain"}
                            tint_color={Design.light_grey}

                        />
                    </View>

                </CardView>

            </TouchableOpacity>

        ), [settingList]);
    const keyExtractor_settingList = (item) => item.title;
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
                        text={'Settings'}
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
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                data={settingList}
                style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 15 : 15, paddingBottom: Platform.OS == "ios" ? 10 : 5, marginHorizontal: 10, }}
                renderItem={renderItem_settingList}
                keyExtractor={keyExtractor_settingList}
            />
        </View>
    )
}