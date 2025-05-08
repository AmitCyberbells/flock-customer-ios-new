import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

const RippleLoader: React.FC = () => (
    <View style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 99
    }}>
        <LottieView
            style={{
                width: "100%",
                height: "100%",
                alignSelf: 'center'
            }}
            autoPlay
            loop
            source={require("../assets/ripple.json")}
        />
    </View>
)

export default RippleLoader;