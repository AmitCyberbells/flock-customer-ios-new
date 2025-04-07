import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import ScreenProps from "../../types/ScreenProps";
import { Colors } from "../../constants/Colors";
import Loader from "../../components/Loader";
import WebView from "react-native-webview";
import PageHeader from "../../navigations/PageHeader";

const WebPage: React.FC<ScreenProps<'WebPage'>> = (props) => {
    const [loader, setLoader] = useState<boolean>(false);
    const pageTitle = props.route?.params['title'] || '';
    const link = props.route?.params['link'] || '';
   

    useEffect(() => {

    }, [])

    return (
        <View style={{
            flex: 1,
            backgroundColor: Colors.white,
            paddingBottom: 70
        }}>
            <Loader isLoading={loader} />

            <PageHeader {...props} title={pageTitle} showBackButton />

            <WebView
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
    );
}

export default WebPage;