import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PollitoView } from './PollitoView';

const PollitoArea: React.FC = () => {
  // Aquí en el futuro se manejarán drops, animaciones, etc.
  return (
    <View style={styles.area}>
      <PollitoView />
    </View>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60, // espacio para el botón
    // Puedes agregar un fondo especial si quieres
  },
});

export default PollitoArea; 