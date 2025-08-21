import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import ScreenProps from "../../types/ScreenProps";
import { Colors } from "../../constants/Colors";
import Loader from "../../components/Loader";
import WebView from "react-native-webview";
import PageHeader from "../../navigations/PageHeader";
import { useTheme } from "@react-navigation/native";
import { useThemeColors } from "../../constants/useThemeColors";

const WebPage2: React.FC<ScreenProps<'WebPage2'>> = (props) => {
    const [loader, setLoader] = useState<boolean>(false);
    const pageTitle = props.route?.params['title'] || '';
    const link = props.route?.params['link'] || '';
   const theme =useThemeColors();

    useEffect(() => {

    }, [])

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.inputBackground,
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

export default WebPage2;