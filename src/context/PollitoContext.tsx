import React, { createContext, useContext, useState, useCallback } from 'react';
import { PollitoState, Pollito } from '../types/pollito';
import { useInterval } from '../hooks/useInterval';

interface PollitoContextType {
  pollito: Pollito;
  setPollito: React.Dispatch<React.SetStateAction<Pollito>>;
  feed: () => void;
  revive: () => void;
}

const PollitoContext = createContext<PollitoContextType | undefined>(undefined);

export const PollitoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pollito, setPollito] = useState<Pollito>({
    state: PollitoState.FELIZ,
    hunger: 100,
    maxHunger: 100,
    points: 0,
    revivePoints: 0,
  });

  // Disminuir hambre cada segundo si no está muerto, lleno o comiendo
  useInterval(() => {
    setPollito(p => {
      if (
        p.state === PollitoState.MUERTO ||
        p.state === PollitoState.LLENO ||
        p.state === PollitoState.COMIENDO
      ) {
        return p;
      }
      const newHunger = Math.max(0, p.hunger - 1);
      let newState = p.state;
      if (newHunger <= 0) {
        newState = PollitoState.MUERTO;
      } else if (newHunger <= 50 && p.state !== PollitoState.HAMBRIENTO) {
        newState = PollitoState.HAMBRIENTO;
      } else if (newHunger > 50 && p.state === PollitoState.HAMBRIENTO) {
        newState = PollitoState.FELIZ;
      }
      return { ...p, hunger: newHunger, state: newState };
    });
  }, 1000);

  const feed = useCallback(() => {
    setPollito(p => {
      if (
        p.state === PollitoState.MUERTO ||
        p.state === PollitoState.LLENO ||
        p.state === PollitoState.COMIENDO
      ) {
        return p;
      }
      const newHunger = Math.min(p.maxHunger, p.hunger + 3);
      let newState = p.state;
      if (newHunger >= p.maxHunger) {
        newState = PollitoState.LLENO;
      } else {
        newState = PollitoState.COMIENDO;
      }
      return { ...p, hunger: newHunger, points: p.points + 1, state: newState };
    });
    // Después de 3 segundos, volver a feliz si no está lleno
    setTimeout(() => {
      setPollito(p => {
        if (p.state === PollitoState.LLENO || p.state === PollitoState.MUERTO) return p;
        return { ...p, state: PollitoState.FELIZ };
      });
    }, 3000);
  }, []);

  const revive = useCallback(() => {
    setPollito(p => {
      if (p.state !== PollitoState.MUERTO || p.revivePoints <= 0) return p;
      return {
        ...p,
        hunger: 3,
        state: PollitoState.COMIENDO,
        revivePoints: p.revivePoints - 1,
      };
    });
    setTimeout(() => {
      setPollito(p => {
        if (p.state !== PollitoState.COMIENDO) return p;
        return { ...p, state: PollitoState.FELIZ };
      });
    }, 3000);
  }, []);

  // Cambiar a feliz después de estar lleno por 10 segundos
  React.useEffect(() => {
    if (pollito.state === PollitoState.LLENO) {
      const timer = setTimeout(() => {
        setPollito(p => {
          if (p.state === PollitoState.LLENO) {
            return { ...p, state: PollitoState.FELIZ };
          }
          return p;
        });
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [pollito.state]);

  // Dar punto de revive al morir
  React.useEffect(() => {
    if (pollito.state === PollitoState.MUERTO && pollito.hunger === 0) {
      setPollito(p => ({ ...p, revivePoints: p.revivePoints + 1 }));
    }
  }, [pollito.state, pollito.hunger]);

  return (
    <PollitoContext.Provider value={{ pollito, setPollito, feed, revive }}>
      {children}
    </PollitoContext.Provider>
  );
};

export function usePollitoContext() {
  const ctx = useContext(PollitoContext);
  if (!ctx) throw new Error('usePollitoContext debe usarse dentro de PollitoProvider');
  return ctx;
} 