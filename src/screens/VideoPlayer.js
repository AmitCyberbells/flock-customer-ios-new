import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const VideoPlayer = (props) => {
    const { actions, info } = props;
    const [loader, setLoader] = useState(true);
    const videoRef = useRef(null);
    //const background = { uri: 'https://web.cyberbells.com/development/Flock/Videos/flock_intro.mp4' };
    //const background = { uri: 'https://getflock.io/wp-content/uploads/videos/flock_intro_compressed.mp4' };
    const [background, setBackground] = useState({ uri: props.navigation.getParam('link') ?? '' });

    useEffect(() => {
        console.log(background)
    }, []);

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

    const onPressLearnMore = () => {
        props.navigation.navigate('MoreTutorials');
    }

    return (
        <View style={styles.container}>

            <View style={styles.header_nav}>
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
            </View>

            <View style={styles.loader}>
                <AnimatedLoader loader={loader} />
            </View>

            <Video
                source={background}
                // Store reference  
                ref={videoRef}
                controls={false}
                // Callback when remote video is buffering                                      
                onBuffer={onBuffer}
                // Callback when video cannot be loaded              
                onError={onError}
                onEnd={close_tutorial}
                resizeMode={"stretch"}
                paused={false}
                style={styles.backgroundVideo}
            />

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

var styles = StyleSheet.create({
    loader: {
        position: 'absolute',
        top: 200,
        height: '50%',
        width: '100%',
        margin: 'auto'
    },
    header_nav: {
        flexDirection: 'row',
        marginTop: Platform.OS == "ios" ? 50 : 10,
        alignItems: 'center',
        marginHorizontal: Platform.OS == "ios" ? 7 : 5
    },
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
        zIndex: -1
    },
});

const mapStateToProps = state => ({
    info: state.info.info
});

const ActionCreators = Object.assign({}, userdata);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);