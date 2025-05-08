import { DimensionValue, StyleSheet, View, ViewStyle } from "react-native";
import { isIos } from "../constants/IsPlatform";
import { SvgUri } from "react-native-svg";
import Images from "../constants/Images";
import Imageview from "./Imageview";

type FallbackProps = {
    wrapperStyle?: ViewStyle | Array<ViewStyle>,
    overlayStyle?: ViewStyle | Array<ViewStyle>,
    iosHeight?: DimensionValue,
    iosWidth?: DimensionValue,
    androidHeight?: DimensionValue,
    androidWidth?: DimensionValue,
}

const FallbackSvg: React.FC<FallbackProps> = (props) => {

    const { wrapperStyle, overlayStyle, iosHeight = 380, iosWidth = '100%', androidHeight = 320, androidWidth = '100%' } = props;

    return (
        <View style={[{
            paddingHorizontal: 10,
            marginTop: isIos ? 30 : 20
        }, wrapperStyle]}>
            <View style={[{
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 8,
                ...StyleSheet.absoluteFillObject
            }, overlayStyle]}></View>
            <Imageview
                url={Images.placeholder}
                style={{
                    width: isIos ? iosWidth : androidWidth,
                    height: isIos ? iosHeight : androidHeight
                }}
            />
        </View>
    )
}

export default FallbackSvg;