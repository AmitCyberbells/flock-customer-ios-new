import React, { useState, useEffect } from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity } from "react-native";
import Design from "../design/Design";

export default function Textview(props)
 {
  const { text_click } = props
  return (
    <TouchableOpacity onPress={text_click} activeOpacity={props.active_opacity == null ? 1 : props.active_opacity}>
      <Text
        numberOfLines={props.lines}
        style={{
          fontSize: props.font_size,
          color: props.color,
          textAlign: props.text_align,
          marginTop: props.margin_top,
          marginHorizontal: props.margin_horizontal,
          marginLeft: props.margin_left,
          textDecorationLine: props.text_decoration_line,
          marginBottom: props.margin_bottom,
          alignSelf: props.align_self,
          marginRight: props.margin_right,
          paddingHorizontal: props.padding_horizontal,
          paddingVertical: props.padding_vertical,
          paddingBottom: props.padding_bottom,
          backgroundColor: props.bg_color,
          borderBottomLeftRadius:props.right_radius,
          borderWidth: props.border_width,
          borderColor: props.border_color,
          borderRadius: props.radius,
          borderStyle: props.border_style,
          marginVertical:props.margin_vertical,
          overflow: "hidden",
          fontFamily:
            props.font_family == "regular"
              ? Platform.OS == "ios"
                ? Design.ios_regular
                : Design.android_regular
              : props.font_family == "medium"
                ? Platform.OS == "ios"
                  ? Design.ios_medium
                  : Design.android_medium
                : props.font_family == "semi_bold"
                  ? Platform.OS == "ios"
                    ? Design.ios_semi_bold
                    : Design.android_semi_bold
                  : props.font_family == "bold"
                    ? Platform.OS == "ios"
                      ? Design.ios_bold
                      : Design.android_bold
                    : props.font_family == "light"
                    ? Platform.OS == "ios"
                      ? Design.ios_light
                      : Design.android_light
                      :null
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
