import React, { useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, LayoutRectangle } from 'react-native';
import HungerBar from '../components/HungerBar';
import PollitoArea from '../components/PollitoArea';
import FeedButton from '../components/FeedButton';
import { usePollitoContext } from '../context/PollitoContext';

const HomeScreen: React.FC = () => {
  const [pollitoLayout, setPollitoLayout] = useState<LayoutRectangle | null>(null);
  const { feed } = usePollitoContext();

  // Handler para el drop
  const handleDropOnPollito = (event: any) => {
    if (!pollitoLayout) return;
    const { absoluteX, absoluteY } = event.nativeEvent;
    if (
      absoluteX >= pollitoLayout.x &&
      absoluteX <= pollitoLayout.x + pollitoLayout.width &&
      absoluteY >= pollitoLayout.y &&
      absoluteY <= pollitoLayout.y + pollitoLayout.height
    ) {
      feed();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HungerBar />
        <View
          style={{ flex: 1 }}
          onLayout={e => setPollitoLayout(e.nativeEvent.layout)}
        >
          <PollitoArea />
        </View>
        <FeedButton onDropOnPollito={handleDropOnPollito} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#f0f8ff',
  },
});

export default HomeScreen; 