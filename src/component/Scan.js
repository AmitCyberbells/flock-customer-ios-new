import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
function Scan(props) {

    return (

        <AnimatedLoader
            visible={props.loader}
            overlayColor="rgba(255,255,255,0.15)"
            source={require("../images/ScanningLottie.json")}
            animationStyle={{ width: 100, height: 500, backgroundColor: 'transparent' }}
            speed={1}
        />
    );
}
export default React.memo(Scan);