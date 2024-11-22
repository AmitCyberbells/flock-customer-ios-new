import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import { useEffect, useRef, useState } from 'react';
import Imageview from '../component/Imageview';
import GlobalImages from '../global/GlobalImages';
import Design from '../design/Design';
import Textview from '../component/Textview';
import AnimatedLoader from '../component/AnimatedLoader';
import WebView from 'react-native-webview';

const StartUpAd = (props) => {
    const { actions, info } = props;
    const [loader, setLoader] = useState(true);
    const videoRef = useRef(null);
    //const background = { uri: 'https://web.cyberbells.com/development/Flock/Videos/flock_intro.mp4' };
    const background = { uri: 'https://getflock.io/wp-content/uploads/videos/flock_intro_compressed.mp4' };


    useEffect(() => {
        console.log('startup ad loading..')
    })

    const onBuffer = (event) => {
        setLoader(event.isBuffering);
    }

    const onError = (e) => {
        console.log({ e })
    }

    const click_back = () => {
        props.navigation.goBack()
    }

    const close_tutorial = () => {
        click_back();
    }

    return (
        <View style={styles.container}>
            <View style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.5)',
                top: Platform.OS == "ios" ? 50 : 10,
                right: Platform.OS == 'ios' ? 20 : 10,
                zIndex: 10000,
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

            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <AnimatedLoader loader={loader} />
            </View>

            <Video
                // Can be a URL or a local file.
                source={background}
                // Store reference  
                ref={videoRef}
                //controls={true}
                // Callback when remote video is buffering                                      
                onBuffer={onBuffer}
                // Callback when video cannot be loaded              
                onError={onError}
                onEnd={close_tutorial}
                paused={false}
                resizeMode={'stretch'}
                style={styles.backgroundVideo}
                ufferConfig={{
                    minBufferMs: 15000,
                    maxBufferMs: 50000,
                    bufferForPlaybackMs: 2500,
                    bufferForPlaybackAfterRebufferMs: 5000
                }}
                maxBitRate={5000000}
            />

            {/* <WebView
                    javaScriptEnabled={true}
                    injectedJavaScript={`window.testMessage = "hello world"`}
                    startInLoadingState={true}
                    useWebKit={false}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                    automaticallyAdjustContentInsets={true}
                    source={background}
                /> */}

            <View style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.5)',
                bottom: Platform.OS == 'ios' ? 40 : 10,
                right: Platform.OS == 'ios' ? 20 : 10,
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

        </View>
    )
}

var styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%',
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
    info: state.info.info
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartUpAd);