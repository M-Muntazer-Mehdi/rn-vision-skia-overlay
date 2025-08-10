import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Canvas, Image, useImage } from '@shopify/react-native-skia';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const PNGOverlay = () => {
  // Replace with your image path or remote URI
  const image = useImage(require('./1.png'));
  // Or for remote URL: useImage('https://example.com/overlay.png');

  if (!image) return null; // wait for image to load

  return (
    <Canvas style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Image
        image={image}
        x={0}
        y={0}
        width={screenWidth}
        height={screenHeight}
        fit="cover"
      />
    </Canvas>
  );
};
