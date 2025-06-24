import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePollitoContext } from '../context/PollitoContext';

const HungerBar: React.FC = () => {
  const { pollito } = usePollitoContext();
  const hungerPercentage = (pollito.hunger / pollito.maxHunger) * 100;

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
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Revivir</Text>
          <Text style={styles.value}>{pollito.revivePoints}</Text>
        </View>
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