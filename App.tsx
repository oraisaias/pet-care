import React from 'react';
import { PollitoProvider } from './src/context/PollitoContext';
import HomeScreen from './src/screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FoodProvider } from './src/context/FoodContext';
import { ImageBackground, StyleSheet } from 'react-native';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('./assets/background/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <FoodProvider>
          <PollitoProvider>
            <HomeScreen />
          </PollitoProvider>
        </FoodProvider>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
}); 