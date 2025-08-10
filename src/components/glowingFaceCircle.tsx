import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Canvas, Circle, Group, Blur } from '@shopify/react-native-skia';

type GlowingCircleProps = {
  cx: number;
  cy: number;
  radius: number;
};

export const GlowingGoldenCircle: React.FC<GlowingCircleProps> = ({ cx, cy, radius }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 1000, useNativeDriver: false }),
        Animated.timing(scale, { toValue: 0.9, duration: 1000, useNativeDriver: false }),
      ])
    ).start();
  }, [scale]);

  // Skia Circle radius expects a number, so we interpolate scale value to JS number every frame:
  const [animatedRadius, setAnimatedRadius] = React.useState(radius);

  useEffect(() => {
    const id = scale.addListener(({ value }) => {
      setAnimatedRadius(radius * value);
    });
    return () => scale.removeListener(id);
  }, [radius, scale]);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Group>
        <Circle cx={cx} cy={cy} r={animatedRadius * 1.8} color="#FFD700" opacity={0.15} style="stroke">
          <Blur blur={12} />
        </Circle>
        <Circle cx={cx} cy={cy} r={animatedRadius} color="#FFD700" style="stroke" strokeWidth={3} />
      </Group>
    </Canvas>
  );
};
