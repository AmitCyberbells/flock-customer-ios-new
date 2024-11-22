import React, { useState, useEffect } from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import Design from "../design/Design";
import FastImage from "react-native-fast-image";

export default function Imageview(props) {
  return (
    <View>
      <FastImage
        style={{
          ...props.style,
          width: props.width,
          height: props.height,
          alignSelf: props.align_self,
          marginLeft: props.margin_left,
          marginTop: props.margin_top,
          overflow: "hidden",
          marginVertical: props.margin_vertical,
          marginRight: props.margin_right,
          borderRadius: props.radius,
          borderWidth: props.border_width,
          borderColor: props.border_color,
          marginHorizontal: props.margin_horizontal,
          marginBottom:props.margin_bottom,
          padding:props.padding,
          backgroundColor:props.backgroundColor
        }}
        onLoad={props.onLoad}
        source={
          props.image_type == "local"
            ? props.url
            : {
                uri: props.url,
                headers: { Authorization: "someAuthToken" },
                priority: FastImage.priority.high
              }
        }
        defaultSource={ require('../assets/flock_bird.png') }
        tintColor={props.tint_color}
        resizeMode={
          props.resize_mode == "cover"
            ? FastImage.resizeMode.cover
            : props.resize_mode == "contain"
              ? FastImage.resizeMode.contain
              : FastImage.resizeMode.contain
        }
      />
    </View>
  );
}
