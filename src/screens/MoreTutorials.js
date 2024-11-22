import { connect } from 'react-redux';
import * as userdata from '../action/count';
import { bindActionCreators } from 'redux';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-simple-toast';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Design from '../design/Design';
import Loader from '../component/AnimatedLoader';
import Imageview from '../component/Imageview';
import Textview from '../component/Textview';
import GlobalImages from '../global/GlobalImages';

function MoreTutorials(props) {

    const link = "https://getflock.io/user-guide";
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        console.log('loading...', link);
    });

    const click_back = () => {
        props.navigation.goBack();
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

            < WebView
                javaScriptEnabled={true}
                injectedJavaScript={`window.testMessage = "hello world"`}
                startInLoadingState={true}
                useWebKit={false}
                domStorageEnabled={true}
                scalesPageToFit={true}
                automaticallyAdjustContentInsets={true}
                source={{ uri: link }}
            />

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

export default connect(mapStateToProps, mapDispatchToProps)(MoreTutorials);