import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import HungerBar from '../components/HungerBar';
import { PollitoView } from '../components/PollitoView';
import FeedButton from '../components/FeedButton';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HungerBar />
        <View style={styles.centerSection}>
          <PollitoView />
        </View>
        <FeedButton />
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
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60, // espacio para el botón
  },
});

export default HomeScreen; 