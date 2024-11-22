import React, { useEffect, useRef, useState } from "react";
import { View, LogBox, ImageBackground, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';
// import ImageView from '../Components/ImageView';
// import CSS from '../Design/CSS';
// import Icon from '../Global/GlobalImages';
// import Textview from '../Components/TextView';
// import Design from '../design/Design';

//Class Action
export default function CustomSideBar(props) {

    const [logOutDialog, setLogOutDialog] = useState(false);

    const moveAnimationA = useRef(new Animated.Value(-300)).current;

    const [profileList, setprofileList] = useState([
        { title: 'Bookings' },
        { title: 'Message' },
        { title: 'Transactions' },
        { title: 'Become a Host' },
        { title: 'Terms & Conditions' },
        { title: 'Help Center' },

    ])

    useEffect(() => {
        console.log('here')
        animation()
    }, []);

    function animation() {
        Animated.timing(moveAnimationA, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }


    // function renderItem_profile(item, index) {
    //     //console.log(item.title)
    //     return (
    //         <TouchableOpacity
    //             style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center', }}
    //             onPress={() => navigationController(item, index)}>

    //             <Textview
    //                 text={item.title}
    //                 color={Design.white}
    //                 font_size={Design.font_16}
    //                 font_family={"semi_bold"}
    //             />
    //         </TouchableOpacity>
    //     )
    // }

    // function navigationController(item, index) {

    //     if (index == 0) {
    //         console.log('Booking', index)
    //         //props.navigation.navigate('Profile')
    //     } else if (index == 1) {
    //         console.log('Message', index)
    //     } else if (index == 2) {
    //         console.log('Transactions', index)
    //     } else if (index == 3) {
    //         console.log('Become a Host', index)
    //         props.navigation.push('BecomeHost')
    //     } else if (index == 4) {
    //         console.log('Terms & Conditions', index)
    //     } else if (index == 5) {
    //         console.log('Help Center', index)
    //     } else { }

    //     props.closeMenu()
    // }

    // function onLogOutClick() {
    //     props.navigation.navigate('Login')
    // }


    return (

        <TouchableOpacity activeOpacity={1}
           onPress={() => props.closeMenu()}
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.0)' }}>

            <View
                style={{
                    flex: 1,
                    justifyContent: "center"
                }}
            >
                {/* <BlurView
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}
                    blurType="light"  // Values = dark, light, xlight .
                    blurAmount={10}
                    // viewRef={this.state.viewRef}
                    reducedTransparencyFallbackColor="white"
                /> */}

                <Animated.View style={{ flex: 1, height: '100%', width: Dimensions.get('window').width - 100, backgroundColor: '#28282B', transform: [{ translateX: moveAnimationA }] }}>

                    {/* <ScrollView>

                        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>

                            <SafeAreaView>

                                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40 }}>

                                        <View style={{ width: 50, height: 50, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                                            <ImageView image={Icon.DummyImage}
                                                height={47}
                                                width={47}
                                                resizeMode={'contain'}
                                                image_type={'local'}
                                                radius={35}
                                            />
                                        </View>

                                        <View style={{ marginLeft: 10 }}>

                                            <Textview
                                                text={'Johnnie Walker'}
                                                color={Design.white}
                                                font_size={Design.font_18}
                                                font_family={"semi_bold"}
                                            // margin_top={15}
                                            />
                                            <Textview
                                                text={'View Profile'}
                                                color={Design.white}
                                                font_size={Design.font_12}
                                                font_family={"semi_bold"}
                                                text_decoration_line={'underline'}

                                            // margin_top={15}
                                            />

                                        </View>

                                    </View>

                                    <View style={{ marginTop: 10 }}>
                                        {profileList.map((item, index) => renderItem_profile(item, index))}
                                    </View>

                                    <View style={{ height: 110 }} />

                                    <TouchableOpacity
                                        onPress={() => {
                                            setLogOutDialog(true)
                                        }}
                                        style={{ marginBottom: 50, flexDirection: 'row', justifyContent: 'flex-start', height: 40, alignItems: 'center', backgroundColor: Design.yellowShade, marginTop: 30, alignSelf: 'flex-start', }}>

                                        <ImageView image={Icon.LogOutIcon}
                                            height={25}
                                            width={25}
                                            resizeMode={'contain'}
                                            image_type={'local'}
                                            radius={35}
                                            margin_right={10}
                                        />

                                        <Textview
                                            text={'Log Out'}
                                            color={Design.white}
                                            font_size={Design.font_18}
                                            font_family={"semi_bold"}
                                        />

                                    </TouchableOpacity>

                                </View>

                            </SafeAreaView>
                        </TouchableOpacity>
                    </ScrollView> */}

                </Animated.View>
            </View>

            {/* {
                logOutDialog == true ?

                    <View style={{
                        position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(52,52,52,0.4)', justifyContent: "center",
                        alignItems: "center",
                        alignSelf: 'center',
                    }}>

                        <View style={{
                            width: '80%', height: 150, borderRadius: 10, marginTop: -60, backgroundColor: Design.white, justifyContent: "space-between",
                            alignItems: "center",
                            alignSelf: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 0,
                        }}>

                            <Textview
                                text={'Are you sure you want to logout ?'}
                                color={Design.black}
                                font_size={Design.font_20}
                                font_family={"semi_bold"}
                                font_weight={'700'}
                                margin_top={5}
                                text_align={'center'}
                                margin_horizontal={10}

                            />

                            <View style={{ width: '90%', height: 50, flexDirection: 'row' }}>

                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: 'center',

                                }}>

                                    <TouchableOpacity
                                        onPress={() =>  props.closeMenu()}
                                        style={{
                                            width: 100, height: 50, justifyContent: "center",
                                            alignItems: "center",
                                            alignSelf: 'center',
                                        }}>

                                        <Textview
                                            text={'Cancel'}
                                            color={Design.black}
                                            font_size={Design.font_18}
                                            font_family={"semi_bold"}
                                            text_align={'center'}

                                        />

                                    </TouchableOpacity>

                                </View>

                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: 'center',

                                }}>

                                    <TouchableOpacity
                                        onPress={onLogOutClick}
                                        style={{
                                            width: 100, height: 50, justifyContent: "center",
                                            alignItems: "center",
                                            alignSelf: 'center',
                                        }}>
                                        <Textview
                                            text={'Logout'}
                                            color={Design.primaryColor}
                                            font_size={Design.font_18}
                                            font_family={"semi_bold"}
                                            font_weight={'700'}
                                            text_align={'center'}

                                        />
                                    </TouchableOpacity>

                                </View>

                            </View>

                        </View>

                    </View>

                    :

                    null

            } */}

        </TouchableOpacity >
    );
};
