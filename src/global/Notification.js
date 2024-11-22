import { PermissionsAndroid } from 'react-native';
import firebaseApp from '@react-native-firebase/app';
import messaging from "@react-native-firebase/messaging";
import Notifications from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native';
import { Environment } from './Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

var _props
var _isIOS = Platform.OS == 'ios'
var _notificationData = null
var _dispatch = null

export async function FCM_init(props) {
    _props = props
    firebaseConfig(async (status) => {
        if (status) {
            permissionGranted(status)
        }
    })
}

export async function permissionGranted(status) {
    if (_isIOS) {
        var perGranted = await getNotificationPermission()
        if (perGranted) {
            firebaseMethods()
        }
    }
    else {
        var checkPerm = await checkNotificationPermission()
        if (checkPerm) {
            firebaseMethods()
        }
    }
}



//config, permissions
//................................................................................

async function firebaseConfig(callback) {
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

async function saveNotificationStateToSharedPref(state) {
    var value = state;
    if (!localFile.notificationInteraction) {
        setNotifcationState(state)
        // setNotifcationInteraction(state)
    } else {
        value = await getNotifcationState()
    }

    value ? allowNotification(_dispatch, false) : notAllowNotification(_dispatch, false)
}

async function checkNotificationPermission() {

    console.log('checking permission')

    var check = false

    if (_isIOS) {

        check = await messaging().hasPermission()

    } else {

        console.log('osVersion : ' + Platform.Version)

        if (Platform.Version > 32) {

            check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

        } else {
            check = true;
        }
    }

    //  saveNotificationStateToSharedPref(check)

    return check
}

async function getNotificationPermission() {
    var state = false;
    if (_isIOS) {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        state = enabled

    } else {

        await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

        const granted = await PermissionsAndroid.request(

            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            // {
            //   'title': '',
            //   'message': ''
            // }
        )
        var result
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            result = true
        } else {
            result = false
        }
        state = result
    }

    //saveNotificationStateToSharedPref(state)

    return state;
}


// methods
//................................................................................

function firebaseMethods() {
    generateToken()
    createChannel()
    onMessageReceived_Foreground()
    onMessageReceived_Background()
    // notificationClickOnStart()
    // notificationClickOnBackground()
    // notificationClickOnForeground()
}


function createChannel() {
    try {
        Notifications.createChannel(
            {
                channelId: '123',
                channelName: 'My channel',
                channelDescription: 'A channel to categorise your notifications',
                soundName: 'default',
                importance: 4,
                vibrate: true,
            },
            created => console.log(`createChannel returned '${created}'`),
        );
    } catch (e) {
        console.log('on Create channel issue ::: ' + e)
    }
}

function generateToken() {

    firebaseApp.messaging().getToken()
        .then(async fcmToken => {
            if (fcmToken) {
                console.log("get_get_fcm_token_new")
                console.log(fcmToken)
                //set_device_token(fcmToken)
                await AsyncStorage.setItem("fcmToken", fcmToken);

            } else {
                console.log('else')
            }
        });

}


// function tokenDBRef(token) {
//     var database = null
//     if (_isIOS) {
//         database = db()
//     } else {
//         database = firebaseApp.app().database('https://actorsgym-802ff-default-rtdb.firebaseio.com/')
//     }

//     return database.ref(`/tokens/${token}`);
// }

// export async function addTokenFB(token) {
//     var updated
//     try {
//         var data = {
//             deviceToken: token,
//             deviceType: _isIOS ? 'ios' : 'android'
//         }
//         await tokenDBRef(token)
//             .set(data)
//             .then(() => {
//                 updated = true
//             }).catch((error) => {
//                 console.log('error  on exception 1 ', JSON.stringify(error))
//                 updated = false
//             });
//     } catch (e) {
//         console.log('error  on exception 2 ', e)
//         updated = false
//     }
//     return updated;
// }


// export async function delteTokenFB(token) {
//     var status = false;
//     await tokenDBRef(token).remove().then(() =>
//         status = true
//     ).catch((error) => status = false)
//     return status;
// }


//Notification Listeners
//................................................................................

function onMessageReceived_Foreground() {
    try {
        messaging().onMessage(async remoteMessage => {
            _notificationData = remoteMessage.data
            if (_isIOS) {
                PushNotificationIOS.addNotificationRequest({
                    id: remoteMessage.messageId,
                    body: remoteMessage.notification.body,
                    title: remoteMessage.notification.title,
                    // userInfo: remoteMessage.data,
                });
            } else {
                Notifications.localNotification({
                    channelId: '123',
                    message: remoteMessage.notification.body,
                    title: remoteMessage.notification.title,
                });
            }
            // console.log('on Message received', JSON.stringify(remoteMessage));
        })

    } catch (e) {
        console.log('foreground onMessage ::' + e)
    }
}

function onMessageReceived_Background() {
    try {
        // messaging().setBackgroundMessageHandler(remoteMessage => {
        //     // _notificationData = remoteMessage.data
        //     // playSound = true
        //     // sound = true
        //     console.log('Message handled in the background!', remoteMessage);
        // })
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            _notificationData = remoteMessage.data
            playSound = true
            sound = true
            console.log('Message handled in the background!', remoteMessage);
            console.log('Your message was handled in background');
        });
    } catch (e) {
        console.log('background error ::' + e)
    }
}




// Notification clicks....
//................................................................................

//onForeground
function notificationClickOnForeground() {
    try {
        Notifications.configure({
            onNotification: function (notification) {
                if (notification.foreground && notification.userInteraction) {
                    clickAction()
                }
            },
        })
    } catch (e) {
        console.log('foreGround issue :: ' + e)
    }
}

// onStart
function notificationClickOnStart() {
    //
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                _notificationData = remoteMessage.data
                clickAction()
                // console.log(
                //     'Notification caused app to open from quit state:',
                //     remoteMessage,
                // );
            }
        });
}

//background
function notificationClickOnBackground() {
    messaging().onNotificationOpenedApp(remoteMessage => {
        _notificationData = remoteMessage.data
        clickAction()
        // console.log(
        //     'Notification caused app to open from background state:',
        //     remoteMessage,
        // );
    });
}


function clickAction() {
    if (_notificationData != null) {
        var url = _notificationData.url
        _notificationData = null
        launchUrl(url)
    }
}