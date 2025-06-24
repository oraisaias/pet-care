import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePollitoContext } from '../context/PollitoContext';

const HungerBar: React.FC = () => {
  const { pollito } = usePollitoContext();
  const hungerPercentage = (pollito.hunger / pollito.maxHunger) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Hambre: {pollito.hunger} / {pollito.maxHunger} | Puntos: {pollito.points} | Revivir: {pollito.revivePoints}
      </Text>
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
  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  barBackground: {
    width: '100%',
    height: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: 20,
    borderRadius: 10,
  },
});

export default HungerBar; 