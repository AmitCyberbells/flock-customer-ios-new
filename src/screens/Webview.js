import React, { useState, useEffect, useCallback } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions, Platform, ImageBackground } from 'react-native'
import CSS from "../design/CSS"
import Design from "../design/Design";
import GlobalImages from "../global/GlobalImages"
import Imageview from "../component/Imageview"
import Textview from "../component/Textview"

import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import ApiCall from '../util/Network';
import Loader from '../component/AnimatedLoader';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-simple-toast';
import Server from "../util/Server";

function Webview(props) {
    const { info, navigation } = props;

    const [isYoutube, setIsYoutube] = useState(false);

    const [link, setLink] = useState(null)
    //link = navigation.getParam("link", null)
    const [loader, setLoader] = useState(false)

    const startUpScreen = navigation.getParam("startUpScreen", false);
    //const user_id = navigation.getParam("user_id", null);

    useEffect(() => {

        if (startUpScreen) {
            loadStartupTutorial();

        } else {
            let url = navigation.getParam("link", null);
            console.log(url);
            setLink(fixVideoLink(url));
        } 

    }, []);

    function loadStartupTutorial() {
        setLoader(true);

        ApiCall.postRequest(Server.tutorials, {}, (response, error) => {
            setLoader(false);
            console.log({response})
            if (response != undefined && response.status == "success") {
                if (response.Tutorials.length > 0) {
                    let url = fixVideoLink(response.Tutorials[0].tutorials_video);
                    console.log(url);
                    
                    setLink(url);
                }
            }
        });
    }

    function fixVideoLink(url) {
        if (!url) {
            Toast.show('Invalid video url!');
            return null;
        }

        let val = url;
        let r, rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

        if ( rx.test(url) ) {
            r = url.match(rx);
            if (r) {
                val = `https:://youtube.com/embed/${r[1]}?rel=0`;
                setIsYoutube(true);
            }
        }

        return val;
    }

    function click_back() {
        props.navigation.goBack()
    }

    const close_tutorial = () => {
        click_back();
    }

    return (
        <View style={CSS.Favcontainer}>
            <Loader loader={loader} />

            {
                startUpScreen ?

                    <View style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        padding: 10,
                        borderRadius: 20
                    }}>
                        <TouchableOpacity
                            onPress={close_tutorial}
                        >
                            <Imageview
                                url={GlobalImages.close}
                                width={Platform.OS == "ios" ? 15 : 15}
                                height={Platform.OS == "ios" ? 15 : 15}
                                image_type={"local"}
                                resize_mode={"contain"}
                                tint_color={Design.white}
                            />
                        </TouchableOpacity>

                    </View>
                    :
                    <View style={{ flexDirection: 'row', marginTop: Platform.OS == "ios" ? 30 : 10, alignItems: 'center', marginHorizontal: Platform.OS == "ios" ? 7 : 5 }}>
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
                                text={'Tutorial'}
                                font_family={"medium"}
                                color={Design.black}
                                text_align={'center'}
                                font_size={Design.font_20}
                            />
                        </View>
                        <View style={{ height: Platform.OS == "ios" ? 55 : 50, width: Platform.OS == "ios" ? 55 : 50 }} />
                    </View>
            }

            {
                link ?
                <WebView
                    javaScriptEnabled={true}
                    injectedJavaScript={`window.testMessage = "hello world"`}
                    startInLoadingState={true}
                    useWebKit={false}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                    automaticallyAdjustContentInsets={true}
                    source={{ uri: link }}
                /> : null
            }

            {
                startUpScreen ?
                    <View style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        bottom: 10,
                        right: 10,
                        zIndex: 1,
                        paddingVertical: 5,
                        paddingHorizontal: 15,
                        borderRadius: 10
                    }}>
                        <TouchableOpacity
                            onPress={close_tutorial}
                        >
                            <Textview
                                text={'Skip'}
                                font_family={"medium"}
                                color={Design.white}
                                text_align={'center'}
                                font_size={Design.font_20}
                                text_click={close_tutorial.bind(this)}
                            />
                        </TouchableOpacity>

                    </View>
                    :
                    null
            }

        </View>
    )
}

const mapStateToProps = state => ({
    info: state.info.info,
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Webview);