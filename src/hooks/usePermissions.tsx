import { useState, useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';

export const usePermissions = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [hasStoragePermission, setHasStoragePermission] = useState(false);
  
  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();

  // Request storage permissions
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to storage to save photos and videos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        const mediaPermissions = [
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ];
        
        const mediaGranted = await PermissionsAndroid.requestMultiple(mediaPermissions);
        
        const hasMediaPermission = Object.values(mediaGranted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED || hasMediaPermission) {
          setHasStoragePermission(true);
          return true;
        }
      } catch (err) {
        console.warn('Storage permission error:', err);
      }
    } else {
      setHasStoragePermission(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    async function checkPermissions() {
      if (cameraPermission.hasPermission && microphonePermission.hasPermission) {
        setHasPermission(true);
        await requestStoragePermission();
      } else {
        const cameraGranted = await cameraPermission.requestPermission();
        const micGranted = await microphonePermission.requestPermission();

        if (cameraGranted && micGranted) {
          setHasPermission(true);
          await requestStoragePermission();
        } else {
          Alert.alert('Permissions denied', 'Camera and microphone permissions are required');
        }
      }
    }
    checkPermissions();
  }, [cameraPermission.hasPermission, microphonePermission.hasPermission]);

  return {
    hasPermission,
    hasStoragePermission,
    requestStoragePermission,
    cameraPermission,
    microphonePermission
  };
};