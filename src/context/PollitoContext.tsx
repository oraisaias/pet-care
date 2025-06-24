import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { PollitoState, Pollito } from '../types/pollito';
import { useInterval } from '../hooks/useInterval';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { useFoodContext } from './FoodContext';

const STORAGE_KEY = 'POLLITO_STATE_V1';
const STORAGE_TIMESTAMP_KEY = 'POLLITO_TIMESTAMP_V1';

interface PollitoContextType {
  pollito: Pollito;
  setPollito: React.Dispatch<React.SetStateAction<Pollito>>;
  feed: () => void;
  revive: () => void;
  getTimeUntilHungry: () => number; // Retorna minutos restantes hasta que pueda tener hambre
}

const PollitoContext = createContext<PollitoContextType | undefined>(undefined);

// Función para generar tiempo aleatorio de digestión (0-159 minutos)
const generateDigestionTime = (): number => {
  return Math.floor(Math.random() * 160); // 0-159 minutos
};

export const PollitoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pollito, setPollito] = useState<Pollito>({
    state: PollitoState.FELIZ,
    hunger: 100,
    maxHunger: 100,
    points: 0,
    revivePoints: 0,
  });
  const appState = useRef(AppState.currentState);
  const { selectedFood } = useFoodContext();

  // Función para calcular tiempo restante hasta que pueda tener hambre
  const getTimeUntilHungry = useCallback((): number => {
    if (!pollito.digestionEndTime || pollito.state !== PollitoState.LLENO) {
      return 0;
    }
    const now = Date.now();
    const remainingMs = pollito.digestionEndTime - now;
    return Math.max(0, Math.ceil(remainingMs / (1000 * 60))); // Convertir a minutos
  }, [pollito.digestionEndTime, pollito.state]);

  // Persistir estado y timestamp cada vez que cambie
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pollito));
    AsyncStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
  }, [pollito]);

  // Rehidratar estado al montar
  useEffect(() => {
    const restoreState = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const savedTimestamp = await AsyncStorage.getItem(STORAGE_TIMESTAMP_KEY);
      if (saved && savedTimestamp) {
        const parsed: Pollito = JSON.parse(saved);
        const lastTimestamp = parseInt(savedTimestamp, 10);
        const now = Date.now();
        const elapsed = Math.floor((now - lastTimestamp) / 1000); // segundos
        let newPollito = { ...parsed };
        
        // Verificar si el pollito estaba lleno y ya terminó la digestión
        if (newPollito.state === PollitoState.LLENO && newPollito.digestionEndTime) {
          if (now >= newPollito.digestionEndTime) {
            // La digestión terminó, cambiar a feliz
            newPollito.state = PollitoState.FELIZ;
            delete newPollito.digestionEndTime;
          }
        }
        
        // Si no está muerto, lleno o comiendo, disminuir hambre según el tiempo transcurrido
        if (
          newPollito.state !== PollitoState.MUERTO &&
          newPollito.state !== PollitoState.LLENO &&
          newPollito.state !== PollitoState.COMIENDO
        ) {
          newPollito.hunger = Math.max(0, newPollito.hunger - elapsed);
          if (newPollito.hunger <= 0) {
            newPollito.state = PollitoState.MUERTO as PollitoState;
          } else if (newPollito.hunger <= 25) {
            newPollito.state = PollitoState.MUY_HAMBRIENTO as PollitoState;
          } else if (newPollito.hunger <= 50) {
            newPollito.state = PollitoState.HAMBRIENTO as PollitoState;
          } else {
            newPollito.state = PollitoState.FELIZ as PollitoState;
          }
        }
        setPollito(newPollito);
      }
    };
    restoreState();
  }, []);

  // AppState: recalcular estado al volver a foreground
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Restaurar y recalcular estado
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const savedTimestamp = await AsyncStorage.getItem(STORAGE_TIMESTAMP_KEY);
        if (saved && savedTimestamp) {
          const parsed: Pollito = JSON.parse(saved);
          const lastTimestamp = parseInt(savedTimestamp, 10);
          const now = Date.now();
          const elapsed = Math.floor((now - lastTimestamp) / 1000); // segundos
          let newPollito = { ...parsed };
          
          // Verificar si el pollito estaba lleno y ya terminó la digestión
          if (newPollito.state === PollitoState.LLENO && newPollito.digestionEndTime) {
            if (now >= newPollito.digestionEndTime) {
              // La digestión terminó, cambiar a feliz
              newPollito.state = PollitoState.FELIZ;
              delete newPollito.digestionEndTime;
            }
          }
          
          if (
            newPollito.state !== PollitoState.MUERTO &&
            newPollito.state !== PollitoState.LLENO &&
            newPollito.state !== PollitoState.COMIENDO
          ) {
            newPollito.hunger = Math.max(0, newPollito.hunger - elapsed);
            if (newPollito.hunger <= 0) {
              newPollito.state = PollitoState.MUERTO as PollitoState;
            } else if (newPollito.hunger <= 25) {
              newPollito.state = PollitoState.MUY_HAMBRIENTO as PollitoState;
            } else if (newPollito.hunger <= 50) {
              newPollito.state = PollitoState.HAMBRIENTO as PollitoState;
            } else {
              newPollito.state = PollitoState.FELIZ as PollitoState;
            }
          }
          setPollito(newPollito);
        }
      }
      appState.current = nextAppState;
    };
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      sub.remove();
    };
  }, []);

  // Disminuir hambre cada segundo si no está muerto, lleno o comiendo
  useInterval(() => {
    setPollito(p => {
      // Verificar si el pollito estaba lleno y ya terminó la digestión
      if (p.state === PollitoState.LLENO && p.digestionEndTime) {
        const now = Date.now();
        if (now >= p.digestionEndTime) {
          // La digestión terminó, cambiar a feliz
          return { ...p, state: PollitoState.FELIZ, digestionEndTime: undefined };
        }
        return p; // Aún está en digestión
      }
      
      if (
        p.state === PollitoState.MUERTO ||
        p.state === PollitoState.LLENO ||
        p.state === PollitoState.COMIENDO
      ) {
        return p;
      }
      const newHunger = Math.max(0, p.hunger - 1);
      let newState = p.state as PollitoState;
      if (newHunger <= 0) {
        newState = PollitoState.MUERTO as PollitoState;
      } else if (newHunger <= 25 && p.state !== PollitoState.MUY_HAMBRIENTO) {
        newState = PollitoState.MUY_HAMBRIENTO as PollitoState;
      } else if (newHunger <= 50 && newHunger > 25 && p.state !== PollitoState.HAMBRIENTO) {
        newState = PollitoState.HAMBRIENTO as PollitoState;
      } else if (newHunger > 50 && (p.state === PollitoState.HAMBRIENTO || p.state === PollitoState.MUY_HAMBRIENTO)) {
        newState = PollitoState.FELIZ as PollitoState;
      }
      return { ...p, hunger: newHunger, state: newState };
    });
  }, 1000);

  const feed = useCallback(() => {
    // Regeneración fija según el alimento, +2 a cada valor anterior
    let hungerGain = 4;
    switch (selectedFood) {
      case 'arroz':
        hungerGain = 5;
        break;
      case 'cocke':
        hungerGain = 6;
        break;
      case 'sandia':
        hungerGain = 7;
        break;
      case 'burguer':
        hungerGain = 9;
        break;
      case 'mazorca':
      default:
        hungerGain = 4;
        break;
    }
    setPollito(p => {
      if (
        p.state === PollitoState.MUERTO ||
        p.state === PollitoState.LLENO ||
        p.state === PollitoState.COMIENDO
      ) {
        return p;
      }
      const newHunger = Math.min(p.maxHunger, p.hunger + hungerGain);
      let newState = p.state as PollitoState;
      if (newHunger >= p.maxHunger) {
        // Generar tiempo de digestión aleatorio
        const digestionMinutes = generateDigestionTime();
        const digestionEndTime = Date.now() + (digestionMinutes * 60 * 1000);
        newState = PollitoState.LLENO as PollitoState;
        return { 
          ...p, 
          hunger: newHunger, 
          points: p.points + 1, 
          state: newState,
          digestionEndTime 
        };
      } else {
        newState = PollitoState.COMIENDO as PollitoState;
        return { ...p, hunger: newHunger, points: p.points + 1, state: newState };
      }
    });
    // Después de 3 segundos, volver a feliz si no está lleno
    setTimeout(() => {
      setPollito(p => {
        if (p.state === PollitoState.LLENO || p.state === PollitoState.MUERTO) return p;
        return { ...p, state: PollitoState.FELIZ as PollitoState };
      });
    }, 3000);
  }, [selectedFood]);

  const revive = useCallback(() => {
    setPollito(p => {
      if (p.state !== PollitoState.MUERTO || p.revivePoints <= 0) return p;
      return {
        ...p,
        hunger: 3,
        state: PollitoState.COMIENDO as PollitoState,
        revivePoints: p.revivePoints - 1,
      };
    });
    setTimeout(() => {
      setPollito(p => {
        if (p.state !== PollitoState.COMIENDO) return p;
        return { ...p, state: PollitoState.FELIZ as PollitoState };
      });
    }, 3000);
  }, []);

  // Dar punto de revive al morir
  useEffect(() => {
    if (pollito.state === PollitoState.MUERTO && pollito.hunger === 0) {
      setPollito(p => ({ ...p, revivePoints: p.revivePoints + 1 }));
    }
  }, [pollito.state, pollito.hunger]);

  return (
    <PollitoContext.Provider value={{ pollito, setPollito, feed, revive, getTimeUntilHungry }}>
      {children}
    </PollitoContext.Provider>
  );
};

export function usePollitoContext() {
  const ctx = useContext(PollitoContext);
  if (!ctx) throw new Error('usePollitoContext debe usarse dentro de PollitoProvider');
  return ctx;
} 