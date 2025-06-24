import React, { useRef, useState } from 'react';
import { View, StyleSheet, LayoutRectangle } from 'react-native';
import { PollitoView } from './PollitoView';
import { usePollitoContext } from '../context/PollitoContext';
import FeedButton from './FeedButton';

const PollitoArea: React.FC = () => {
  const { feed } = usePollitoContext();
  const [pollitoLayout, setPollitoLayout] = useState<LayoutRectangle | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);

  // Handler para el drop
  const handleDropOnPollito = (gestureEvent) => {
    if (!pollitoLayout) return;
    const { absoluteX, absoluteY } = gestureEvent.nativeEvent;
    // Verifica si el drop está dentro del área del pollito
    if (
      absoluteX >= pollitoLayout.x &&
      absoluteX <= pollitoLayout.x + pollitoLayout.width &&
      absoluteY >= pollitoLayout.y &&
      absoluteY <= pollitoLayout.y + pollitoLayout.height
    ) {
      feed();
      setIsDropActive(false);
    }
  };

  return (
    <View style={[styles.area, isDropActive && styles.dropActive]}
      onLayout={e => setPollitoLayout(e.nativeEvent.layout)}
    >
      <PollitoView />
      {/* El FeedButton debe recibir la prop onDropOnPollito para notificar el drop */}
      {/* <FeedButton onDropOnPollito={handleDropOnPollito} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60, // espacio para el botón
    borderWidth: 3,
    borderColor: 'transparent',
  },
  dropActive: {
    borderColor: '#00e676',
    borderWidth: 3,
    shadowColor: '#00e676',
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
});

export default PollitoArea; 