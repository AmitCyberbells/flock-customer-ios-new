import DeviceInfo from 'react-native-device-info';
import { AuthorizationStatus, FirebaseMessagingTypes, getMessaging } from "@react-native-firebase/messaging";
import Request from "./Request";
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import Utils from './Utils';
import { Environment } from '../../env';
import firebaseApp from '@react-native-firebase/app';
import { isIos } from '../constants/IsPlatform';
import { useDispatch, useSelector } from 'react-redux';
import { refreshDeviceToken, subscribeNotifications } from '../store/authReducer';
import { StoreStates } from '../store/store';

// Global flag to prevent multiple initializations
let isFirebaseInitialized = false;

const Firebase = () => {

    const _isIOS = isIos;
    const dispatch = useDispatch();
    const auth = useSelector((state: StoreStates) => state.auth)

    // Initialize Firebase and background handlers
    const initializeFirebase = async () => {
        // Prevent multiple initializations
        if (isFirebaseInitialized) {
            console.log('Firebase already initialized, skipping...');
            return;
        }

        console.log('Initializing Firebase background handlers...');
        isFirebaseInitialized = true;

        // Helper function to show notifications
        const showNotification = async (message: FirebaseMessagingTypes.RemoteMessage) => {
            try {
                // Create a unique ID for the notification
                const notificationId = message.messageId || `notification_${Date.now()}_${Math.random()}`;
                
                // Create a channel (required for Android)
                const channelId = await notifee.createChannel({
                    id: 'flockloyalty-default',
                    name: 'Default Channel',
                    sound: 'default',
                    importance: 4, // High importance
                });

                await notifee.displayNotification({
                    id: notificationId, // Add unique ID
                    title: message.notification?.title || 'Flock Notification',
                    body: message.notification?.body || 'You have a new notification',
                    data: message.data,
                    android: {
                        channelId,
                        //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                        // pressAction is needed if you want the notification to open the app when pressed
                        pressAction: {
                            id: 'default',
                            mainComponent: 'Venues'
                        },
                    },
                    ios: {
                        // iOS specific options
                        foregroundPresentationOptions: {
                            badge: true,
                            sound: true,
                            banner: true,
                            list: true,
                        },
                        // Enable notification display for iOS
                        critical: false,
                    },
                });
            } catch (error) {
                console.error('Error displaying notification:', error);
            }
        };

        // Register background message handler (ONLY ONCE)
        getMessaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Background message received:', remoteMessage);
            
            // Handle background notification data
            if (remoteMessage.data) {
                console.log('Background notification data:', remoteMessage.data);
                
                // Display notification for background messages
                await showNotification(remoteMessage);
                
                // You can add custom logic here to handle specific background notifications
                // For example, updating local storage, making API calls, etc.
            }
            
            // Return a promise to indicate the background task is complete
            return Promise.resolve();
        });

        console.log('Firebase background handlers initialized successfully');
    };

    const firebaseConfig = async (callback: (initialized: boolean) => void) => {
        if (_isIOS) {
            if (firebaseApp.apps.length === 0) {
                const config = {
                    name: 'SECONDARY_APP',
                };
                const firebaseConfig = Environment.Firebase.config();

                await firebaseApp.initializeApp(firebaseConfig, config)
                    .then(async res => {
                        // Initialize background handlers after Firebase is configured
                        await initializeFirebase();
                        callback(true)
                    }).catch((error) => {
                        callback(false)
                    });

            } else {
                firebaseApp.app()
                // Initialize background handlers
                await initializeFirebase();
                callback(true)
            }
        } else {
            // Initialize background handlers for Android
            await initializeFirebase();
            callback(true)
        }
    }

    const updateDeviceToken = async () => {
        console.log('device token...')
        if (auth.deviceToken) {
            console.log('device token is already present ', auth.deviceToken)
            return;
        }
        console.log('.. fetch device token ...')
        await getMessaging().requestPermission();
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
    // Flag to prevent duplicate foreground handlers
    let isForegroundHandlerRegistered = false;

    const onMessageReceivedForeground = async () => {
        // Prevent duplicate registration
        if (isForegroundHandlerRegistered) {
            console.log('Foreground handler already registered, skipping...');
            return;
        }

        console.log('Registering foreground message handler...');
        isForegroundHandlerRegistered = true;

        // Request permissions (required for iOS)
        if (isIos) await notifee.requestPermission()

        try {
            getMessaging().onMessage(async remoteMessage => {
                console.log('Foreground message received:', remoteMessage)
                // Display notification for both iOS and Android
                await showNotification(remoteMessage)
            })

        } catch (e) {
            console.log('foreground onMessage ::' + e)
        }
    }

    const showNotification = async (message: FirebaseMessagingTypes.RemoteMessage) => {
        try {
            // Create a unique ID for the notification
            const notificationId = message.messageId || `notification_${Date.now()}_${Math.random()}`;
            
            // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'flockloyalty-default',
                name: 'Default Channel',
                sound: 'default',
                importance: 4, // High importance
            });

            await notifee.displayNotification({
                id: notificationId, // Add unique ID
                title: message.notification?.title || 'Flock Notification',
                body: message.notification?.body || 'You have a new notification',
                data: message.data,
                android: {
                    channelId,
                    //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                    // pressAction is needed if you want the notification to open the app when pressed
                    pressAction: {
                        id: 'default',
                        mainComponent: 'Venues'
                    },
                },
                ios: {
                    // iOS specific options
                    foregroundPresentationOptions: {
                        badge: true,
                        sound: true,
                        banner: true,
                        list: true,
                    },
                    // Enable notification display for iOS
                    critical: false,
                },
            });
        } catch (error) {
            console.error('Error displaying notification:', error);
        }
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
        }

        return accessGranted;
    }

    return {getNotificationPermission}
}

export default Firebase;