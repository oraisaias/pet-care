import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HungerBarProps } from '../types';

const HungerBar: React.FC<HungerBarProps> = ({ currentHunger, maxHunger, points, revivePoints }) => {
  const hungerPercentage = (currentHunger / maxHunger) * 100;
  
  const getBarColor = () => {
    if (hungerPercentage <= 0) return '#9E9E9E'; // Gris para muerto
    if (hungerPercentage >= 100) return '#8BC34A'; // Verde más claro para lleno
    if (hungerPercentage > 70) return '#4CAF50'; // Verde
    if (hungerPercentage > 30) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

  const getHungerText = () => {
    if (hungerPercentage <= 0) return '💀 Muerto';
    if (hungerPercentage >= 100) return '¡Lleno!';
    if (hungerPercentage > 70) return 'Lleno';
    if (hungerPercentage > 30) return 'Normal';
    return 'Hambriento';
  };

  const getHungerEmoji = () => {
    if (hungerPercentage <= 0) return '💀';
    if (hungerPercentage >= 100) return '😋';
    if (hungerPercentage > 70) return '🍽️';
    if (hungerPercentage > 30) return '🍽️';
    return '🍽️';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.hungerSection}>
          <Text style={styles.title}>{getHungerEmoji()} Hambre</Text>
          <Text style={styles.percentage}>{Math.round(hungerPercentage)}%</Text>
        </View>
        <View style={styles.pointsContainer}>
          <View style={styles.pointsSection}>
            <Text style={styles.pointsTitle}>⭐ Puntos</Text>
            <Text style={styles.pointsValue}>{points}</Text>
          </View>
          {revivePoints > 0 && (
            <View style={styles.reviveSection}>
              <Text style={styles.reviveTitle}>💀 Revivir</Text>
              <Text style={styles.reviveValue}>{revivePoints}</Text>
            </View>
          )}
        </View>
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
  hungerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pointsSection: {
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  reviveSection: {
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9C27B0',
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
  pointsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E65100',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
  },
  reviveTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#7B1FA2',
  },
  reviveValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
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