import React from 'react';
import { PollitoProvider } from './src/context/PollitoContext';
import HomeScreen from './src/screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PollitoProvider>
        <HomeScreen />
      </PollitoProvider>
    </GestureHandlerRootView>
  );
} 