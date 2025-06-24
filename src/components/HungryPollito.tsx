import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { HungryPollitoProps } from '../types';
import { HungryAnimationController } from '../classes/AnimationController';

const HungryPollito: React.FC<HungryPollitoProps> = ({ onStateChange }) => {
  const [animationController] = useState(() => new HungryAnimationController());
  const [currentAnimation, setCurrentAnimation] = useState<'hambre' | 'bell'>('hambre');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation(animationController.getCurrentAnimation() as 'hambre' | 'bell');
    }, 100);

    return () => {
      clearInterval(interval);
      animationController.destroy();
    };
  }, [animationController]);

  return (
    <View style={styles.container}>
      <LottieView
        source={
          currentAnimation === 'hambre' 
            ? require('../../assets/pollito/hambre.json')
            : require('../../assets/pollito/bell.json')
        }
        autoPlay
        loop
        style={styles.animation}
      />
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
});

export default HungryPollito; 