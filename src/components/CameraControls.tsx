import React from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { styles } from '../styles/styles';

type CameraControlsProps = {
  flashMode: 'on' | 'off' | 'auto';
  toggleFlash: () => void;
  toggleCamera: () => void;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording: boolean;
  recordingTime: number;
  recordingOpacity: Animated.AnimatedInterpolation<number> | Animated.AnimatedValue;
};

export const CameraControls: React.FC<CameraControlsProps> = ({
  flashMode,
  toggleFlash,
  toggleCamera,
  showFilters,
  setShowFilters,
  isRecording,
  recordingTime,
  recordingOpacity,
}) => {
  // component code
  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on': return '⚡';
      case 'auto': return '🔆';
      default: return '❌';
    }
  };

  const formatTime = (seconds:any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <React.Fragment>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topIcon} onPress={toggleFlash}>
          <Text style={styles.iconText}>{getFlashIcon()}</Text>
        </TouchableOpacity>
        
        {/* Recording Timer */}
        {isRecording && (
          <Animated.View style={[styles.recordingTimer, { opacity: recordingOpacity }]}>
            <View style={styles.recordingDot} />
            <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
          </Animated.View>
        )}
        
        <TouchableOpacity style={styles.topIcon} onPress={() => console.log('Settings')}>
          <Text style={styles.iconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Side Icons */}
      <View style={styles.sideIcons}>
        <TouchableOpacity style={styles.sideIcon} onPress={toggleCamera}>
          <Text style={styles.iconText}>🔄</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sideIcon} onPress={() => setShowFilters(!showFilters)}>
          <Text style={styles.iconText}>✨</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sideIcon} onPress={() => console.log('AR Lens')}>
          <Text style={styles.iconText}>😀</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sideIcon} onPress={() => console.log('Add Music')}>
          <Text style={styles.iconText}>🎵</Text>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
};