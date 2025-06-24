import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

export const PollitoView: React.FC = () => {
  const { pollito } = usePollitoContext();
  const info = stateInfo[pollito.state];

  return (
    <View style={[styles.container, { borderColor: info.color }]}> 
      <Text style={[styles.emoji, { color: info.color }]}>{info.emoji}</Text>
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