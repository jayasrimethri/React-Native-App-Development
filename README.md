# React Native Push Notification App for Vedaz Internship

This document outlines the implementation of a React Native application with push notification functionality using Firebase Cloud Messaging (FCM) for Android 15, including a native module in Kotlin, deep linking, local notification storage, and a backend simulation for triggering notifications. The solution is designed to meet the requirements of the Vedaz Software Development Internship assignment.

# Prerequisites

# Before starting, ensure the following are set up:

- **Node.js**: Version 18 or higher for managing dependencies.
- **React Native CLI**: For creating and running the project.
- **Android Studio**: With Android 15 (API level 35) SDK installed.
- **Firebase Account**: To configure FCM.
- **Java/Kotlin**: Kotlin is used for the native module.
- **Git**: For version control and submission.
- **Physical Android Device or Emulator**: For testing (Android Emulators do not support push notifications; use a physical device).

# Step-by-Step Implementation

# Step 1: Set Up the React Native Project

1. **Initialize the Project**: Create a new React Native project using the CLI:

   # npx react-native init VedazPushNotificationApp\\

   cd VedazPushNotificationApp

   **This creates a project with the default package name `com.vedazpushnotificationapp`. Update the package name to a unique value (e.g., `com.yourname.vedazapp`) in `android/app/src/main/AndroidManifest.xml` and `android/app/build.gradle` to avoid conflicts.**

2. **Install Dependencies**: Install required libraries for Firebase, notifications, and deep linking:

 **npm install @react-native-firebase/app @react-native-firebase/messaging react-native-permissions @notifee/react-native @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context**

   - `@react-native-firebase/app` and `@react-native-firebase/messaging`: For FCM integration.
   - `react-native-permissions`: For requesting notification permissions.
   - `@notifee/react-native`: For displaying and managing notifications.
   - `@react-navigation/native` and `@react-navigation/stack`: For navigation and deep linking.
   - `react-native-screens` and `react-native-safe-area-context`: For navigation compatibility.

3. **Link Dependencies**: For React Native 0.60+, autolinking handles most setup. Rebuild the project:

   # cd android && ./gradlew clean && cd ..\\

   npx react-native run-android

# Step 2: Configure Firebase Cloud Messaging

1. **Create a Firebase Project**:

   - Go to the Firebase Console.
   - Click "Add Project" and name it (e.g., `VedazPushNotificationApp`).
   - Follow the prompts to create the project.

2. **Add an Android App**:

   - In the Firebase Console, select your project and click the Android icon to add an app.
   - Provide the package name (e.g., `com.yourname.vedazapp`).
   - Download the `google-services.json` file and place it in `android/app/`.

3. **Update Gradle Files**:

   - In `android/build.gradle`, add the Google Services plugin:

     # buildscript {\\

     dependencies {\
     classpath 'com.google.gms:google-services:4.4.2'\
     }\
     }

   - In `android/app/build.gradle`, apply the plugin and add the FCM dependency:

     # apply plugin: 'com.android.application'\\

     apply plugin: 'com.google.gms.google-services'\
     \
     dependencies {\
     implementation 'com.google.firebase:firebase-messaging:24.0.3'\
     }

4. **Update AndroidManifest.xml**:

   - In `android/app/src/main/AndroidManifest.xml`, add permissions and a service for FCM:

     # &lt;manifest ...&gt;\\

     &lt;uses-permission android:name="android.permission.INTERNET" /&gt;\
     &lt;uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" /&gt;\
     &lt;application ...&gt;\
     &lt;service android:name=".MyFirebaseMessagingService" android:exported="false"&gt;\
     &lt;intent-filter&gt;\
     &lt;action android:name="com.google.firebase.MESSAGING_EVENT" /&gt;\
     &lt;/intent-filter&gt;\
     &lt;/service&gt;\
     &lt;/application&gt;\
     &lt;/manifest&gt;

# Step 3: Implement the Native Module in Kotlin

**Create a custom Firebase Messaging Service to handle notifications and integrate with Notifee for advanced notification handling.**

1. **Create the Service**:

   - In `android/app/src/main/java/com/yourname/vedazapp/`, create `MyFirebaseMessagingService.kt`:

     # package com.yourname.vedazapp\\

     \
     import android.app.NotificationManager\
     import android.content.Context\
     import androidx.core.app.NotificationCompat\
     import com.google.firebase.messaging.FirebaseMessagingService\
     import com.google.firebase.messaging.RemoteMessage\
     import io.notifee.core.Notifee\
     import io.notifee.core.models.NotificationModel\
     \
     class MyFirebaseMessagingService : FirebaseMessagingService() {\
     override fun onMessageReceived(remoteMessage: RemoteMessage) {\
     super.onMessageReceived(remoteMessage)\
     val notification = remoteMessage.notification\
     val data = remoteMessage.data\
     \
     // Handle notification payload\
     if (notification != null) {\
     displayNotification(notification.title ?: "Vedaz App", notification.body ?: "New notification")\
     }\
     \
     // Handle data payload for deep linking\
     if (data.isNotEmpty()) {\
     val notificationId = data\["notificationId"\] ?: "default"\
     val channelId = "default_channel"\
     val notificationModel = NotificationModel.Builder(this)\
     .setId(notificationId)\
     .setTitle(notification.title ?: "Vedaz App")\
     .setBody(notification.body ?: "New notification")\
     .setChannelId(channelId)\
     .setData(data)\
     .build()\
     Notifee.getInstance().displayNotification(notificationModel)\
     }\
     }\
     \
     override fun onNewToken(token: String) {\
     super.onNewToken(token)\
     // Send token to backend (implemented in backend simulation)\
     }\
     \
     private fun displayNotification(title: String, body: String) {\
     val channelId = "default_channel"\
     val notification = NotificationCompat.Builder(this, channelId)\
     .setContentTitle(title)\
     .setContentText(body)\
     .setSmallIcon(android.R.drawable.ic_dialog_info)\
     .setPriority(NotificationCompat.PRIORITY_HIGH)\
     .build()\
     val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager\
     notificationManager.notify(System.currentTimeMillis().toInt(), notification)\
     }\
     }

2. **Create Notification Channel**:

   - In `android/app/src/main/java/com/yourname/vedazapp/MainActivity.kt`, add channel creation:

     # package com.yourname.vedazapp\\

     \
     import android.app.NotificationChannel\
     import android.app.NotificationManager\
     import android.os.Build\
     import android.os.Bundle\
     import com.facebook.react.ReactActivity\
     import com.facebook.react.ReactActivityDelegate\
     import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint\
     import com.facebook.react.defaults.DefaultReactActivityDelegate\
     \
     class MainActivity : ReactActivity() {\
     override fun onCreate(savedInstanceState: Bundle?) {\
     super.onCreate(savedInstanceState)\
     createNotificationChannel()\
     }\
     \
     private fun createNotificationChannel() {\
     if (Build.VERSION.SDK_INT &gt;= Build.VERSION_CODES.O) {\
     val channel = NotificationChannel(\
     "default_channel",\
     "Default Channel",\
     NotificationManager.IMPORTANCE_HIGH\
     ).apply {\
     description = "Channel for Vedaz notifications"\
     }\
     val notificationManager: NotificationManager =\
     getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager\
     notificationManager.createNotificationChannel(channel)\
     }\
     }\
     \
     override fun getMainComponentName(): String = "VedazPushNotificationApp"\
     \
     override fun createReactActivityDelegate(): ReactActivityDelegate =\
     DefaultReactActivityDelegate(this, mainComponentName, DefaultNewArchitectureEntryPoint.fabricEnabled)\
     }

# Step 4: Implement React Native Code

1. **Set Up Navigation for Deep Linking**:

   - Create a navigation structure in `App.js`:

     # import React, { useEffect } from 'react';\\

     import { NavigationContainer } from '@react-navigation/native';\
     import { createStackNavigator } from '@react-navigation/stack';\
     import { Alert, Linking } from 'react-native';\
     import messaging from '@react-native-firebase/messaging';\
     import notifee from '@notifee/react-native';\
     import HomeScreen from './screens/HomeScreen';\
     import NotificationScreen from './screens/NotificationScreen';\
     \
     const Stack = createStackNavigator();\
     \
     const NAVIGATION_IDS = \['home', 'notification'\];\
     \
     function buildDeepLinkFromNotificationData(data) {\
     const navigationId = data?.navigationId;\
     if (!NAVIGATION_IDS.includes(navigationId)) {\
     console.warn('Unverified navigationId', navigationId);\
     return null;\
     }\
     if (navigationId === 'home') return 'vedazapp://home';\
     if (navigationId === 'notification') return 'vedazapp://notification';\
     return null;\
     }\
     \
     const linking = {\
     prefixes: \['vedazapp://'\],\
     config: {\
     screens: {\
     Home: 'home',\
     Notification: 'notification',\
     },\
     },\
     async getInitialURL() {\
     const url = await Linking.getInitialURL();\
     if (url) return url;\
     const message = await messaging().getInitialNotification();\
     return buildDeepLinkFromNotificationData(message?.data);\
     },\
     };\
     \
     export default function App() {\
     useEffect(() =&gt; {\
     const unsubscribe = messaging().onMessage(async (remoteMessage) =&gt; {\
     Alert.alert('New Message', JSON.stringify(remoteMessage));\
     const channelId = await notifee.createChannel({\
     id: 'default_channel',\
     name: 'Default Channel',\
     });\
     await notifee.displayNotification({\
     title: remoteMessage.notification?.title || 'Vedaz App',\
     body: remoteMessage.notification?.body || 'New notification',\
     android: { channelId },\
     });\
     });\
     \
     messaging().setBackgroundMessageHandler(async (remoteMessage) =&gt; {\
     const channelId = await notifee.createChannel({\
     id: 'default_channel',\
     name: 'Default Channel',\
     });\
     await notifee.displayNotification({\
     title: remoteMessage.notification?.title || 'Vedaz App',\
     body: remoteMessage.notification?.body || 'New notification',\
     android: { channelId },\
     data: remoteMessage.data,\
     });\
     });\
     \
     notifee.onForegroundEvent(({ type, detail }) =&gt; {\
     if (type === notifee.EventType.PRESS && detail.notification?.data?.navigationId) {\
     Linking.openURL(buildDeepLinkFromNotificationData(detail.notification.data));\
     }\
     });\
     \
     return unsubscribe;\
     }, \[\]);\
     \
     return (\
     &lt;NavigationContainer linking={linking}&gt;\
     &lt;Stack.Navigator&gt;\
     &lt;Stack.Screen name="Home" component={HomeScreen} /&gt;\
     &lt;Stack.Screen name="Notification" component={NotificationScreen} /&gt;\
     &lt;/Stack.Navigator&gt;\
     &lt;/NavigationContainer&gt;\
     );\
     }

2. **Create Screens**:

   - Create `screens/HomeScreen.js`:

     # import React from 'react';\\

     import { View, Text, Button } from 'react-native';\
     \
     export default function HomeScreen({ navigation }) {\
     return (\
     &lt;View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}&gt;\
     &lt;Text&gt;Welcome to Vedaz App&lt;/Text&gt;\
     &lt;Button\
     title="Go to Notification"\
     onPress={() =&gt; navigation.navigate('Notification')}\
     /&gt;\
     &lt;/View&gt;\
     );\
     }

   - Create `screens/NotificationScreen.js`:

     # import React from 'react';\\

     import { View, Text } from 'react-native';\
     \
     export default function NotificationScreen() {\
     return (\
     &lt;View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}&gt;\
     &lt;Text&gt;Notification Screen&lt;/Text&gt;\
     &lt;/View&gt;\
     );\
     }

3. **Request Permissions and Get FCM Token**:

   - Create `getFCMToken.js`:

     # import messaging from '@react-native-firebase/messaging';\\

     import { PermissionsAndroid } from 'react-native';\
     \
     export async function requestUserPermission() {\
     const authStatus = await messaging().requestPermission();\
     const enabled =\
     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||\
     authStatus === messaging.AuthorizationStatus.PROVISIONAL;\
     if (enabled) {\
     console.log('Authorization status:', authStatus);\
     return await messaging().getToken();\
     }\
     return null;\
     }\
     \
     export async function androidPermission() {\
     if (Platform.OS === 'android' && Platform.Version &gt;= 33) {\
     const granted = await PermissionsAndroid.request(\
     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS\
     );\
     return granted === PermissionsAndroid.RESULTS.GRANTED;\
     }\
     return true;\
     }

   - Update `App.js` to include permission handling:

     # import { androidPermission, requestUserPermission } from './getFCMToken';\\

     \
     export default function App() {\
     useEffect(() =&gt; {\
     const init = async () =&gt; {\
     await androidPermission();\
     const token = await requestUserPermission();\
     if (token) {\
     console.log('FCM Token:', token);\
     // Send token to backend (implemented in backend simulation)\
     }\
     };\
     init();\
     // ... rest of the code\
     }, \[\]);\
     // ... rest of the code\
     }

4. **Local Notification Storage**:

   - Create `utils/NotificationStorage.js`:

     # import AsyncStorage from '@react-native-async-storage/async-storage';\\

     \
     export const storeNotification = async (notification) =&gt; {\
     try {\
     const existingNotifications = await AsyncStorage.getItem('notifications');\
     constnotifications = existingNotifications ? JSON.parse(existingNotifications) : \[\];\
     notifications.push(notification);\
     await AsyncStorage.setItem('notifications', JSON.stringify(notifications));\
     } catch (error) {\
     console.error('Error storing notification:', error);\
     }\
     };\
     \
     export const getNotifications = async () =&gt; {\
     try {\
     const notifications = await AsyncStorage.getItem('notifications');\
     return notifications ? JSON.parse(notifications) : \[\];\
     } catch (error) {\
     console.error('Error retrieving notifications:', error);\
     return \[\];\
     }\
     };

   - Update `App.js` to store notifications:

     # import { storeNotification } from './utils/NotificationStorage';\\

     \
     export default function App() {\
     useEffect(() =&gt; {\
     const unsubscribe = messaging().onMessage(async (remoteMessage) =&gt; {\
     await storeNotification(remoteMessage);\
     // ... existing notification handling\
     });\
     \
     messaging().setBackgroundMessageHandler(async (remoteMessage) =&gt; {\
     await storeNotification(remoteMessage);\
     // ... existing notification handling\
     });\
     // ... rest of the code\
     }, \[\]);\
     // ... rest of the code\
     }

5. **Badge Count Management**:

   - Update `App.js` to handle badge counts with Notifee:

     # import notifee from '@notifee/react-native';\\

     \
     export default function App() {\
     useEffect(() =&gt; {\
     const unsubscribe = messaging().onMessage(async (remoteMessage) =&gt; {\
     await notifee.incrementBadgeCount();\
     // ... existing notification handling\
     });\
     \
     messaging().setBackgroundMessageHandler(async (remoteMessage) =&gt; {\
     await notifee.incrementBadgeCount();\
     // ... existing notification handling\
     });\
     \
     notifee.onForegroundEvent(({ type, detail }) =&gt; {\
     if (type === notifee.EventType.PRESS) {\
     notifee.decrementBadgeCount();\
     // ... existing event handling\
     }\
     });\
     \
     return unsubscribe;\
     }, \[\]);\
     // ... rest of the code\
     }

# Step 5: Backend Simulation for Triggering Notifications

1. **Set Up a Node.js Backend**:

   - Create a new directory `backend` and initialize a Node.js project:

     # mkdir backend\\

     cd backend\
     npm init -y\
     npm install firebase-admin express

   - Create `index.js`:

     # const express = require('express');\\

     const admin = require('firebase-admin');\
     const app = express();\
     \
     app.use(express.json());\
     \
     // Initialize Firebase Admin SDK\
     const serviceAccount = require('./path-to-your-firebase-adminsdk.json');\
     admin.initializeApp({\
     credential: admin.credential.cert(serviceAccount),\
     });\
     \
     app.post('/send-notification', async (req, res) =&gt; {\
     const { token, title, body, navigationId } = req.body;\
     const message = {\
     token,\
     notification: { title, body },\
     data: { navigationId },\
     android: { priority: 'high' },\
     };\
     \
     try {\
     await admin.messaging().send(message);\
     res.status(200).send('Notification sent successfully');\
     } catch (error) {\
     res.status(500).send('Error sending notification: ' + error.message);\
     }\
     });\
     \
     app.listen(3000, () =&gt; console.log('Server running on port 3000'));

   - Download the Firebase Admin SDK credentials from the Firebase Console (Project Settings &gt; Service Accounts) and place them in `backend/`.

2. **Run the Backend**:

   # node index.js

3. **Test Notification Sending**:

   - Use a tool like Postman to send a POST request to `http://localhost:3000/send-notification`:

     # {\\

     "token": "&lt;FCM_TOKEN&gt;",\
     "title": "Test Notification",\
     "body": "This is a test notification",\
     "navigationId": "notification"\
     }

# Step 6: Testing and Validation

1. **Run the App**:

   - Connect an Android 15 device.

   - Run the app:

     # npx react-native run-android

   - Grant notification permissions when prompted.

2. **Test Notifications**:

   - Send a test notification from the Firebase Console (Engage &gt; Cloud Messaging &gt; Send Test Message, using the FCM token logged in the console).
   - Verify notifications appear when the app is in foreground, background, and killed states.
   - Check deep linking by clicking a notification to navigate to the `NotificationScreen`.
   - Verify badge counts increment on new notifications and decrement on click.
   - Check stored notifications in AsyncStorage using a debugger or console log.
     
**This implementation provides a robust foundation for a push notification system similar to WhatsApp, with all required and bonus features included.**
