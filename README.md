# React-Native-App-Development
The app implements real-time push notifications similar to WhatsApp, supporting Android 10+. It includes a Kotlin native module for notification handling, Firebase Cloud Messaging (FCM) for sending notifications, deep linking and local notification storage. This project demonstrates how to integrate Firebase Cloud Messaging (FCM) in a React Native app to enable push notifications on Android devices.


**Features**

- Push Notifications:
- Notifications are received in foreground, background, and killed states, styled like WhatsApp.
- Handled using Firebase Cloud Messaging (FCM) and a Kotlin native module.
- Deep Linking: Clicking a notification navigates to a specific screen (NotificationScreen) based on the notification's data payload.
- Badge Counts: Increments when a notification is received and decrements when interacted with, using Notifee.
- Local Notification Storage: Stores notifications locally using AsyncStorage, accessible for later viewing.
- Backend Simulation: A Node.js server simulates sending notifications via FCM.
- Technologies Used
- React Native: For the mobile app frontend.
- Firebase Cloud Messaging (FCM): For push notification delivery.
- Kotlin: For the native module (MyFirebaseMessagingService.kt) handling notifications on Android.
- Notifee: For displaying notifications and managing badge counts.
- React Navigation: For deep linking and screen navigation.
- Node.js/Express: For the backend simulation to trigger notifications.
- AsyncStorage: For local storage of notifications.

 **Project Structure**

VedazPushNotificationApp/
├── android/                    # Android native code
│   ├── app/src/main/java/com/yourname/vedazapp/
│   │   ├── MainActivity.kt     # Configures notification channel
│   │   ├── MyFirebaseMessagingService.kt  # Kotlin native module for FCM
│   └── app/build.gradle        # Android app dependencies
├── backend/                    # Node.js backend simulation
│   ├── index.js                # Express server for sending notifications
│   └── package.json            # Backend dependencies
├── screens/                    # React Native screen components
│   ├── HomeScreen.js           # Home screen
│   └── NotificationScreen.js   # Notification screen for deep linking
├── utils/                      # Utility functions
│   └── NotificationStorage.js  # AsyncStorage for notification storage
├── App.js                      # Main app component
├── getFCMToken.js              # Permission and FCM token handling
├── package.json                # Project dependencies
└── README.md                   # This file



**Setup Instructions**

Prerequisites

- Node.js: v17 or higher
- React Native CLI: For running the app
- Android Studio: With Android 15 (API 35) SDK
- Firebase Account: For FCM setup
- Java/Kotlin: For native module development
- Git: For cloning the repository
- Android 10+ Device: For testing (emulators do not support push notifications)


**Installation**

- Install Dependencies:
- npm install


**Configure Firebase**

- Create a Firebase project in the Firebase Console.
- Add an Android app with the package name com.yourname.vedazapp.
- Download google-services.json and place it in android/app/.
- Update android/build.gradle and android/app/build.gradle as per the implementation guide.



**Set Up Android Native Module:**

- Ensure MyFirebaseMessagingService.kt and MainActivity.kt are in android/app/src/main/java/com/yourname/vedazapp/.
- Update AndroidManifest.xml with required permissions and service.



**Set Up Backend Simulation:**

- Navigate to the backend/ directory:

cd backend
npm install

- Add your Firebase Admin SDK credentials (firebase-adminsdk.json) to backend/.

Run the backend:
node index.js



**Run the App:**

- Connect an Android 10+ device.
- Build and run:
- npx react-native run-android
- Testing


**Grant Permissions:**

- Launch the app and grant notification permissions.
- Retrieve the FCM token (logged in the console or displayed in the app).


**Send Test Notifications:**

- Use Postman or curl to send a notification via the backend:

curl -X POST http://localhost:3000/send-notification -H "Content-Type: application/json" -d '{"token":"YOUR_FCM_TOKEN","title":"Test Notification","body":"This is a test notification","navigationId":"notification"}'
Alternatively, use the Firebase Console (Cloud Messaging > Send Test Message).


**Verify Features:**

- Foreground: Notification appears as an alert with badge count increment.
- Background: Notification appears in the tray when the app is minimized.
- Killed: Notification appears after force-stopping the app.
- Deep Linking: Clicking a notification opens the NotificationScreen.
- Local Storage: Check stored notifications via a list or console log.
- Badge Counts: Verify increments on new notifications and decrements on interaction.
