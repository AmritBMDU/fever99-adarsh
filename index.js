import { useEffect } from 'react';
import { NativeModules, AppState, AppRegistry, Linking } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
import { createNavigationContainerRef } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import RNCallKeep from 'react-native-callkeep';
export const navigationRef = createNavigationContainerRef();


messaging().setBackgroundMessageHandler(async remoteMessage => {


    if (remoteMessage?.data?.otherData == "show") {
        try {
            await RNCallKeep.displayIncomingCall(remoteMessage.data.appointmentId, "Doctor", "Fever99");
            await RNCallKeep.backToForeground();

            RNCallKeep.addEventListener('answerCall', async ({ callUUID }) => {
                Linking.openURL(`fever99://app/Meeting/${callUUID}`)
                RNCallKeep.rejectCall(callUUID)
                navigationRef.current?.navigate(`Meeting`, { data: callUUID })
                // linkTo()
            });

            // const supported = Linking.canOpenURL("fever99://app");
            // if (supported) {
            //     Linking.openURL("fever99://app")
            // }
            // else {
            //     console.log(`Don't know how to open this URL: ${url}`);
            // }
        } catch (error) {

            console.log(error, "error")
        }
        // RNCallKeep.displayIncomingCall(remoteMessage.data.appointmentId, "Doctor", "user");
    }
    PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'fever99', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
        ticker: 'My Notification Ticker', // (optional)
        showWhen: true, // (optional) default: true
        autoCancel: false, // (optional) default: true
        largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
        //   largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
        smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
        // bigText: `${remoteMessage.data.title}`, // (optional) default: "message" prop
        // subText: "This is a subText", // (optional) default: none
        // bigPictureUrl: "ic", // (optional) default: undefined
        bigLargeIcon: 'ic_launcher', // (optional) default: undefined
        // bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
        color: 'blue', // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 5000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: 'some_tag', // (optional) add tag to message
        group: 'group', // (optional) add group to message
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
        onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

        when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
        usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
        timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

        messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

        // actions: ["Pick Call"], // (Android only) See the doc for notification actions to know more
        invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

        /* iOS only properties */
        category: '', // (optional) default: empty string
        /* iOS and Android properties */
        id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        title: `${remoteMessage.data.title}`, // (optional)
        message: `${remoteMessage.data.description}`, // (required)
        // redirectTo: `fever99://app/Service`,
        // redirectTo: `fever99://app/Meeting/${remoteMessage.data.appointmentId}`,
        userInfo: { id: remoteMessage.data.appointmentId }, // (optional) default: {} (using null throws a JSON value '<null>' error)
        playSound: true, // (optional) default: true
        soundName: 'my_sound.mp3', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
});

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: async function (notification) {
        console.log("NOTIFICATIONNOTIFICATIONNOTIFICATIONNOTIFICATIONNOTIFICATIONNOTIFICATIONNOTIFICATION:", notification);
        // await Linking.openURL("fever99://app/Meeting" + notification.redirectTo)
        console.log("a1", notification)
        // await Linking.openURL("fever99://app/Meeting/" + notification.data.id);
        console.log("a2")
        // navigationRef.current.navigate("Meeting", { data: notification.data.id })
        // Process the notification here
        // You can add other navigation logic here
    },
    // IOS ONLY: (optional) Called when Action is pressed (IOS)
    onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

    },
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
     */
    requestPermissions: true,
});



// AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
//     // Make your call here

//     return Promise.resolve();
// });

// Check if app was launched in the background and conditionally render null if so
function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        RNCallKeep.addEventListener('didReceiveStartCallAction', ({ handle, callUUID, name }) => {
            console.log("adsas")
        });
        return null;
    }

    // Render the app component on foreground launch
    return <App />;
}


AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
        // Handle foreground call actions
        // For example, display a call UI or handle incoming calls
    } else if (nextAppState === 'background') {
        // This is where you might attempt to handle background call actions
        // This is not guaranteed to work reliably and might not be a good user experience
        // For Android, you might try to start a background service or use some workaround
        console.log("background")

    }
});
AppRegistry.registerComponent(appName, () => HeadlessCheck);
