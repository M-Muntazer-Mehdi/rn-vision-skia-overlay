import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Zoom Indicator and Hint
  zoomIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 2,
  },
  zoomText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 300,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 2,
  },
  zoomHintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },

  // Active Filter Indicator
  activeFilterIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    left: '50%',
    transform: [{ translateX: -35 }],
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 2,
  },
  activeFilterText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
  },

  // Top Bar
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  topIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    color: 'white',
  },
  recordingTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Side Icons
  sideIcons: {
    position: 'absolute',
    right: 15,
    top: '45%',
    transform: [{ translateY: -80 }],
    zIndex: 2,
  },
  sideIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    zIndex: 2,
  },

  // Stories Button
  storiesButton: {
    alignItems: 'center',
    flex: 1,
  },
  storiesContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  storiesImage: {
    width: '100%',
    height: '100%',
  },
  storiesPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  storiesText: {
    fontSize: 20,
  },
  storiesLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },

  // Capture Area
  captureArea: {
    alignItems: 'center',
    flex: 1,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureVideo: {
    borderColor: '#ff4757',
  },
  captureRecording: {
    borderColor: '#ff3838',
  },
  captureCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  captureCenterRecording: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#ff3838',
  },

  // Mode Selector
  modeSelector: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  modeTextActive: {
    color: 'white',
  },

  // Chat Button
  chatButton: {
    alignItems: 'center',
    flex: 1,
  },
  chatIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  chatText: {
    fontSize: 22,
  },
  chatLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },

  // Filters Panel
  filtersPanel: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  filtersList: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  filterButton: {
    alignItems: 'center',
    padding: 8,
  },
  filterButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  filterPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterPreviewActive: {
    borderColor: '#FFFF00',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterEmoji: {
    fontSize: 20,
  },
  filterLabel: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  filterLabelActive: {
    color: '#FFFF00',
    fontWeight: '600',
  },
});