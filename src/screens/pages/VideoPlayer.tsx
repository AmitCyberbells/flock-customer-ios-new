import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video, { OnBufferData, OnVideoErrorData, VideoRef } from 'react-native-video';
import { useEffect, useRef, useState } from 'react';
import ScreenProps from '../../types/ScreenProps';
import Loader from '../../components/Loader';
import { Colors } from '../../constants/Colors';
import PageHeader from '../../navigations/PageHeader';
import NoData from '../../components/NoData';
import { Environment } from '../../../env';

const VideoPlayer: React.FC<ScreenProps<'VideoPlayer'>> = (props) => {
    const { route, navigation } = props;
    const [loader, setLoader] = useState<boolean>(true);
    const videoRef = useRef(null);
    const [pause, pauseVideo] = useState<boolean>(false);
    //const background = { uri: 'https://web.cyberbells.com/development/Flock/Videos/flock_intro.mp4' };
    //const background = { uri: 'https://getflock.io/wp-content/uploads/videos/flock_intro_compressed.mp4' };
    const background = { uri: route?.params['link'] ?? '' };
    const pageTitle = route?.params['title'] ?? '';
    const isIos = Platform.OS === 'ios';


    useEffect(() => {
        navigation?.addListener('focus', () => pauseVideo(false))
        console.log(background.uri)
    }, []);

    const onBuffer = (event: OnBufferData) => {
        setLoader(event.isBuffering);
    }

    const onError = (error: OnVideoErrorData) => {
        console.log('onvideo error: ', { error })
    }

    const close_tutorial = () => {
        navigation?.goBack();
    }

    const onPressLearnMore = () => {
        pauseVideo(true);

        navigation?.navigate('WebPage', {
            title: 'How to use flock?',
            link: Environment.UserGuideLink
        });
    }

    return (
        <View style={styles.container}>
            <Loader isLoading={loader} />

            <PageHeader {...props} title={pageTitle} showBackButton />

            {background.uri ? <Video
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
                paused={pause}
                style={styles.backgroundVideo}
            /> : <NoData />}

            <TouchableOpacity style={{
                height: isIos ? 60 : 50,
                marginTop: 10,
                backgroundColor: Colors.primary_color_orange,
                justifyContent: 'center',
                position: 'absolute',
                bottom: 0,
                width: '100%'

            }} onPress={onPressLearnMore}>

                <Text style={{
                    color: Colors.white,
                    fontSize: 20,
                    alignSelf: 'center'
                }}>Learn More</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
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

export default VideoPlayer;