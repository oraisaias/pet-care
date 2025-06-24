import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
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
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.feedButton, isButtonDisabled() && styles.feedButtonDisabled]}
        onPress={handlePress}
        disabled={isButtonDisabled()}
        activeOpacity={0.8}
      >
        <Text style={styles.feedButtonText}>{getButtonText()}</Text>
      </TouchableOpacity>
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
  feedButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    minWidth: 220,
  },
  feedButtonDisabled: {
    backgroundColor: '#cccccc',
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