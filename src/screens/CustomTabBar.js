import React, { useEffect, useState } from 'react';
import {
    View,
    Platform,
} from 'react-native';
import CustomTabBar_IOS from "../screens/CustomTabBar_IOS"
import CustomTabBar_Android from "../screens/CustomTabBar_Android"
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCall from '../util/Network';
import Server from '../util/Server';

let userid;

export default function CustomTabBar(props) {

    const { navigation, focused } = props;
    const routes = navigation.state.routes;
    const [index, set_index] = useState(0)

    useEffect(() => {
        fetchUser();

    }, []);

    async function fetchUser() {
        let value = await AsyncStorage.getItem('userid');
        userid = value;
        updateDeviceToken();
    };

    async function updateDeviceToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        
        if (!fcmToken) return;

        var data = new FormData();
        data.append('user_id', userid);
        data.append('device_token', fcmToken);
        data.append('device_type', Platform.OS);

        ApiCall.postRequest(Server.update_device_token, data, (response, error) => {
            console.log({ response })

            if (error || response === undefined) {
                return;
            }

            if (response.status == 'success') {
               
            } else {
                console.log("er = " + error)
            }
        })
    }

    
    return (
        <View>

            {
                Platform.OS == "ios"
                    ?
                    <CustomTabBar_IOS navigation={props.navigation} />
                    :
                    <CustomTabBar_Android navigation={props.navigation} />
            }
        </View>
    );

}
