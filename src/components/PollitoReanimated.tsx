import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { PollitoState } from '../types';

const { width, height } = Dimensions.get('window');

interface PollitoReanimatedProps {
  currentState: PollitoState;
  hungerLevel: number;
  maxHunger: number;
}

export const PollitoReanimated: React.FC<PollitoReanimatedProps> = ({
  currentState,
}) => {
  const stateTransition = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    stateTransition.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    scale.value = withSpring(1.1, {
      damping: 10,
      stiffness: 200,
    });
    setTimeout(() => {
      scale.value = withSpring(1);
      stateTransition.value = withSpring(0);
    }, 300);
  }, [currentState]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: interpolate(
        stateTransition.value,
        [0, 1],
        [0.8, 1]
      ),
    };
  });

  // Mostrar solo texto para todos los estados
  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Text style={{fontSize: 32, color: 'blue'}}>{currentState.toUpperCase()}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.6,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 