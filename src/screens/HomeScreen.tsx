import React from 'react';
import { View, StyleSheet } from 'react-native';
import HungerBar from '../components/HungerBar';
import { PollitoView } from '../components/PollitoView';
import FeedButton from '../components/FeedButton';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <HungerBar />
      <PollitoView />
      <FeedButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingTop: 50,
    justifyContent: 'flex-start',
  },
});

export default HomeScreen; 