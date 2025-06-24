import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePollitoContext } from '../context/PollitoContext';
import { PollitoState } from '../types/pollito';

const HungerBar: React.FC = () => {
  const { pollito, getTimeUntilHungry } = usePollitoContext();
  const [countdown, setCountdown] = useState<number>(0);
  const hungerPercentage = (pollito.hunger / pollito.maxHunger) * 100;

  // Actualizar countdown cada minuto
  useEffect(() => {
    if (pollito.state === PollitoState.LLENO) {
      const updateCountdown = () => {
        setCountdown(getTimeUntilHungry());
      };
      
      // Actualizar inmediatamente
      updateCountdown();
      
      // Actualizar cada minuto
      const interval = setInterval(updateCountdown, 60000);
      
      return () => clearInterval(interval);
    } else {
      setCountdown(0);
    }
  }, [pollito.state, getTimeUntilHungry]);

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const renderThirdBlock = () => {
    if (pollito.state === PollitoState.LLENO) {
      return (
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Próxima comida</Text>
          <Text style={styles.value}>{formatTime(countdown)}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Revivir</Text>
          <Text style={styles.value}>{pollito.revivePoints}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Hambre</Text>
          <Text style={styles.value}>{pollito.hunger} / {pollito.maxHunger}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Puntos</Text>
          <Text style={styles.value}>{pollito.points}</Text>
        </View>
        {renderThirdBlock()}
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${hungerPercentage}%`,
              backgroundColor: pollito.hunger > 50 ? '#4CAF50' : '#FF9800',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBlock: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  barBackground: {
    width: '100%',
    height: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 6,
  },
  barFill: {
    height: 16,
    borderRadius: 8,
  },
});

export default HungerBar; 