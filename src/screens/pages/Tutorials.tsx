import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import ScreenProps from "../../types/ScreenProps";
import { Colors } from "../../constants/Colors";
import Loader from "../../components/Loader";
import Imageview from "../../components/Imageview";
import Images from "../../constants/Images";
import Textview from "../../components/Textview";
import { Fonts } from "../../constants/Fonts";
import NoData from "../../components/NoData";
import Tutorial from "../../types/Tutorial";
import Request from "../../services/Request";
import Toast from "react-native-toast-message";
import BoxView from "../../components/BoxView";
import Utils from "../../services/Utils";
import WebView from "react-native-webview";
import TutorialItem from "../../components/TutorialItem";
import { Environment } from "../../../env";

const Tutorials: React.FC<ScreenProps<'Tutorials'>> = (props) => {
    const [loader, setLoader] = useState<boolean>(false);
    const isIos = Platform.OS === 'ios';
    const [tutorials, setTutorials] = useState<Array<Tutorial>>([]);

    useEffect(() => {
        fetch_tutorials();
    }, [])

    const fetch_tutorials = () => {
        setLoader(true);

        Request.tutorials((success, error) => {
            setLoader(false);

            if (success) {
                setTutorials(success.data)
            } else {
                Toast.show({
                    type: 'MtToastError',
                    text1: error.message,
                    position: 'bottom'
                })
            }
        })
    }

    const onPressLearnMore = () => {
        props.navigation?.navigate('WebPage', { link: Environment.UserGuideLink, title: 'How to use flock?' });
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: Colors.white,
            paddingBottom: 70
        }}>
            <Loader isLoading={loader} />
            {tutorials.length
                ?
                <FlatList
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    data={tutorials}
                    renderItem={({ item }) => <TutorialItem {...props} tutorial={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    style={{
                        paddingHorizontal: 10
                    }}
                />

                : <NoData isLoading={loader} />
            }

            <TouchableOpacity activeOpacity={0.9} style={{
                height: isIos ? 60 : 50,
                backgroundColor: Colors.primary_color_orange,
                justifyContent: 'center',
                position: 'absolute',
                bottom: 0,
                width: '100%'

            }} onPress={onPressLearnMore}>

                <Text style={{
                    color: Colors.white,
                    fontSize: Fonts.fs_20,
                    alignSelf: 'center'
                }}>Learn More</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Tutorials;