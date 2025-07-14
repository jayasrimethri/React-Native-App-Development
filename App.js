import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    const getFCMToken = async () => {
      try {
        // Android 13+ permission
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('🚫 Notification permission denied');
            return;
          }
        }

        const token = await messaging().getToken();
        console.log('🔑 FCM Token:', token);

        // You can also show it on phone screen or alert
        Alert.alert('FCM Token', token);
      } catch (error) {
        console.error('❌ Error fetching FCM token:', error);
      }
    };

    getFCMToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>📱 Push Notification App is Ready</Text>
    </View>
  );
};

export default App;
