import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import PetCareApp from './src/components/PetCareApp';

export default function App() {
  return (
    <View style={styles.container}>
      <PetCareApp />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 