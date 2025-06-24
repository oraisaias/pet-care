import React from 'react';
import { PollitoProvider } from './src/context/PollitoContext';
import HomeScreen from './src/screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FoodProvider } from './src/context/FoodContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FoodProvider>
        <PollitoProvider>
          <HomeScreen />
        </PollitoProvider>
      </FoodProvider>
    </GestureHandlerRootView>
  );
} 