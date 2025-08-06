import React, { useState } from "react";
import { View, TouchableOpacity, ImageBackground, Image } from "react-native";
import AdBanner from "../types/AdBanner";
import SkeletonView from "./SkeletonView";
import { CSS } from "../constants/CSS";
import Venue from "../types/Venue";

type AdBannerProps = {
    item: AdBanner,
    openVenue: (venue: Venue) => void
}

const AdBannerItem: React.FC<AdBannerProps> = (props) => {
    const { item, openVenue } = props;
    const [loading, setLoading] = useState(true);

    return (
        <View style={CSS.home_value_image}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => item.venue ? openVenue(item.venue) : {}} style={{ flex: 1 }}>
                {loading && (
                    <SkeletonView />
                )}
                <Image source={{uri: item.image}} style={{flex: 1}} onLoad={() => setLoading(false)} resizeMode="stretch"/>
            </TouchableOpacity>
        </View>
    );
};

export default AdBannerItem;
