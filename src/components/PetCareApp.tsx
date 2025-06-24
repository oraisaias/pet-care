import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { PollitoState } from '../types';
import Pollito from './Pollito';
import { PetCareGame } from '../classes/PetCareGame';
import { Pollito as PollitoClass } from '../classes/Pollito';

const { width, height } = Dimensions.get('window');

const PetCareApp: React.FC = () => {
  const [game] = useState(() => new PetCareGame());
  const [pollito] = useState(() => new PollitoClass());
  const [currentState, setCurrentState] = useState<PollitoState>(PollitoState.FELIZ);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);

  useEffect(() => {
    const stateCheckInterval = setInterval(() => {
      const newState = game.getCurrentState();
      const newShowInitial = game.isShowingInitialAnimation();
      
      if (newState !== currentState) {
        setCurrentState(newState);
      }
      
      if (newShowInitial !== showInitialAnimation) {
        setShowInitialAnimation(newShowInitial);
      }
    }, 100);

    return () => {
      clearInterval(stateCheckInterval);
      game.destroy();
    };
  }, [game, currentState, showInitialAnimation]);

  const handleFeed = () => {
    if (game.canFeed()) {
      game.feedPollito();
    }
  };

  const handleStateChange = (newState: PollitoState) => {
    setCurrentState(newState);
  };

  if (showInitialAnimation) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require('../../assets/pollito/saliendo.json')}
          autoPlay
          loop={false}
          style={styles.initialAnimation}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pollitoContainer}>
        <Pollito pollito={pollito} onStateChange={handleStateChange} />
      </View>
      
      <TouchableOpacity 
        style={[
          styles.feedButton,
          !game.canFeed() && styles.feedButtonDisabled
        ]} 
        onPress={handleFeed}
        disabled={!game.canFeed()}
      >
        <Text style={styles.feedButtonText}>🍽️ Dar de comer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Fondo azul claro suave
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  initialAnimation: {
    width: width * 0.8,
    height: height * 0.6,
  },
  pollitoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  feedButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  feedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PetCareApp; 