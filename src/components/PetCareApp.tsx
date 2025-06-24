import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { PollitoState } from '../types';
import Pollito from './Pollito';
import HungerBar from './HungerBar';
import { PetCareGame } from '../classes/PetCareGame';

const { width, height } = Dimensions.get('window');

const PetCareApp: React.FC = () => {
  const [game] = useState(() => new PetCareGame());
  const [currentState, setCurrentState] = useState<PollitoState>(PollitoState.FELIZ);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);
  const [hungerLevel, setHungerLevel] = useState(100);

  // Timer para la animación inicial
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowInitialAnimation(false);
    }, 3000); // 3 segundos para la animación inicial

    return () => clearTimeout(initialTimer);
  }, []);

  // Timer para monitorear el estado del juego
  useEffect(() => {
    if (!showInitialAnimation) {
      const stateCheckInterval = setInterval(() => {
        const newState = game.getCurrentState();
        const newHungerLevel = game.getHungerLevel();
        
        if (newState !== currentState) {
          setCurrentState(newState);
        }

        if (newHungerLevel !== hungerLevel) {
          setHungerLevel(newHungerLevel);
        }
      }, 100);

      return () => {
        clearInterval(stateCheckInterval);
      };
    }
  }, [showInitialAnimation, game, currentState, hungerLevel]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      game.destroy();
    };
  }, [game]);

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
      <View style={styles.initialContainer}>
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
      {/* Barra de hambre en la parte superior */}
      <View style={styles.hungerBarContainer}>
        <HungerBar 
          currentHunger={hungerLevel} 
          maxHunger={game.getMaxHunger()} 
        />
      </View>

      {/* Contenedor del pollito */}
      <View style={styles.pollitoContainer}>
        <Pollito pollito={game} onStateChange={handleStateChange} />
      </View>
      
      {/* Botón de alimentar */}
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
  initialContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Fondo azul claro suave
    paddingTop: 50, // Espacio para el status bar
  },
  initialAnimation: {
    width: width * 0.8,
    height: height * 0.6,
  },
  hungerBarContainer: {
    paddingTop: 10,
  },
  pollitoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  feedButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 50,
    marginHorizontal: 20,
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
    textAlign: 'center',
  },
});

export default PetCareApp; 