import React from 'react';
import { View, StyleSheet } from 'react-native';
import FeedButton from './FeedButton';

const FeedButtonArea: React.FC = () => {
  // Aquí en el futuro puedes poner objetos arrastrables, animaciones, etc.
  return (
    <View style={styles.area}>
      <FeedButton />
    </View>
  );
};

const styles = StyleSheet.create({
  area: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 32,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
});

export default FeedButtonArea; 