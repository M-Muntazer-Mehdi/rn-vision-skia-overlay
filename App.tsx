import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
  TouchableOpacity
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Camera, useCameraDevices } from 'react-native-vision-camera';


// Components
import { CameraControls } from './src/components/CameraControls';
import { BottomControls } from './src/components/BottomControls';
import { FiltersPanel, SkiaFilterOverlay } from './src/components/FiltersPanel';

// Hooks
import { usePermissions } from './src/hooks/usePermissions';

// Utils
import {
  takePhotoLogic,
  startVideoRecordingLogic,
  stopVideoRecordingLogic
} from './src/utils/cameraLogic';

// Styles
import { styles } from './src/styles/styles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  const devices = useCameraDevices();
  const cameraRef = useRef(null);

  // Camera states
  const [cameraPosition, setCameraPosition] = useState('back');
  const [flashMode, setFlashMode] = React.useState<'on' | 'off' | 'auto'>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  
  // Snapchat-style states
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  // Memoize the setter
  const handleSetActiveFilter = useCallback(
  (value: React.SetStateAction<string | null>) => {
    setActiveFilter(value);
  },
  [setActiveFilter]
);


  // Animated values
  const captureButtonScale = useRef(new Animated.Value(1)).current;
  const recordingOpacity = useRef(new Animated.Value(0)).current;

  // Gesture handling for pinch-to-zoom
  const baseZoom = useRef(1);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  const device = devices.find(device => device.position === cameraPosition);

  // Permissions hook
  const { hasPermission, hasStoragePermission, requestStoragePermission } = usePermissions();

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      const newZoom = Math.max(1, Math.min(baseZoom.current * event.scale, device?.maxZoom || 10));
      setZoomLevel(newZoom);
    })
    .onEnd(() => {
      baseZoom.current = zoomLevel;
    });

  // Pan gesture for Snapchat-style vertical drag zoom
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      const dragDistance = -event.translationY;
      const maxDragDistance = 200;
      const zoomMultiplier = Math.max(0, Math.min(dragDistance / maxDragDistance, 1));
      const maxZoom = device?.maxZoom || 10;
      const newZoom = 1 + (maxZoom - 1) * zoomMultiplier;
      setZoomLevel(newZoom);
    })
    .onEnd(() => {
      baseZoom.current = zoomLevel;
    });

  // Compose gestures to work simultaneously
  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Recording timer effect
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
      
      // Animate recording indicator
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingOpacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
      setRecordingTime(0);
      recordingOpacity.setValue(0);
    }
    
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [isRecording]);

  // Toggle camera
  const toggleCamera = () => {
    setCameraPosition(current => (current === 'back' ? 'front' : 'back'));
    setZoomLevel(1);
    baseZoom.current = 1;
  };

  // Toggle flash
  const toggleFlash = () => {
    const modes: ('off' | 'on' | 'auto')[] = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flashMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlashMode(modes[nextIndex]);
  };

  // Snapchat-style capture with press and hold
  const handleCaptureStart = () => {
    if (isRecording) return;
    
    setIsPressed(true);
    
    Animated.spring(captureButtonScale, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();

    if (captureMode === 'photo') {
      takePhoto();
    } else {
      startVideoRecording();
    }
  };

  const handleCaptureEnd = () => {
    setIsPressed(false);
    
    Animated.spring(captureButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    if (isRecording) {
      stopVideoRecording();
    }
  };

  // Camera functions using imported logic
  const takePhoto = async () => {
    const photo = await takePhotoLogic(
      cameraRef, 
      device, 
      flashMode, 
      setLastPhoto, 
      hasStoragePermission, 
      requestStoragePermission
    );
    
    if (photo) {
      // Success animation
      Animated.sequence([
        Animated.timing(captureButtonScale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(captureButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const startVideoRecording = async () => {
    await startVideoRecordingLogic(
      cameraRef,
      device,
      flashMode,
      setIsRecording,
      setLastPhoto,
      hasStoragePermission,
      requestStoragePermission
    );
  };

  const stopVideoRecording = async () => {
    await stopVideoRecordingLogic(cameraRef, isRecording, setIsRecording);
  };

  // Loading state
  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  // Permission state
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Camera and microphone permissions required.</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => {
            // This will trigger the permission request in the hook
            console.log('Requesting permissions...');
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Camera View with Pinch Gesture */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={true}
            video={true}
            audio={true}
            photo={true}
            torch={flashMode === 'on' ? 'on' : 'off'}
            zoom={zoomLevel}
          />
          
          {/* Skia Filter Overlay */}
          <SkiaFilterOverlay activeFilter={activeFilter} />
        </Animated.View>
      </GestureDetector>

      {/* Zoom Level Indicator with drag hint */}
      {zoomLevel > 1 ? (
        <View style={styles.zoomIndicator}>
          <Text style={styles.zoomText}>{zoomLevel.toFixed(1)}x</Text>
        </View>
      ) : (
        <View style={styles.zoomHint}>
          <Text style={styles.zoomHintText}>↑ Drag up to zoom</Text>
        </View>
      )}

      {/* Active Filter Indicator */}
      {activeFilter && activeFilter !== 'Original' && (
        <View style={styles.activeFilterIndicator}>
          <Text style={styles.activeFilterText}>{activeFilter}</Text>
        </View>
      )}

      {/* Camera Controls */}
      <CameraControls
        flashMode={flashMode}
        toggleFlash={toggleFlash}
        toggleCamera={toggleCamera}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isRecording={isRecording}
        recordingTime={recordingTime}
        recordingOpacity={recordingOpacity}
      />

      {/* Bottom Controls */}
      <BottomControls
        lastPhoto={lastPhoto}
        setLastPhoto={setLastPhoto}
        captureButtonScale={captureButtonScale}
        isRecording={isRecording}
        captureMode={captureMode}
        setCaptureMode={setCaptureMode}
        handleCaptureStart={handleCaptureStart}
        handleCaptureEnd={handleCaptureEnd}
      />

      {/* Filters Panel */}
      <FiltersPanel
        showFilters={showFilters}
        activeFilter={activeFilter}
        setActiveFilter={handleSetActiveFilter}
      />
    </GestureHandlerRootView>
  );
}