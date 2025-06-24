import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { PollitoState } from '../types';
import { PollitoReanimated } from './PollitoReanimated';
import { HungryPollitoReanimated } from './HungryPollitoReanimated';
import HungerBar from './HungerBar';
import { PetCareGame } from '../classes/PetCareGame';

const { width, height } = Dimensions.get('window');

const PetCareAppReanimated: React.FC = () => {
  const [game] = useState(() => new PetCareGame());
  const [currentState, setCurrentState] = useState<PollitoState>(PollitoState.FELIZ);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);
  const [hungerLevel, setHungerLevel] = useState(100);
  const [points, setPoints] = useState(0);
  const [revivePoints, setRevivePoints] = useState(0);

  // Shared values para animaciones
  const buttonScale = useSharedValue(1);
  const containerOpacity = useSharedValue(0);

  // Timer para la animación inicial
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowInitialAnimation(false);
      containerOpacity.value = withTiming(1, { duration: 1000 });
    }, 3000); // 3 segundos para la animación inicial

    return () => clearTimeout(initialTimer);
  }, []);

  // Timer para monitorear el estado del juego
  useEffect(() => {
    if (!showInitialAnimation) {
      const stateCheckInterval = setInterval(() => {
        const newState = game.getCurrentState();
        const newHungerLevel = game.getHungerLevel();
        const newPoints = game.getPoints();
        const newRevivePoints = game.getRevivePoints();
        
        if (newState !== currentState) {
          setCurrentState(newState);
        }

        if (newHungerLevel !== hungerLevel) {
          setHungerLevel(newHungerLevel);
        }

        if (newPoints !== points) {
          setPoints(newPoints);
        }

        if (newRevivePoints !== revivePoints) {
          setRevivePoints(newRevivePoints);
        }
      }, 100);

      return () => {
        clearInterval(stateCheckInterval);
      };
    }
  }, [showInitialAnimation, game, currentState, hungerLevel, points, revivePoints]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      game.destroy();
    };
  }, [game]);

  const handleFeed = () => {
    // Animación del botón
    buttonScale.value = withSpring(0.95, {
      damping: 10,
      stiffness: 200,
    });

    setTimeout(() => {
      buttonScale.value = withSpring(1);
    }, 100);

    if (currentState === PollitoState.MUERTO) {
      if (game.canRevive()) {
        game.revive();
      }
    } else if (game.canFeed()) {
      game.feedPollito();
    }
  };

  const getButtonText = () => {
    if (currentState === PollitoState.MUERTO) {
      return revivePoints > 0 ? '💀 Revivir Pollito' : '💀 Sin puntos de revivir';
    }
    return '🍽️ Dar de comer';
  };

  const isButtonDisabled = () => {
    if (currentState === PollitoState.MUERTO) {
      return !game.canRevive();
    }
    return !game.canFeed();
  };

  // Estilos animados
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
    };
  });

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
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {/* Barra de hambre en la parte superior */}
      <View style={styles.hungerBarContainer}>
        <HungerBar 
          currentHunger={hungerLevel} 
          maxHunger={game.getMaxHunger()}
          points={points}
          revivePoints={revivePoints}
        />
      </View>

      {/* Contenedor del pollito */}
      <View style={styles.pollitoContainer}>
        <PollitoReanimated 
          currentState={currentState}
          hungerLevel={hungerLevel}
          maxHunger={game.getMaxHunger()}
        />
      </View>
      
      {/* Botón de alimentar */}
      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity 
          style={[
            styles.feedButton,
            isButtonDisabled() && styles.feedButtonDisabled
          ]} 
          onPress={handleFeed}
          disabled={isButtonDisabled()}
        >
          <Text style={styles.feedButtonText}>{getButtonText()}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
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

export default PetCareAppReanimated; 