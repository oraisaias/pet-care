import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

interface HungryPollitoReanimatedProps {
  hungerLevel: number;
  maxHunger: number;
}

export const HungryPollitoReanimated: React.FC<HungryPollitoReanimatedProps> = ({
  hungerLevel,
  maxHunger,
}) => {
  // Shared values para las animaciones
  const animationProgress = useSharedValue(0);
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  // Efecto para animaciones de hambre
  useEffect(() => {
    // Animación de escala basada en el nivel de hambre
    const hungerPercentage = hungerLevel / maxHunger;
    scale.value = withTiming(
      interpolate(hungerPercentage, [0, 0.5, 1], [0.8, 0.9, 1]),
      { duration: 500 }
    );

    // Animación de shake cuando está muy hambriento
    if (hungerLevel <= 20) {
      shake.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 100 }),
          withTiming(5, { duration: 100 }),
          withTiming(-5, { duration: 100 }),
          withTiming(0, { duration: 100 })
        ),
        -1,
        true
      );
    } else {
      shake.value = withTiming(0, { duration: 200 });
    }
  }, [hungerLevel, maxHunger]);

  // Estilos animados
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: shake.value },
      ],
    };
  });

  // Animación de alternancia entre hambre y campana
  const [showHambre, setShowHambre] = React.useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowHambre(prev => !prev);
    }, 2000); // Cambiar cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LottieView
        source={
          showHambre
            ? require('../../assets/pollito/hambre.json')
            : require('../../assets/pollito/bell.json')
        }
        style={styles.lottieAnimation}
        autoPlay
        loop
        speed={1}
      />
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
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
}); 