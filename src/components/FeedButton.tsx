import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePollitoContext } from '../context/PollitoContext';
import { PollitoState } from '../types/pollito';

const FeedButton: React.FC = () => {
  const { pollito, feed, revive } = usePollitoContext();

  const getButtonText = () => {
    if (pollito.state === PollitoState.MUERTO) {
      return pollito.revivePoints > 0 ? '💀 Revivir Pollito' : '💀 Sin puntos de revivir';
    }
    return '🍽️ Dar de comer';
  };

  const isButtonDisabled = () => {
    if (pollito.state === PollitoState.MUERTO) {
      return pollito.revivePoints <= 0;
    }
    if (pollito.state === PollitoState.LLENO || pollito.state === PollitoState.COMIENDO) {
      return true;
    }
    return false;
  };

  const handlePress = () => {
    if (pollito.state === PollitoState.MUERTO) {
      revive();
    } else {
      feed();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.feedButton, isButtonDisabled() && styles.feedButtonDisabled]}
      onPress={handlePress}
      disabled={isButtonDisabled()}
    >
      <Text style={styles.feedButtonText}>{getButtonText()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default FeedButton; 