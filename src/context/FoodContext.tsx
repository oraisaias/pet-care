import React, { createContext, useContext, useState } from 'react';

export type FoodType = 'mazorca' | 'arroz' | 'burguer' | 'cocke' | 'sandia';

const FOOD_ORDER: FoodType[] = ['mazorca', 'arroz', 'burguer', 'cocke', 'sandia'];

interface FoodContextType {
  selectedFood: FoodType;
  setSelectedFood: (food: FoodType) => void;
  nextFood: () => void;
  prevFood: () => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFood, setSelectedFood] = useState<FoodType>('mazorca');

  const nextFood = () => {
    const currentIndex = FOOD_ORDER.indexOf(selectedFood);
    const nextIndex = (currentIndex + 1) % FOOD_ORDER.length;
    setSelectedFood(FOOD_ORDER[nextIndex]);
  };

  const prevFood = () => {
    const currentIndex = FOOD_ORDER.indexOf(selectedFood);
    const prevIndex = currentIndex === 0 ? FOOD_ORDER.length - 1 : currentIndex - 1;
    setSelectedFood(FOOD_ORDER[prevIndex]);
  };

  return (
    <FoodContext.Provider value={{ selectedFood, setSelectedFood, nextFood, prevFood }}>
      {children}
    </FoodContext.Provider>
  );
};

export function useFoodContext() {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error('useFoodContext debe usarse dentro de FoodProvider');
  return ctx;
} 