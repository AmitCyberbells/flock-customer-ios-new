import DeviceInfo from 'react-native-device-info';
import { AuthorizationStatus, FirebaseMessagingTypes, getMessaging } from "@react-native-firebase/messaging";
import Request from "./Request";
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import Utils from './Util';
import { Environment } from '../../env';
import firebaseApp from '@react-native-firebase/app';
import { isIos } from '../constants/IsPlatform';
import { useDispatch, useSelector } from 'react-redux';
import { refreshDeviceToken, subscribeNotifications } from '../store/authReducer';
import { StoreStates } from '../store/store';

const Firebase = () => {

    const _isIOS = isIos;
    const dispatch = useDispatch();
    const auth = useSelector((state: StoreStates) => state.auth)

    const firebaseConfig = async (callback: (initialized: boolean) => void) => {
        if (_isIOS) {
            if (firebaseApp.apps.length === 0) {
                const config = {
                    name: 'SECONDARY_APP',
                };
                const firebaseConfig = Environment.Firebase.config();

                await firebaseApp.initializeApp(firebaseConfig, config)
                    .then(async res => {
                        callback(true)
                    }).catch((error) => {
                        callback(false)
                    });

            } else {
                firebaseApp.app()
                callback(true)
            }
        } else {
            callback(true)
        }
    }

    const updateDeviceToken = async () => {
        console.log('device token...')
        if (auth.deviceToken) {
            console.log('device token is already present ', auth.deviceToken)
            return;
        }

        const fcmToken = await getMessaging().getToken();

        if (fcmToken) {
            console.log("fcm token: ", fcmToken)

            Request.updateDeviceToken({
                token: fcmToken,
                type: Platform.OS,
                device_agent: await DeviceInfo.getUserAgent()
            }, (success, error) => {
                if (success) {
                    dispatch(refreshDeviceToken({ deviceToken: fcmToken }))
                }
                console.log('device token update ..', { success }, { error })
            })
        } else {
            console.log('fcm token not found!')
        }
    }

    return { firebaseConfig, updateDeviceToken }
}

export const notifeeSettings = () => {
    const onMessageReceivedForeground = async () => {
        console.log('on message received: ')
        // Request permissions (required for iOS)
        if (isIos) await notifee.requestPermission()

        try {
            getMessaging().onMessage(async remoteMessage => {
                console.log(remoteMessage)
                if (isIos) {
                    /* PushNotificationIOS.addNotificationRequest({
                        id: remoteMessage.messageId,
                        body: remoteMessage.notification.body,
                        title: remoteMessage.notification.title,
                        // userInfo: remoteMessage.data,
                    }); */
                } else {
                    // Display a notification
                    showNotification(remoteMessage)
                }
                // console.log('on Message received', JSON.stringify(remoteMessage));
            })

        } catch (e) {
            console.log('foreground onMessage ::' + e)
        }
    }

    const onMessageReceivedBackground = async () => {
        notifee.onBackgroundEvent(async ({ type, detail }) => {
            const { notification, pressAction } = detail;

            // Check if the user pressed the "Mark as read" action
            if (type === EventType.ACTION_PRESS && pressAction?.id === 'mark-as-read') {
                // Update external API
                /* await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
                  method: 'POST',
                }); */

                // Remove the notification
                if (notification?.id) { await notifee.cancelNotification(notification?.id) };
            }
        });
    }

    const showNotification = async (message: FirebaseMessagingTypes.RemoteMessage) => {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'flockloyalty-andx' + Utils.generateUniqueString(6),
            name: 'Default Channel',
        });

        await notifee.displayNotification({
            title: message.notification?.title,
            body: message.notification?.body,
            android: {
                channelId,
                //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: Utils.generateUniqueString(16),
                    mainComponent: 'Venues'
                },
            },
        });
    }

    const getNotificationPermission = async () => {
        var accessGranted = false;

        if (isIos) {
            const authStatus = await getMessaging().requestPermission();
            const enabled =
                authStatus === AuthorizationStatus.AUTHORIZED ||
                authStatus === AuthorizationStatus.PROVISIONAL;
            accessGranted = enabled

        } else {

            await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            )

            accessGranted = (granted === PermissionsAndroid.RESULTS.GRANTED)
        }
        console.log('notification permission: ', accessGranted)
        if (accessGranted) {
            onMessageReceivedForeground();
            onMessageReceivedBackground();
        }

        return accessGranted;
    }

    return {getNotificationPermission}
}

export default Firebase;