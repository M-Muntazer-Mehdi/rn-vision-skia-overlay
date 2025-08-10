import { Alert } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

// Save photo to gallery
export const savePhotoToGallery = async (photoPath:any, hasStoragePermission:any, requestStoragePermission:any) => {
  try {
    if (!hasStoragePermission) {
      const permissionGranted = await requestStoragePermission();
      if (!permissionGranted) {
        Alert.alert('Permission Required', 'Storage permission is required to save photos');
        return;
      }
    }

    const savedPhoto = await CameraRoll.save(photoPath, {
      type: 'photo',
      album: 'Camera',
    });
    
    console.log('Photo saved to gallery:', savedPhoto);
    return savedPhoto;
  } catch (error) {
    console.error('Error saving photo to gallery:', error);
    Alert.alert('Save Error', 'Failed to save photo to gallery');
    return null;
  }
};

// Save video to gallery
export const saveVideoToGallery = async (videoPath:any, hasStoragePermission:any, requestStoragePermission:any) => {
  try {
    if (!hasStoragePermission) {
      const permissionGranted = await requestStoragePermission();
      if (!permissionGranted) {
        Alert.alert('Permission Required', 'Storage permission is required to save videos');
        return;
      }
    }

    const savedVideo = await CameraRoll.save(videoPath, {
      type: 'video',
      album: 'Camera',
    });
    
    console.log('Video saved to gallery:', savedVideo);
    return savedVideo;
  } catch (error) {
    console.error('Error saving video to gallery:', error);
    Alert.alert('Save Error', 'Failed to save video to gallery');
    return null;
  }
};

// Take photo function
export const takePhotoLogic = async (cameraRef:any, device:any, flashMode:any, setLastPhoto:any, hasStoragePermission:any, requestStoragePermission:any) => {
  if (!cameraRef.current || !device) {
    Alert.alert('Error', 'Camera not ready');
    return;
  }

  try {
    const photo = await cameraRef.current.takePhoto({
      flash: flashMode,
      enableAutoRedEyeReduction: true,
      enableShutterSound: false,
    });
    
    console.log('Photo captured:', photo);
    const photoUri = `file://${photo.path}`;
    setLastPhoto(photoUri);
    
    // Save to gallery
    await savePhotoToGallery(photoUri, hasStoragePermission, requestStoragePermission);
    
    return photo;
  } catch (error) {
    console.error('Photo capture error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    Alert.alert('Error', 'Failed to take photo: ' + errorMessage);
    return null;
  }
};

// Start video recording
export const startVideoRecordingLogic = async (cameraRef:any, device:any, flashMode:any, setIsRecording:any, setLastPhoto:any, hasStoragePermission:any, requestStoragePermission:any) => {
  if (!cameraRef.current || !device) {
    return;
  }

  try {
    console.log('Starting video recording...');
    setIsRecording(true);
    
    await cameraRef.current.startRecording({
      flash: flashMode === 'on' ? 'on' : 'off',
      onRecordingFinished: async (video:any) => {
        console.log('Video recording finished:', video);
        setIsRecording(false);
        
        const videoUri = `file://${video.path}`;
        setLastPhoto(videoUri); // Show video thumbnail
        
        // Save to gallery
        await saveVideoToGallery(videoUri, hasStoragePermission, requestStoragePermission);
        
        Alert.alert('Success', 'Video saved to gallery!');
      },
      onRecordingError: (error:any) => {
        console.error('Recording error:', error);
        setIsRecording(false);
        const errorMessage = error instanceof Error ? error.message : 'Unknown recording error';
        Alert.alert('Recording Error', errorMessage);
      },
    });
    
    console.log('Video recording started successfully');
  } catch (error) {
    console.error('Start recording error:', error);
    setIsRecording(false);
    const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
    Alert.alert('Error', errorMessage);
  }
};

// Stop video recording
export const stopVideoRecordingLogic = async (cameraRef:any, isRecording:any, setIsRecording:any) => {
  if (!cameraRef.current || !isRecording) {
    return;
  }

  try {
    console.log('Stopping video recording...');
    await cameraRef.current.stopRecording();
  } catch (error) {
    console.error('Stop recording error:', error);
    setIsRecording(false);
  }
};