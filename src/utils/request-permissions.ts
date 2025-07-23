import { PermissionsAndroid, Platform } from 'react-native';

export async function requestActivityRecognitionPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 29) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Activity Recognition Permission',
          message:
            'This app needs access to your physical activity to count your steps.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Activity Recognition permission granted');
        return true;
      } else {
        console.log('Activity Recognition permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
}
