import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { usePollitoContext } from '../context/PollitoContext';
import { PollitoState } from '../types/pollito';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler, PanGestureHandlerGestureEvent, HandlerStateChangeEvent } from 'react-native-gesture-handler';

export type FeedButtonDragProps = {
  onDropOnPollito?: (event: HandlerStateChangeEvent<Record<string, unknown>>) => void;
};

const FeedButton: React.FC<FeedButtonDragProps> = ({ onDropOnPollito }) => {
  const { pollito, feed, revive } = usePollitoContext();

  const isFeedDisabled = () => {
    if (pollito.state === PollitoState.MUERTO) return true;
    if (pollito.state === PollitoState.LLENO || pollito.state === PollitoState.COMIENDO) return true;
    return false;
  };

  const isReviveVisible = pollito.state === PollitoState.MUERTO;
  const canRevive = pollito.revivePoints > 0;

  // Animación de escala
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Drag
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dragStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Usar función para onGestureEvent en vez de Animated.event
  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    translateX.value = event.nativeEvent.translationX;
    translateY.value = event.nativeEvent.translationY;
  };

  const handleGestureEnd = (event: HandlerStateChangeEvent<Record<string, unknown>>) => {
    if (onDropOnPollito) {
      runOnJS(onDropOnPollito)(event);
    }
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (isReviveVisible && canRevive) {
      revive();
    } else if (!isReviveVisible) {
      feed();
    }
  };

  return (
    <View style={styles.buttonContainer}>
      {isReviveVisible ? (
        <TouchableOpacity
          style={[styles.reviveButton, !canRevive && styles.feedButtonDisabled]}
          onPress={handlePress}
          disabled={!canRevive}
          activeOpacity={0.8}
        >
          <Text style={styles.feedButtonText}>
            {canRevive ? '💀 Revivir Pollito' : '💀 Sin puntos de revivir'}
          </Text>
        </TouchableOpacity>
      ) : (
        <PanGestureHandler
          enabled={!isFeedDisabled()}
          onGestureEvent={handleGestureEvent}
          onEnded={handleGestureEnd}
        >
          <Animated.View style={[styles.feedCircle, dragStyle]}>
            <LinearGradient
              colors={["#fffbe7", "#fff176", "#ffe082"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
            />
            <View style={styles.centerContent}>
              <Image
                source={require('../../assets/comida/mazorca.png')}
                style={styles.mazorcaImg}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  feedCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#FFD600',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: '#FFD600',
    overflow: 'hidden',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mazorcaImg: {
    width: 54,
    height: 54,
  },
  reviveButton: {
    backgroundColor: '#BDBDBD',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    minWidth: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedButtonDisabled: {
    backgroundColor: '#cccccc',
    borderColor: '#cccccc',
  },
  feedButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default FeedButton; 