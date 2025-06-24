import React from 'react';
import { PollitoProvider } from './src/context/PollitoContext';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <PollitoProvider>
      <HomeScreen />
    </PollitoProvider>
  );
} 