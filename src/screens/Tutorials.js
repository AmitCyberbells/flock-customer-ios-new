import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground, StyleSheet, Button, Text } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"
import CardView from "react-native-cardview";

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';

import Snackbar from "react-native-snackbar";
import Loader from '../component/AnimatedLoader';
import Server from '../util/Server';
import ApiCall from '../util/Network';
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';
import Nodata from "../child_class/no_data";
import Video, { VideoRef } from 'react-native-video';
import WebView from "react-native-webview";

function Tutorials(props) {
    const { info, tutorial_list, actions } = props;
    const [data_found, set_data_found] = useState("")
    const [loader, setLoader] = useState(false)
    const videoRef = useRef(null);
    const windowWidth = Dimensions.get('screen').width;
    const windowHeight = Dimensions.get('window').height;

    const onBuffer = (event) => {
        setLoader(event.isBuffering);
    }

    const onError = (e) => {
        console.log({ e })
    }

    const onVideoEnd = (e) => {
        console.log({ e })
    }

    useEffect(() => {

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
        if (props.tutorial_list.length == 0) {
            setLoader(true);
        }

        var data = new FormData();
        data.append("user_id", info.user_id);
        
        ApiCall.postRequest(Server.tutorials, data, (response, error) => {
            setLoader(false);

            if (response != undefined && response.status == "success") {
                
                actions.tutorial_data(response.Tutorials);

                if (response.Tutorials.length == 0) {
                    set_data_found("false");
                } else {
                    set_data_found("true");
                }

            } else {
                set_data_found("false");
            }
        });


    }

    const renderItem_tutorialList = useCallback(
        ({ item, index }) => (

            <CardView
                cardElevation={Platform.OS == "ios" ? 2.5 : 7}
                cornerRadius={10}
                style={{
                    backgroundColor: Design.white,
                    marginHorizontal: 15,
                    marginVertical: 10,
                }}
            >
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                    <Textview
                        text={item.tutorials_name}
                        font_family={"medium"}
                        color={Design.black}
                        font_size={Design.font_15}

                    />
                    <Textview
                        text={item.tutorials_desc}
                        font_family={"regular"}
                        color={Design.light_grey}
                        font_size={Design.font_12}

                    />
                </View>
                <TouchableOpacity onPress={() => playTutorial(item)}>
                    <CardView
                        cardElevation={2.5}
                        //cornerRadius={20}
                        style={{
                            alignSelf: "flex-start",
                            backgroundColor: Design.white,
                            //paddingVertical: 5,
                            //paddingHorizontal: 10,
                            //marginVertical: 6,
                            backgroundColor: Design.grey,
                            width: windowWidth - 30,
                            height: 100,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>

                        <Imageview
                            url={GlobalImages.play_button}
                            width={50}
                            height={50}
                            image_type={"local"}
                            resize_mode={"stretch"}
                        />
                        {/* <Textview
                            text={'Watch Tutorial'}
                            font_family={"regular"}
                            color={Design.light_blue}
                            font_size={Design.font_13}
                            text_click={click.bind(this, item.tutorials_video)}
                        /> */}
                    </CardView>
                </TouchableOpacity>
                {/* <View style={styles.container}>
                    { isValidVideoUrl(item.tutorials_video) ?
                        <Video
                            source={{ uri: item.tutorials_video }}
                            ref={videoRef}
                            controls={true}
                            onBuffer={onBuffer}
                            onError={onError}
                            onEnd={onVideoEnd}
                            paused={true}
                            resizeMode={"cover"}
                            style={styles.backgroundVideo}
                        /> :
                        <WebView
                            javaScriptEnabled={true}
                            injectedJavaScript={`window.testMessage = "hello world"`}
                            startInLoadingState={true}
                            useWebKit={false}
                            domStorageEnabled={true}
                            scalesPageToFit={true}
                            automaticallyAdjustContentInsets={true}
                            source={{ uri: fixVideoLink(item.tutorials_video) }}
                        />


                    }
                </View> */}
            </CardView>

        ), [props.tutorial_list]);

    const keyExtractor_category = (item) => item.img;

    function click_back() {
        props.navigation.goBack()
    }

    function playTutorial(item) {
        let link = item.tutorials_video ?? item.video_url;

        if (link && isValidVideoUrl(link)) {
            //props.navigation.navigate("Webview", { "link": link });
            props.navigation.navigate("VideoPlayer", { "link": link });

        } else {
            Toast.show("Video url is invalid");
        }
    }

    const isValidVideoUrl = (url) => {
        const videoUrlRegex = /^(http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+([/?].*)\.(mp4|mov|avi|mkv|wmv|flv)$/i;

        // Check if the URL matches the video URL regex
        if (videoUrlRegex.test(url)) {
            console.log('true', url);
            return true;
        }

        return false;
    };

    const isYoutubeVideo = (url) => {
        if (!url) {
            return false;
        }

        const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

        // Check if the URL matches the video URL regex
        if (youtubeRegex.test(url)) {
            return true;
        }

        return false;
    }

    function fixVideoLink(url) {

        let val = url;
        let r, rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

        if (rx.test(url)) {
            r = url.match(rx);
            if (r) {
                val = `https:://youtube.com/embed/${r[1]}?rel=0`;
            }
        }

        return val;
    }

    const onPressLearnMore = () => {
        props.navigation.navigate('MoreTutorials');
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: Design.white,
            height: '100%'
        }}>
            <Loader loader={loader} />

            <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 50 : 10, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>
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
                        text={'Tutorials '}
                        font_family={"medium"}
                        color={Design.black}
                        text_align={'center'}
                        font_size={Design.font_20}


                    />
                </View>
                <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />
            </View>

            {
                data_found == "true"
                    ?
                    <FlatList
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        data={props.tutorial_list}
                        //style={{ flexGrow: 0, marginTop: 5, paddingBottom: Platform.OS == "ios" ? 10 : 5, }}
                        renderItem={renderItem_tutorialList}

                    />

                    :
                    data_found == "false"
                        ?
                        <Nodata />
                        :
                        null
            }

            <TouchableOpacity style={{
                height: Platform.OS === 'ios' ? 60 : 50,
                marginTop: 10,
                backgroundColor: Design.primary_color_orange,
                justifyContent: 'center',
                position: 'absolute',
                bottom: 0,
                width: '100%'

            }} onPress={onPressLearnMore}>

                <Text style={{
                    color: Design.white,
                    fontSize: 20,
                    alignSelf: 'center'
                }}>Learn More</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 200,
        width: '100%'
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

const mapStateToProps = state => ({
    info: state.info.info,
    tutorial_list: state.tutorial_list.tutorial_list
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tutorials);