import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useFoodContext, FoodType } from '../context/FoodContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FOOD_ITEMS: { type: FoodType; name: string; image: any }[] = [
  { type: 'mazorca', name: 'Mazorca', image: require('../../assets/comida/mazorca.png') },
  { type: 'arroz', name: 'Arroz', image: require('../../assets/comida/arroz.png') },
  { type: 'burguer', name: 'Hamburguesa', image: require('../../assets/comida/burguer.png') },
  { type: 'cocke', name: 'Galleta', image: require('../../assets/comida/cockie.png') },
  { type: 'sandia', name: 'Sandía', image: require('../../assets/comida/sandia.png') },
];

interface FoodSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const FoodSelectionModal: React.FC<FoodSelectionModalProps> = ({ isVisible, onClose }) => {
  const { selectedFood, setSelectedFood } = useFoodContext();

  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withSpring(1);
    } else {
      translateY.value = withSpring(300);
      opacity.value = withSpring(0);
    }
  }, [isVisible]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleFoodSelect = (foodType: FoodType) => {
    setSelectedFood(foodType);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
      <Animated.View style={[styles.modal, modalStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccionar Alimento</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.foodRow}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={{ height: '100%' }}
        >
          {FOOD_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={[
                styles.foodItem,
                selectedFood === item.type && styles.selectedFoodItem,
                { height: '100%' },
              ]}
              onPress={() => {
                setSelectedFood(item.type);
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Image source={item.image} style={styles.foodImage} resizeMode="contain" />
              <Text style={[
                styles.foodName,
                selectedFood === item.type && styles.selectedFoodName,
              ]}>
                {item.name}
              </Text>
              {selectedFood === item.type && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  overlayTouch: {
    flex: 1,
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.3,
    minHeight: 0,
    paddingTop: 16,
    paddingBottom: 0,
    paddingHorizontal: 16,
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  foodItem: {
    width: 100,
    height: 110,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedFoodItem: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  foodImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  selectedFoodName: {
    color: '#d68910',
    fontWeight: 'bold',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FoodSelectionModal; 