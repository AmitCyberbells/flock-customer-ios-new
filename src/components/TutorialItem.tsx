import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import BoxView from "./BoxView";
import Imageview from "./Imageview";
import Textview from "./Textview";
import { Colors } from "../constants/Colors";
import { Fonts } from "../constants/Fonts";
import Tutorial from "../types/Tutorial";
import ScreenProps from "../types/ScreenProps";
import Utils from "../services/Utils";
import Toast from "react-native-toast-message";
import Images from "../constants/Images";
import RootStackParamList from "../types/RootStackParamList";

type TutorialItemProp = {
    tutorial: Tutorial
}

const TutorialItem: React.FC<ScreenProps<keyof RootStackParamList> & TutorialItemProp> = (props) => {
    const { tutorial, navigation } = props;

    const playTutorial = () => {

        if (tutorial.url && Utils.isVideo(tutorial.url)) {
            navigation?.navigate("VideoPlayer", { 
                link: tutorial.url 
            });

        } else {
            Toast.show({
                type: 'MtToastError',
                text1: 'Video url is invalid!',
                position: 'bottom'
            });
        }
    }

    return (
        <BoxView cardStyle={style.item} bodyStyle={style.py_0}>
            <TouchableOpacity onPress={() => playTutorial()} style={style.playButtonContainer}>
                <Imageview
                    url={Images.play_button}
                    style={style.playButton}
                    imageType={"local"}
                    resizeMode={"stretch"}
                />
            </TouchableOpacity>

            <Textview text={tutorial.name} style={[style.title, style.px_5]} lines={2} />
            <Textview text={tutorial.description} style={[style.desc, style.px_5]} />
        </BoxView>
    )
}

const style = StyleSheet.create({
    playButtonContainer: { 
        flex: 1,
        backgroundColor: Colors.light_grey, 
        borderRadius: 8,
        paddingVertical: 10 
    },
    playButton: {
        width: 50,
        height: 50,
        alignSelf: 'center',
    },
    item: {
        flex: 1, // Ensures equal width
        margin: 0, // Margin for spacing between items
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 2,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    py_0: {
        paddingVertical: 0,
    },
    desc: {
        fontFamily: Fonts.regular,
        color: Colors.light_grey,
        fontSize: Fonts.fs_10,
        marginTop: Platform.OS === 'ios' ? 5 : 0,
    },
    title: {
        fontFamily: Fonts.medium,
        color: Colors.black,
        fontSize: Fonts.fs_18,
        marginTop: Platform.OS === 'ios' ? 8 : 4,
    },
    px_5: {
        paddingHorizontal: 5,
    },

});

export default TutorialItem;