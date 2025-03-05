import { StyleSheet, Text, View } from "react-native"
import { CSS } from "../../constants/CSS"
import { Colors } from "../../constants/Colors"
import { Fonts } from "../../constants/Fonts"
import QRCode from "react-native-qrcode-svg"
import Images from "../../constants/Images"
import ScreenProps from "../../types/ScreenProps"

const QrPreview: React.FC<ScreenProps<'QrPreview'>> = (props) => {

    const data = props.route?.params['data'] || '';

    return (
        <View style={[CSS.Favcontainer, styles.container]}>

            <View style={styles.heading}>
                <Text style={styles.headingText}>
                    {'Show QR Code when you visit to Venue'}
                </Text>

            </View>

            <QRCode
                value={data}
                size={230}
                logo={Images.flock_marker}
                logoBackgroundColor='transparent'
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start", 
        alignItems: 'center'
    },
    heading: {
        height: 150,
        width: '90%',
        marginBottom: 30,
        justifyContent: "center",
        alignItems: 'center'
    },
    headingText: {
        fontFamily: 'medium',
        color: Colors.black,
        textAlign: 'center',
        fontSize: Fonts.fs_18,
        fontWeight: '600'
    }
})

export default QrPreview;