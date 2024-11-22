import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"

export default function no_data(props) {
    return (
        <View style={CSS.no_data_view}>
            <Imageview
                width={250}
                height={250}
                image_type={"local"}
                url={GlobalImages.no_data}
            />
        </View>
    )
}