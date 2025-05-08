import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video, { OnBufferData, OnVideoErrorData, VideoRef } from 'react-native-video';
import { useEffect, useRef, useState } from 'react';
import ScreenProps from '../../types/ScreenProps';
import Loader from '../../components/Loader';
import { Colors } from '../../constants/Colors';
import PageHeader from '../../navigations/PageHeader';
import NoData from '../../components/NoData';
import { Environment } from '../../../env';
import Textview from '../../components/Textview';
import { Fonts } from '../../constants/Fonts';
import { isIos } from '../../constants/IsPlatform';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StartupAd: React.FC<ScreenProps<'StartupAd'>> = (props) => {
    const { route, navigation } = props;
    const [loader, setLoader] = useState<boolean>(true);
    const videoRef = useRef(null);
    const [pause, pauseVideo] = useState<boolean>(false);
    //const background = { uri: 'https://web.cyberbells.com/development/Flock/Videos/flock_intro.mp4' };
    //const background = { uri: 'https://getflock.io/wp-content/uploads/videos/flock_intro_compressed.mp4' };
    const background = { uri: 'https://getflock.io/wp-content/uploads/videos/flock_intro_compressed.mp4' };


    useEffect(() => {
        navigation?.addListener('focus', () => pauseVideo(false))
        console.log(background.uri)
        AsyncStorage.setItem('startupAd', 'true');
    }, []);

    const onBuffer = (event: OnBufferData) => {
        setLoader(event.isBuffering);
    }

    const onError = (error: OnVideoErrorData) => {
        console.log('onvideo error: ', { error })
    }

    const close_tutorial = () => {
        pauseVideo(true);
        navigation?.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <Loader isLoading={loader} />

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
            /> : <NoData isLoading={loader} />}

            <View style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.5)',
                bottom: isIos ? 40 : 10,
                right: isIos ? 20 : 10,
                zIndex: 101,
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderRadius: 10
            }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={close_tutorial}
                >
                    <Textview
                        text={'Skip'}
                        style={{
                            fontFamily: Fonts.medium,
                            color: Colors.white,
                            textAlign: 'center',
                            fontSize: Fonts.fs_20
                        }}

                        text_click={close_tutorial.bind(this)}
                    />
                </TouchableOpacity>

            </View>

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

export default StartupAd;