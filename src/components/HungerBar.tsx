import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HungerBarProps } from '../types';

const HungerBar: React.FC<HungerBarProps> = ({ currentHunger, maxHunger }) => {
  const hungerPercentage = (currentHunger / maxHunger) * 100;
  
  const getBarColor = () => {
    if (hungerPercentage > 70) return '#4CAF50'; // Verde
    if (hungerPercentage > 30) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

  const getHungerText = () => {
    if (hungerPercentage > 70) return 'Lleno';
    if (hungerPercentage > 30) return 'Normal';
    return 'Hambriento';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ Hambre</Text>
        <Text style={styles.percentage}>{Math.round(hungerPercentage)}%</Text>
      </View>
      
      <View style={styles.barContainer}>
        <View style={styles.backgroundBar}>
          <View 
            style={[
              styles.fillBar, 
              { 
                width: `${hungerPercentage}%`,
                backgroundColor: getBarColor()
              }
            ]} 
          />
        </View>
      </View>
      
      <Text style={[styles.statusText, { color: getBarColor() }]}>
        {getHungerText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  barContainer: {
    marginBottom: 8,
  },
  backgroundBar: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HungerBar; 