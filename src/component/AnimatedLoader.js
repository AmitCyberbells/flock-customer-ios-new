import React, { useState, useEffect } from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import Design from "../design/Design";
import CSS from '../design/CSS';
import AnimatedLoaderr from "react-native-animated-loader";
function AnimatedLoader(props) {

  return (
    
    <AnimatedLoaderr
      visible={props.loader}
      overlayColor="rgba(255,255,255,0.15)"
      source={require("../images/loader.json")}
      animationStyle={{ width: 180, height: 180 }}
      speed={1}
    />
  );
}
export default React.memo(AnimatedLoader);