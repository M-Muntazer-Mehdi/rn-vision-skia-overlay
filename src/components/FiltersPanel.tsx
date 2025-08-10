import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import {
  Canvas,
  ColorMatrix,
  Paint,
  Group,
  Rect,
  LinearGradient,
  vec,
  RadialGradient,
} from '@shopify/react-native-skia';
import { LinearToSRGBGamma, SweepGradient } from '@shopify/react-native-skia';
import {BlendColor, Circle } from "@shopify/react-native-skia";
import { SepiaDrawable } from './sepiaDrawable';
import { Fill, RoundedRect } from "@shopify/react-native-skia";
import { styles } from '../styles/styles';
import { PNGOverlay } from './pngOverlay';
import { FallingStarsOverlay } from './fallingstarOverlay';
import { GlowingGoldenCircle } from './glowingFaceCircle';
import { ScrollView } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type MyFiltersPanelProps = {
  showFilters: boolean;
  activeFilter: string | null;
  setActiveFilter: React.Dispatch<React.SetStateAction<string | null>>;
};

export const FiltersPanel: React.FC<MyFiltersPanelProps> = ({
  showFilters,
  activeFilter,
  setActiveFilter
}) => {
  const filters = [
    { name: 'Original', emoji: '📷' },
    { name: 'B&W', emoji: '⚫' },
    { name: 'Sepia', emoji: '🟤' },
    { name: 'Vintage', emoji: '📹' },
    { name: 'snow', emoji: '❄️' },
    { name: 'gold', emoji: '🌟' }
  ];

  if (!showFilters) return null;

return (
  <View style={styles.filtersPanel}>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.filtersList}
    >
      {filters.map((filter, index) => (
        <TouchableOpacity
          key={filter.name}
          style={[
            styles.filterButton,
            activeFilter === filter.name && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter(filter.name === 'Original' ? null : filter.name)}
        >
          <View
            style={[
              styles.filterPreview,
              activeFilter === filter.name && styles.filterPreviewActive,
            ]}
          >
            <Text style={styles.filterEmoji}>{filter.emoji}</Text>
          </View>
          <Text
            style={[
              styles.filterLabel,
              activeFilter === filter.name && styles.filterLabelActive,
            ]}
          >
            {filter.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

};
const r = 128;

// Skia Filter Overlays Component
export const SkiaFilterOverlay = ({ activeFilter }: { activeFilter: string | null }) => {
  if (!activeFilter || activeFilter === 'Original') return null;

  switch (activeFilter) {
    case 'B&W':
      return (
        <Canvas style={{ flex: 0.5 }}>
          <Fill color="#15a8d9ff" />
          <Group
            color="lightblue"
            origin={{ x: 128, y: 128 }}
            transform={[{ skewX: Math.PI / 6 }]}
          >
            <RoundedRect x={64} y={64} width={128} height={128} r={10} />
          </Group>
        </Canvas>
      );

    case 'Sepia':
      return (
        <SepiaDrawable />
      );


    case 'Vintage':
      return (
        <PNGOverlay />
      );

    case 'gold':
      return (
        <GlowingGoldenCircle cx={190} cy={300} radius={150} />

      );

    case 'snow':
      return (
        <FallingStarsOverlay />

      );

    default:
      return null;
  }
};