import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import { ScrollView } from "react-native-gesture-handler";
import Scan from "../component/Scan";
import RandomItems from '../component/RandomItems';

export default function ScanningScreen(props) {

    const [loader, setLoader] = useState(true)

    const items = ['Item 1', 'Item 2', 'Item 3',];

    function click_back() {
        props.navigation.goBack()
    }

    return (
        <ImageBackground
            source={GlobalImages.ScanBackground}
            style={CSS.LoginBackground}
        >
            <Scan loader={loader} />


            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 20 : 5, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>

                <TouchableOpacity
                    onPress={click_back}

                >
                    <Imageview
                        url={GlobalImages.back}
                        width={Platform.OS == "ios" ? 55 : 50}
                        height={Platform.OS == "ios" ? 55 : 50}
                        image_type={"local"}
                        resize_mode={"contain"}
                        margin_left={10}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    {/* <Textview
                    text={'Settings'}
                    font_family={"medium"}
                    color={Design.black}
                    text_align={'center'}
                    font_size={Design.font_20}

                /> */}
                </View>

                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />

            </View>

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'black',
            }}>
                <RandomItems data={items} />

            </View>

        </ImageBackground>
    )
}