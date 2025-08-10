import React from 'react';
import { View, Text, TouchableOpacity, Animated, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { styles } from '../styles/styles';

type BottomControlsProps = {
  lastPhoto: string | null; // or whatever type fits your data
  setLastPhoto: React.Dispatch<React.SetStateAction<string | null>>;
  captureButtonScale: Animated.Value;
  isRecording: boolean;
  captureMode: 'photo' | 'video'; // or string if you have other modes
  setCaptureMode: React.Dispatch<React.SetStateAction<'photo' | 'video'>>;
  handleCaptureStart: () => void;
  handleCaptureEnd: () => void;
};

export const BottomControls: React.FC<BottomControlsProps> = ({
  lastPhoto,
  setLastPhoto,
  captureButtonScale,
  isRecording,
  captureMode,
  setCaptureMode,
  handleCaptureStart,
  handleCaptureEnd,
}) => {

  // Open device gallery
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        quality: 1,
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'Failed to open gallery');
        } else if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          console.log('Selected media:', asset);
          Alert.alert('Selected', `You selected: ${asset.fileName || 'an image'}`);
          
          if (asset.uri) {
            setLastPhoto(asset.uri);
          }
        }
      }
    );
  };

  return (
    <View style={styles.bottomBar}>
      {/* Stories/Gallery */}
      <TouchableOpacity style={styles.storiesButton} onPress={openGallery}>
        <View style={styles.storiesContainer}>
          {lastPhoto ? (
            <Image source={{ uri: lastPhoto }} style={styles.storiesImage} />
          ) : (
            <View style={styles.storiesPlaceholder}>
              <Text style={styles.storiesText}>📸</Text>
            </View>
          )}
        </View>
        <Text style={styles.storiesLabel}>Stories</Text>
      </TouchableOpacity>

      {/* Capture Button */}
      <View style={styles.captureArea}>
        <Animated.View style={[styles.captureButton, { transform: [{ scale: captureButtonScale }] }]}>
          <TouchableOpacity
            style={[
              styles.captureInner,
              isRecording && styles.captureRecording,
              captureMode === 'video' && styles.captureVideo
            ]}
            onPressIn={handleCaptureStart}
            onPressOut={handleCaptureEnd}
            activeOpacity={1}
          >
            <View style={[
              styles.captureCenter,
              isRecording && styles.captureCenterRecording
            ]} />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Mode Labels */}
        <View style={styles.modeSelector}>
          <TouchableOpacity 
            style={styles.modeButton}
            onPress={() => setCaptureMode('video')}
          >
            <Text style={[styles.modeText, captureMode === 'video' && styles.modeTextActive]}>
              VIDEO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modeButton}
            onPress={() => setCaptureMode('photo')}
          >
            <Text style={[styles.modeText, captureMode === 'photo' && styles.modeTextActive]}>
              PHOTO
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat */}
      <TouchableOpacity style={styles.chatButton} onPress={() => Alert.alert('Chat', 'Open Chat')}>
        <View style={styles.chatIcon}>
          <Text style={styles.chatText}>💬</Text>
        </View>
        <Text style={styles.chatLabel}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};