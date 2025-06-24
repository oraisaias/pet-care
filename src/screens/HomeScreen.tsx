import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import HungerBar from '../components/HungerBar';
import PollitoArea from '../components/PollitoArea';
import FeedButtonArea from '../components/FeedButtonArea';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HungerBar />
        <PollitoArea />
        <FeedButtonArea />
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