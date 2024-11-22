import React, { useState, useEffect } from "react"
import { View, Text, Platform, Image, Dimensions, ImageBackground } from "react-native"
import Design from "../design/Design"
import Textview from "../component/Textview"
import CSS from "../design/CSS"
import Imageview from "../component/Imageview"
import GlobalImages from "../global/GlobalImages"
import AppIntroSlider from 'react-native-app-intro-slider';


const slides = [
  {
    key: 'one',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    backgroundColor: '#59b2ab',
    img: GlobalImages.slider1
  },
  {
    key: 'two',
    title: 'Title 2',
    text: 'Other cool stuff',
    backgroundColor: '#febe29',
    img: GlobalImages.slider2
  },
  {
    key: 'three',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    backgroundColor: '#22bcb5',
    img: GlobalImages.slider3
  }
];


export default function Onboard(props) {
  useEffect(() => {

  }, []);
  const [position, set_position] = useState(0)
  const [showRealApp, setshowRealApp] = useState(false)
  function onDone() {
    setshowRealApp(true)
    props.navigation.navigate('Login');
  }

  function done_button() {
    return (
      <View>
        <Imageview
          width={Platform.OS == "ios" ? 50 : 40}
          height={Platform.OS == "ios" ? 50 : 40}
          resize_mode={'fill'}
          margin_bottom={20}
          image_type={"local"}
          url={GlobalImages.done}
        />
      </View>
    )
  }
  return (
    <View style={CSS.Splashcontainer}>
      <AppIntroSlider
        onSlideChange={(index) => set_position(index)}
        renderDoneButton={done_button}
        activeDotStyle={{ backgroundColor: Design.primary_color_orange }}
        showNextButton={false}
        renderItem={({ item, index }) => (
          <View>

            <ImageBackground
              source={item.img}
              style={CSS.LoginBackground}
            />

          </View>

        )}

        data={slides} onDone={onDone} />


    </View>
  )
}