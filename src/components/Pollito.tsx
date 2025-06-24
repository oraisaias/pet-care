import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { PollitoProps, PollitoState } from '../types';
import HungryPollito from './HungryPollito';

const Pollito: React.FC<PollitoProps> = ({ pollito, onStateChange }) => {
  const currentState = pollito.getCurrentState();

  useEffect(() => {
    // Notificar cambios de estado
    onStateChange(currentState);
  }, [currentState, onStateChange]);

  const renderAnimation = () => {
    switch (currentState) {
      case PollitoState.FELIZ:
        return (
          <LottieView
            source={require('../../assets/pollito/lovely.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        );
      case PollitoState.HAMBRIENTO:
        return <HungryPollito onStateChange={onStateChange} />;
      case PollitoState.COMIENDO:
        return (
          <LottieView
            source={require('../../assets/pollito/lovely.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        );
      case PollitoState.LLENO:
        return (
          <View style={styles.gorditoContainer}>
            <Image
              source={require('../../assets/pollito/gordito.png')}
              style={styles.gorditoImage}
              resizeMode="contain"
            />
          </View>
        );
      case PollitoState.MUERTO:
        return (
          <View style={styles.deadContainer}>
            <Image
              source={require('../../assets/comida/dead.png')}
              style={styles.deadImage}
              resizeMode="contain"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderAnimation()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  gorditoContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gorditoImage: {
    width: 180,
    height: 180,
  },
  deadContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadImage: {
    width: 180,
    height: 180,
  },
});

export default Pollito; 