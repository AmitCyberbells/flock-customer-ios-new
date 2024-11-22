import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, TextInput } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
var cal = 1;

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import Nodata from "../child_class/no_data";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
function Faq(props) {

    const { faq_list } = props;
    const [loader, setLoader] = useState(false)
    const [data_found, set_data_found] = useState("")
    const [key, set_key] = useState(1)
    const [list, set_list] = useState([
        // {
        //     id: '1',
        //     title: 'App related questions',
        //     status: 'false',
        //     data: [
        //         {
        //             id: '1',
        //             question: 'How to redeem offers ?',
        //             answer: 'Lorem ipsumdolor sit amet, consectetur elitsed do eiusmod tempor incidunt ut labordolor magna alqua,Uit ad minim dolore venum,quis nosturd exeratation dolor sit amet.'
        //         },
        //         {
        //             id: '2',
        //             question: 'How to redeem offers ?',
        //             answer: 'Lorem ipsumdolor sit amet, consectetur elitsed do eiusmod tempor incidunt ut labordolor magna alqua,Uit ad minim dolore venum,quis nosturd exeratation dolor sit amet.'
        //         }
        //     ]
        // },
        // {
        //     id: '2',
        //     title: 'App related questions',
        //     status: 'false',
        //     data: [
        //         {
        //             id: '1',
        //             question: 'How to redeem offers ?',
        //             answer: 'Lorem ipsumdolor sit amet, consectetur elitsed do eiusmod tempor incidunt ut labordolor magna alqua,Uit ad minim dolore venum,quis nosturd exeratation dolor sit amet.'
        //         },
        //         {
        //             id: '2',
        //             question: 'How to redeem offers ?',
        //             answer: 'Lorem ipsumdolor sit amet, consectetur elitsed do eiusmod tempor incidunt ut labordolor magna alqua,Uit ad minim dolore venum,quis nosturd exeratation dolor sit amet.'
        //         }
        //     ]
        // },
        // {
        //     id: '3',
        //     title: 'App related questions',
        //     status: 'false',
        //     data: [
        //         {
        //             id: '1',
        //             question: 'How to redeem offers ?',
        //             answer: 'Lorem ipsumdolor sit amet, consectetur elitsed do eiusmod tempor incidunt ut labordolor magna alqua,Uit ad minim dolore venum,quis nosturd exeratation dolor sit amet.'
        //         },
        //         {
        //             id: '2',
        //             question: 'How to redeem offers ?',
        //             answer: 'Lorem ipsumdolor sit amet, consectetur elitsed do eiusmod tempor incidunt ut labordolor magna alqua,Uit ad minim dolore venum,quis nosturd exeratation dolor sit amet.'
        //         }
        //     ]
        // },
        // {
        //     id: '4',
        //     title: 'App related questions',
        //     status: 'false',
        //     data: [
        //         {
        //             id: '1',
        //             question: 'How to redeem offers ?',
        //             answer: 'Lorem ipsumdolor sit amet, consectetur elitsed do eiusmod tempor incidunt ut labordolor magna alqua,Uit ad minim dolore venum,quis nosturd exeratation dolor sit amet.'
        //         },
        //         {
        //             id: '2',
        //             question: 'How to redeem offers ?',
        //             answer: 'Lorem ipsumdolor sit amet, consectetur elitsed do eiusmod tempor incidunt ut labordolor magna alqua,Uit ad minim dolore venum,quis nosturd exeratation dolor sit amet.'
        //         }
        //     ]
        // }
    ])

    useEffect(() => {

       // console.log(faq_list)
        NetInfo.fetch().then(state => {
            if (state.isConnected == false) {
                Snackbar.show({
                    text: 'Please turn on your internet',
                    duration: Snackbar.LENGTH_SHORT,
                    fontFamily: Platform.OS == "ios" ? Design.ios_regular : Design.android_regular,
                    backgroundColor: Design.primary_color_orange
                });
            } else {
                GET_DATA_API()
            }
        });
    }, []);

    function GET_DATA_API() {
        if (props.faq_list.length == 0) {
            setLoader(true)
        }
        else {
            set_data_found("true")
        }


        ApiCall.getRequest(Server.faq, (response, error) => {

            setLoader(false)

            if (response != undefined && response.status == "success") {

                let { actions } = props;
                actions.faq_data(response.Faqs);

                set_list(response.Faqs)

                ////console.log(response)


                if (response.Faqs.length == 0) {
                    set_data_found("false")
                }
                else {
                    set_data_found("true")
                }
            }

            else {
                set_data_found("false")
            }

        });

    }

    function click_handle(item, index) {
       
        let val = ""
      
        console.log(item.status)
       
        if (item.status == "false") {
            val = "true"
        }
        else {
            val = "false"
        }
       
        console.log(val)
        
        const aar = [...props.faq_list]
        aar[index].status = val
        
        let { actions } = props;
        actions.faq_data(aar);

        cal = cal + 1
        set_key(cal)

    }

    const renderItem_List = useCallback(
        ({ item, index }) => (

            <TouchableOpacity activeOpacity={1} style={{
                marginBottom: 13
            }}
                onPress={click_handle.bind(this, item, index)}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: Design.light_purple,
                        paddingVertical: Platform.OS == "ios" ? 20 : 13,
                        paddingHorizontal: Platform.OS == "ios" ? 20 : 20,
                        borderRadius: 10,
                    }}>
                    <Textview
                        text={item.question}
                        font_family={"medium"}
                        color={Design.black}
                        font_size={Design.font_17}
                        text_click={click_handle.bind(this, item, index)}
                    />
                    <Imageview
                        url={item.status == 'false' ? GlobalImages.dropDown : GlobalImages.dropUp}
                        width={Platform.OS == "ios" ? 20 : 15}
                        height={Platform.OS == "ios" ? 20 : 15}
                        image_type={"local"}
                        resize_mode={"contain"}
                    />
                </View>
                {
                    item.status == "true"
                        ?
                        <View
                            style={{
                                backgroundColor: Design.very_light_grey,
                                paddingVertical: 13,
                                paddingHorizontal: Platform.OS == "ios" ? 20 : 20,
                                borderRadius: 10,
                                marginBottom: 10,
                                marginTop: 5
                            }}>

                            <Textview
                                text={item.answer}
                                font_family={"regular"}
                                color={Design.black}
                                font_size={Design.font_15}
                                text_click={click_handle.bind(this, item, index)}
                                margin_top={Platform.OS == "ios" ? 10 : 0}
                            />

                        </View>
                        :
                        null
                }

            </TouchableOpacity>

        ), [list]);
    const keyExtractor_list = (item) => item.id;



    function click_back() {
        props.navigation.goBack()
    }

    return (
        <View style={CSS.Favcontainer}>
            <Loader loader={loader} />
            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 50 : 5, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>
                <TouchableOpacity
                    onPress={click_back}

                >
                    <Imageview
                        url={GlobalImages.back}
                        width={Platform.OS == "ios" ? 55 : 50}
                        height={Platform.OS == "ios" ? 55 : 50}
                        image_type={"local"}
                        resize_mode={"contain"}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <Textview
                        text={'FAQs'}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />


            </View>
            <Textview
                text={'Top questions '}
                font_family={"medium"}
                color={Design.black}
                margin_top={Platform.OS == "ios" ? 25 : 25}
                font_size={Design.font_20}
                margin_horizontal={Platform.OS == "ios" ? 12 : 10}

            />

            {
                data_found == "true"
                    ?
                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={props.faq_list}
                        key={key}
                        style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15, marginHorizontal: 10, }}
                        renderItem={renderItem_List}
                        keyExtractor={keyExtractor_list}
                    />

                    :
                    data_found == "false"
                        ?
                        <Nodata />
                        :
                        null
            }




        </View>
    )
}

const mapStateToProps = state => ({
    faq_list: state.faq_list.faq_list,

});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Faq);
