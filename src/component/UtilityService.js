import { Linking, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher';

const open_phone_setting = () => {
    var packagee = DeviceInfo.getBundleId();
    if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
    } else {
        IntentLauncher.startActivity({
            action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
            data: 'package:' + packagee
        })
    }
}

export { open_phone_setting };