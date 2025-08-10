import React, { useState, useRef } from 'react';
import { StyleSheet, Dimensions, PanResponder, View } from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  Paint,
  Group,
  Rect,
  ColorMatrix
} from '@shopify/react-native-skia';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const SepiaDrawable = () => {
  const [paths, setPaths] = useState<any[]>([]);
  const pathsRef = useRef<any[]>([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const path = Skia.Path.Make();
      path.moveTo(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      pathsRef.current = [...pathsRef.current, { path }];
      setPaths([...pathsRef.current]);
    },
    onPanResponderMove: (evt) => {
      const currentPaths = [...pathsRef.current];
      const currentPath = currentPaths[currentPaths.length - 1];
      currentPath.path.lineTo(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      setPaths(currentPaths);
    },
  });

  return (
    <View style={{ flex: 2, backgroundColor: 'transparent' }} {...panResponder.panHandlers}>
      <Canvas style={{ flex: 2, backgroundColor: 'transparent' }}>
        <Group>
          <Rect x={0} y={0} width={screenWidth} height={screenHeight}>
            <Paint>
              <ColorMatrix
                matrix={[
                  0.393, 0.769, 0.189, 0, 0,
                  0.349, 0.686, 0.168, 0, 0,
                  0.272, 0.534, 0.131, 0, 0,
                  0,     0,     0,     1, 0
                ]}
              />
            </Paint>
          </Rect>
        </Group>

        {/* User drawing */}
        {paths.map((p, i) => (
          <Path
            key={i}
            path={p.path}
            color="red"
            style="stroke"
            strokeWidth={4}
          />
        ))}
      </Canvas>
    </View>
  );
};
