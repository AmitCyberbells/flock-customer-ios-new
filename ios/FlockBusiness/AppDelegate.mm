#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

#import "IQKeyboardManager.h"
#import <IQKeyboardManager/IQKeyboardManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"FlockBusiness";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  [FIRApp configure];
  [[IQKeyboardManager sharedManager] setEnable:YES];
  //  [FIRMessaging messaging].autoInitEnabled = YES;
  
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  
  center.delegate = self;
  self.initialProps = @{};
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.

///

/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html

/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).

/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.

- (BOOL)concurrentRootEnabled

{

  return true;

}



////Called when a notification is delivered to a foreground app.

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler

{

  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);

}



// Required to register for notifications

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings

{

 [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];

}



- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {

  [FIRMessaging messaging].APNSToken = deviceToken;

}



//- (void)application:(UIApplication *)application

//    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {

////    [FIRMessaging messaging].APNSToken = deviceToken;

//    [FIRMessaging messaging].APNSToken = deviceToken;

//    NSString *fcmToken = [FIRMessaging messaging].FCMToken;

//    NSLog(@"++APNST deviceToken : %@", deviceToken);

//    NSLog(@"++FCM device token : %@", fcmToken);

//}



//// Required for the register event.

//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken

//{

// [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];

//}







// Required for the notification event. You must call the completion handler after handling the remote notification.

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo



fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler

{

//   NSMutableDictionary* userInfoCopy = [userInfo mutableCopy];



//  userInfoCopy[@"userHasInteracted"] = @YES









//  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo];

  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];

  completionHandler(UIBackgroundFetchResultNewData);

  NSLog(@"Notification Body %@", userInfo);

}





// Required for the registrationError event.

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error

{

 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];

}



// IOS 10+ Required for localNotification event

- (void)userNotificationCenter:(UNUserNotificationCenter *)center

didReceiveNotificationResponse:(UNNotificationResponse *)response

         withCompletionHandler:(void (^)(void))completionHandler

{

  [RNCPushNotificationIOS didReceiveNotificationResponse:response];

  completionHandler();

}



// IOS 4-10 Required for the localNotification event.

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification

{

 [RNCPushNotificationIOS didReceiveLocalNotification:notification];

}







@end
