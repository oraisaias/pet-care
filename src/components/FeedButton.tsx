import React, { useRef } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { usePollitoContext } from '../context/PollitoContext';
import { useFoodContext } from '../context/FoodContext';
import { PollitoState } from '../types/pollito';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler, PanGestureHandlerGestureEvent, HandlerStateChangeEvent } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAG_LIMIT_X = 40;
const DRAG_LIMIT_Y_UP = 0.75 * SCREEN_HEIGHT; // El botón debe salir del 25% inferior
const DRAG_LIMIT_Y_DOWN = 40;

export type FeedButtonDragProps = {
  onDropOnPollito?: (event: HandlerStateChangeEvent<Record<string, unknown>>) => void;
};

const FeedButton: React.FC<FeedButtonDragProps> = ({ onDropOnPollito }) => {
  const { pollito, feed, revive } = usePollitoContext();
  const { selectedFood, nextFood, prevFood } = useFoodContext();
  const buttonStartY = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartX = useRef<number | null>(null);

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

  // Drag limitado
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dragStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const getFoodImage = () => {
      case 'mazorca':
        return require('../../assets/comida/mazorca.png');
      case 'arroz':
        return require('../../assets/comida/arroz.png');
      case 'burguer':
        return require('../../assets/comida/burguer.png');
      case 'cocke':
        return require('../../assets/comida/cockie.png');
      case 'sandia':
        return require('../../assets/comida/sandia.png');
      default:
        return require('../../assets/comida/mazorca.png');
    }
  };

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    // Guardar posición inicial del drag
    if (dragStartY.current === null) dragStartY.current = event.nativeEvent.absoluteY;
    if (dragStartX.current === null) dragStartX.current = event.nativeEvent.absoluteX;
    // Limitar X
    let x = event.nativeEvent.translationX;
    if (x > DRAG_LIMIT_X) x = DRAG_LIMIT_X;
    if (x < -DRAG_LIMIT_X) x = -DRAG_LIMIT_X;
    // Limitar Y
    let y = event.nativeEvent.translationY;
    if (y < -DRAG_LIMIT_Y_UP) y = -DRAG_LIMIT_Y_UP; // hacia arriba
    if (y > DRAG_LIMIT_Y_DOWN) y = DRAG_LIMIT_Y_DOWN; // hacia abajo
    translateX.value = x;
    translateY.value = y;
  };

  const handleGestureEnd = (event: HandlerStateChangeEvent<Record<string, unknown>>) => {
    // Calcular desplazamiento total
    const endY = Number(event.nativeEvent.absoluteY);
    const endX = Number(event.nativeEvent.absoluteX);
    const deltaY = dragStartY.current !== null ? endY - dragStartY.current : 0;
    const deltaX = dragStartX.current !== null ? endX - dragStartX.current : 0;
    // Solo alimentar si el botón se arrastra fuera del 25% inferior (hacia arriba)
    if (
      dragStartY.current !== null &&
      endY < SCREEN_HEIGHT * 0.75 &&
      Math.abs(deltaY) > Math.abs(deltaX)
    ) {
      handlePress();
    } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > DRAG_LIMIT_X / 2) {
      // Cambiar alimento según la dirección
      if (deltaX > 0) {
        nextFood(); // Derecha = siguiente alimento
      } else {
        prevFood(); // Izquierda = alimento anterior
      }
    }
    // Reset
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    dragStartY.current = null;
    dragStartX.current = null;
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
                source={getFoodImage()}
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