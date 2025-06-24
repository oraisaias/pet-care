import React, { createContext, useContext, useState } from 'react';

export type FoodType = 'mazorca' | 'arroz' | 'burguer' | 'cocke' | 'sandia';

interface FoodContextType {
  selectedFood: FoodType;
  setSelectedFood: (food: FoodType) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFood, setSelectedFood] = useState<FoodType>('mazorca');

  return (
    <FoodContext.Provider value={{ selectedFood, setSelectedFood }}>
      {children}
    </FoodContext.Provider>
  );
};

export function useFoodContext() {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error('useFoodContext debe usarse dentro de FoodProvider');
  return ctx;
} 