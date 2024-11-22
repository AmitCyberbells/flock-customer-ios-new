import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    ImageBackground,
    Dimensions,
} from 'react-native';
import Design from "../design/Design"
import CSS from '../design/CSS';
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from 'react-native-cardview'
import Global from "../global/Global"


import TabHome from './TabHome';
import TabInu from './TabInu';
import TabNotification from './TabNotification';
import TabProfile from './TabProfile';
import TabFavorites from './TabFavorites';

export default function CustomTabBar_Android(props) {

    const { navigation, focused } = props;
    const routes = navigation.state.routes;
    const [index, set_index] = useState(0)

    const navigationHandler = routeName => {

        props.navigation.navigate(routeName);
    };


    function click_handle(type, i) { 
        set_index(i)

       // props.navigation.navigate(type)

    }


    return (
        <View style={{ height: '100%', backgroundColor: '#000000' }}>

            {
                index == 0 ? <TabHome navigation={props.navigation} /> : index == 1 ? <TabNotification navigation={props.navigation} /> : index == 2 ? <TabInu navigation={props.navigation} /> : index == 3 ? <TabFavorites navigation={props.navigation} /> : <TabProfile navigation={props.navigation} />
            }

            <ImageBackground source={GlobalImages.bottomNav}
                style={{ width: Dimensions.get("window").width, height: 100, position: 'absolute', bottom: -10 }}
                resizeMode={'cover'}
            >


                <View style={{
                    width: "100%", position: 'absolute', bottom: 5,
                    backgroundColor: '#fff',
                    shadowColor: '#dcdcdc',
                    shadowOpacity: 4,
                    height: Platform.OS == "ios" ? 80 : 70
                }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: Platform.OS == "ios" ? 23 : 17, marginTop: 15 }}>
                        <TouchableOpacity onPress={click_handle.bind(this, "Home", 0)} style={{ alignContent: 'center', alignItems: 'center' }}>
                            <Imageview
                                width={Platform.OS == "ios" ? 30 : 25}
                                height={Platform.OS == "ios" ? 30 : 25}
                                image_type={"local"}
                                url={GlobalImages.home}
                                tint_color={0 == index ? Design.primary_color_orange : Design.text_light_grey}
                            />
                            <Textview
                                text={'Home'}
                                font_size={Design.font_10}
                                color={0 == index ? Design.primary_color_orange : Design.text_light_grey}
                                font_family={'regular'}
                                margin_top={3}


                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={click_handle.bind(this, "Notification", 1)} style={{ alignContent: 'center', alignItems: 'center', marginRight: 80 }}>
                            <Imageview
                                width={Platform.OS == "ios" ? 30 : 25}
                                height={Platform.OS == "ios" ? 30 : 25}
                                image_type={"local"}
                                url={GlobalImages.notify}
                                tint_color={1 == index ? Design.primary_color_orange : Design.text_light_grey}
                            />
                            <Textview
                                text={'Notifications'}
                                font_size={Design.font_10}
                                color={1 == index ? Design.primary_color_orange : Design.text_light_grey}
                                font_family={'regular'}
                                margin_top={3}

                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={click_handle.bind(this, "Favorites", 3)} style={{ alignContent: 'center', alignItems: 'center' }}>
                            <Imageview
                                width={Platform.OS == "ios" ? 30 : 25}
                                height={Platform.OS == "ios" ? 30 : 25}
                                image_type={"local"}
                                url={GlobalImages.fav}
                                tint_color={3 == index ? Design.primary_color_orange : Design.text_light_grey}
                            />
                            <Textview
                                text={'Favourites'}
                                font_size={Design.font_10}
                                color={3 == index ? Design.primary_color_orange : Design.text_light_grey}
                                font_family={'regular'}
                                margin_top={3}

                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={click_handle.bind(this, "Profile", 4)} style={{ alignContent: 'center', alignItems: 'center' }}>
                            <Imageview
                                width={Platform.OS == "ios" ? 30 : 25}
                                height={Platform.OS == "ios" ? 30 : 25}
                                image_type={"local"}
                                url={GlobalImages.profile}
                                tint_color={4 == index ? Design.primary_color_orange : Design.text_light_grey}
                            />
                            <Textview
                                text={'Profile'}
                                font_size={Design.font_10}
                                color={4 == index ? Design.primary_color_orange : Design.text_light_grey}
                                font_family={'regular'}
                                margin_top={3}


                            />
                        </TouchableOpacity>
                    </View>

                </View>



                <TouchableOpacity
                    style={{

                        position: 'absolute',
                        bottom: 19,
                        left: "40.3%",

                        overflow: 'hidden'
                    }} onPress={click_handle.bind(this, "Inu", 2)}>
                    <Image
                        style={{
                            width: 70,
                            height: 70,
                            resizeMode: 'contain',
                            marginLeft: 2

                        }}
                        source={GlobalImages.bird}
                    />

                </TouchableOpacity>
            </ImageBackground>
        </View>
    );

}
