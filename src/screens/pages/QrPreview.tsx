import { StyleSheet, Text, View } from "react-native"
import { CSS } from "../../constants/CSS"
import { Colors } from "../../constants/Colors"
import { Fonts } from "../../constants/Fonts"
import QRCode from "react-native-qrcode-svg"
import Images from "../../constants/Images"
import ScreenProps from "../../types/ScreenProps"

const QrPreview: React.FC<ScreenProps<'QrPreview'>> = (props) => {

    const data = props.route?.params['data'] || '';
    const couponCode = props.route?.params['coupon'] || '';

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
                logo={Images.FlockBird}
                logoBackgroundColor='transparent'
            />

            {couponCode ? <View style={styles.chipContainer}>
                <Text style={styles.chip}>Coupon code: {couponCode}</Text>
            </View> : null}

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
        fontFamily: Fonts.medium,
        color: Colors.black,
        textAlign: 'center',
        fontSize: Fonts.fs_18,
        fontWeight: '600'
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6, // Adds spacing between items (React Native 0.71+)
        marginTop: 20,
    },
    chip: {
        fontSize: Fonts.fs_13,
        color: Colors.grey,
        fontFamily: Fonts.medium,
        backgroundColor: Colors.whitesmoke,
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
        overflow: "hidden",
    },
})


export default QrPreview;