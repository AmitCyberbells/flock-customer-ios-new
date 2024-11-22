/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import globalStore from './src/store/globalStore';
import React from 'react';

import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const store = globalStore;

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
)


PushNotification.configure({
  onRegister: function (pushtoken) {
    console.log("get_get_fcm_token_new")

    firebase.messaging().getToken()
        .then(async fcmToken => {
            if (fcmToken) {
                console.log("get_get_fcm_token_new")
                console.log(fcmToken)
                // set_device_token(fcmToken)
                //await AsyncStorage.setItem("fcmToken", fcmToken);

            } else {
                console.log('else')
            }
        });
    
    // firebase.messaging().getToken()
    //   .then(fcmToken => {
    //     if (fcmToken) {
    //       console.log("get_get_fcm_token_new")
    //       console.log(fcmToken)
    //     } else {
    //       console.log('else')
    //     }
    //   });

    PushNotification.createChannel(
      {
        channelId: "123", // (required)
        channelName: "Flirteen", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        // importance: 4, 
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  },


  onNotification: function (notification) {

    console.log('NOTIFICTION_CALL')

    if (notification.userInteraction) {
      if (notification.id == undefined) {
        console.log('backgroundId= ' + notification.data.id)
      }
      else {
        console.log('forgroundId= ' + notification.id)
        PushNotification.cancelLocalNotifications({ id: notification.id });

      }
      console.log('3 ' + notification)
    }
    else {

      if (notification) {
        console.log(notification)
        console.log("serverid = " + notification.data.id)
          console.log("se " + notification.data)
          
        PushNotification.localNotification({
          channelId: '123',
          id: notification.data.id,
          ticker: "My Notification Ticker",
          autoCancel: true,
         // largeIcon: "",
        //  smallIcon: "cir",
          color: "#808080",
          vibrate: true,
          vibration: 300,
          tag: 'some_tag',
          group: "group",
          ongoing: false,
          userInfo: notification.data,
          title: notification.data.title,
          message: notification.data.message,
          playSound: false,
          invokeApp: true,
          soundName: 'default',

        });
        console.log("serverid = " + notification.data)
      }
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },

  onRegistrationError: function (err) {
     console.error('2 ' + err.message, err);
  },

  senderID: "819650124616",
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});


AppRegistry.registerComponent(appName, () => RNRedux);
