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
    <View style={styles.container}>
      {pollito.state === PollitoState.COMIENDO ? (
        <Image
          source={pollitoImages.comiendo[comiendoFrame]}
          style={styles.pollitoImageLarge}
          resizeMode="contain"
        />
      ) : showImage && imageSource ? (
        <Image source={imageSource} style={styles.pollitoImageLarge} resizeMode="contain" />
      ) : null}
      <View style={styles.textContainer}>
        <Text style={styles.stateTextSmall}>{pollito.state.toUpperCase()}</Text>
        <Text style={styles.labelSmall}>{info.label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    // Sin borde ni fondo ni padding extra
  },
  pollitoImageLarge: {
    width: 260,
    height: 260,
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 2,
  },
  stateTextSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 1,
    color: '#888',
    textAlign: 'center',
  },
  labelSmall: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 