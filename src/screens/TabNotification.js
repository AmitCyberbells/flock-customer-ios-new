import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";
import Nodata from "../child_class/no_data";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";

function TabNotification(props) {

    const {
        info,
        notification_list
    } = props;
    const [loader, setLoader] = useState(false)

    const [data_found, set_data_found] = useState("")

    useEffect(() => {

        // if (props.notification_list.length == 0) {
        //     set_data_found("")
        // }
        // else {
        //     set_data_found("true")
        // }

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

    useEffect(() => {

        GET_DATA_API()

        var navigationdata = props.navigation.addListener('didFocus', () => {

            GET_DATA_API();

        });

        return () => {
            navigationdata.remove();
        }

    }, []);


    function GET_DATA_API() {


        setLoader(true)

        // if (props.notification_list.length == 0) {

        // }

        var data = new FormData();

        data.append("user_id", info.user_id);

        console.log(data)
        console.log(Server.notifications)

        ApiCall.postRequest(Server.notifications, data, (response, error) => {
            setLoader(false)
            if (response != undefined && response.status == "success") {
                let { actions } = props;
                actions.notificationdata(response.notifications)
                set_data_found("true")
            }
            else {
                set_data_found("false")
            }
        });


    }

    const renderItem_notificationList = useCallback(
        ({ item, index }) => (

            <View>
                <View style={{ width: Dimensions.get("window").width, marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>


                    <ImageBackground
                        source={{ uri: item.image }}
                        imageStyle={{ opacity: 0.66 }}
                        resizeMode={'stretch'}
                        style={{
                            width: Platform.OS == "ios" ? 70 : 40,
                            height: Platform.OS == "ios" ? 70 : 40,
                            marginTop: 7,
                            borderRadius: 50,
                            overflow: 'hidden',
                            backgroundColor: '#B2B2B2'

                        }}
                    />
                    <View style={{ marginHorizontal: 20 }}>
                        <Textview
                            text={item.title}
                            font_family={"regular"}
                            color={Design.black}
                            font_size={Design.font_14}

                        />
                        <Textview
                            text={item.description}
                            font_family={"regular"}
                            color={Design.grey}
                            font_size={Design.font_12}

                        />

                    </View>


                </View>

                <Textview
                    text={moment(item.created_at).format('YYYY-MM-DD hh:mm A')}
                    font_family={"regular"}
                    color={Design.grey}
                    font_size={Design.font_12}
                    text_align={'right'}
                    margin_bottom={Platform.OS == "ios" ? 5 : 5}

                />

                <View style={{ borderColor: Design.grey_line, borderWidth: Platform.OS == "ios" ? 0.6 : 0.3, marginVertical: Platform.OS == "ios" ? 2 : 0, }} />
            </View>


        ), [props.notification_list]);
    const keyExtractor_notificationList = (item) => item.id;

    return (

        <View style={CSS.Favcontainer}>

            <Loader loader={loader} />

            <Textview
                text={'Notifications'}
                font_family={"medium"}
                color={Design.black}
                margin_top={Platform.OS == "ios" ? 50 : 10}
                font_size={Design.font_25}
                margin_horizontal={15}
            />

            {
                notification_list != 0

                    ?

                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={notification_list}
                        style={{ flexGrow: 0, marginTop: Platform.OS == "ios" ? 18 : 15, marginHorizontal: 10, marginBottom: Platform.OS == "ios" ? 80 : 65 }}
                        renderItem={renderItem_notificationList}
                        keyExtractor={keyExtractor_notificationList}
                    />

                    :

                    <Nodata />

            }

        </View>
    )
}
const mapStateToProps = state => ({
    info: state.info.info,
    notification_list: state.notification_list.notification_list
});


const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TabNotification);