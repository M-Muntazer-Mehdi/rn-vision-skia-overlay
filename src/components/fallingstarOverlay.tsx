import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Canvas, Circle, Group, Blur } from '@shopify/react-native-skia';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const NUM_STARS = 30;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
};

export const FallingStarsOverlay = () => {
  const starsRef = useRef<Star[]>(
    Array.from({ length: NUM_STARS }).map(() => ({
      x: random(0, screenWidth),
      y: random(0, screenHeight),
      radius: random(1, 3),
      speed: random(50, 150),
    }))
  );

  const [stars, setStars] = useState(starsRef.current);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setStars((prevStars) =>
        prevStars.map((star) => {
          let newY = star.y + star.speed * delta;
          if (newY > screenHeight) newY -= screenHeight;
          return { ...star, y: newY };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Group>
        {stars.map((star, i) => (
          <Group key={i}>
            {/* Glow: bigger, blurred, low opacity circle */}
            <Circle
              cx={star.x}
              cy={star.y}
              r={star.radius * 3}
              color="white"
              opacity={0.15}
            >
              <Blur blur={6} />
            </Circle>

            {/* Core star: smaller, full opacity */}
            <Circle cx={star.x} cy={star.y} r={star.radius} color="white" opacity={0.9} />
          </Group>
        ))}
      </Group>
    </Canvas>
  );
};
