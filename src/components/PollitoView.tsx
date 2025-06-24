import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { usePollitoContext } from '../context/PollitoContext';
import { PollitoState } from '../types/pollito';

const stateInfo = {
  [PollitoState.FELIZ]: {
    color: '#4CAF50',
    emoji: '😊',
    label: '¡Estoy feliz!'
  },
  [PollitoState.HAMBRIENTO]: {
    color: '#FF9800',
    emoji: '😋',
    label: '¡Tengo hambre!'
  },
  [PollitoState.MUY_HAMBRIENTO]: {
    color: '#e53935',
    emoji: '🥵',
    label: '¡Tengo MUCHA hambre!'
  },
  [PollitoState.LLENO]: {
    color: '#8BC34A',
    emoji: '🟢',
    label: '¡Estoy lleno!'
  },
  [PollitoState.COMIENDO]: {
    color: '#2196F3',
    emoji: '🍽️',
    label: '¡Comiendo!'
  },
  [PollitoState.MUERTO]: {
    color: '#BDBDBD',
    emoji: '💀',
    label: '¡He muerto!'
  },
};

const pollitoImages = {
  [PollitoState.FELIZ]: require('../../assets/pollito/feliz.png'),
  [PollitoState.HAMBRIENTO]: require('../../assets/pollito/hambriento.png'),
  [PollitoState.MUY_HAMBRIENTO]: require('../../assets/pollito/muy_hambriento.png'),
  [PollitoState.LLENO]: require('../../assets/pollito/gordito.png'),
  [PollitoState.MUERTO]: require('../../assets/comida/dead.png'),
  comiendo: [
    require('../../assets/pollito/comiendo_izquierdo.png'),
    require('../../assets/pollito/comiendo_derecho.png'),
  ],
};

export const PollitoView: React.FC = () => {
  const { pollito } = usePollitoContext();
  const info = stateInfo[pollito.state];
  const showImage =
    pollito.state === PollitoState.LLENO ||
    pollito.state === PollitoState.MUERTO ||
    pollito.state === PollitoState.FELIZ ||
    pollito.state === PollitoState.HAMBRIENTO ||
    pollito.state === PollitoState.MUY_HAMBRIENTO;
  const imageSource = pollito.state === PollitoState.LLENO
    ? pollitoImages[PollitoState.LLENO]
    : pollito.state === PollitoState.MUERTO
      ? pollitoImages[PollitoState.MUERTO]
      : pollito.state === PollitoState.FELIZ
        ? pollitoImages[PollitoState.FELIZ]
        : pollito.state === PollitoState.HAMBRIENTO
          ? pollitoImages[PollitoState.HAMBRIENTO]
          : pollito.state === PollitoState.MUY_HAMBRIENTO
            ? pollitoImages[PollitoState.MUY_HAMBRIENTO]
            : undefined;

  // Animación de comiendo
  const [comiendoFrame, setComiendoFrame] = useState(0);
  useEffect(() => {
    if (pollito.state === PollitoState.COMIENDO) {
      setComiendoFrame(0);
      const interval = setInterval(() => {
        setComiendoFrame(f => (f === 0 ? 1 : 0));
      }, 400);
      return () => clearInterval(interval);
    } else {
      setComiendoFrame(0);
    }
  }, [pollito.state]);

  return (
    <View style={[styles.container, { borderColor: info.color }]}> 
      {pollito.state === PollitoState.COMIENDO ? (
        <Image
          source={pollitoImages.comiendo[comiendoFrame]}
          style={styles.pollitoImage}
          resizeMode="contain"
        />
      ) : showImage && imageSource ? (
        <Image source={imageSource} style={styles.pollitoImage} resizeMode="contain" />
      ) : (
        <Text style={[styles.emoji, { color: info.color }]}>{info.emoji}</Text>
      )}
      <Text style={[styles.stateText, { color: info.color }]}>{pollito.state.toUpperCase()}</Text>
      <Text style={styles.label}>{info.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    borderWidth: 4,
    borderRadius: 24,
    padding: 32,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  pollitoImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  stateText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 2,
  },
  label: {
    fontSize: 20,
    color: '#333',
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 