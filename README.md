# Pet Care App - Pollito Virtual

Una aplicación React Native con TypeScript que simula el cuidado de un pollito virtual, inspirada en Talking Tom pero simplificada.

## Características

### 🐤 Sistema de Pollito Virtual
- **Animación inicial**: El pollito sale del cascarón (`saliendo.json`)
- **Estados del pollito**:
  - **Feliz**: Muestra `lovely.json` en loop
  - **Hambriento**: Alterna entre `hambre.json` y `bell.json` cada segundo
  - **Comiendo**: Muestra `lovely.json` por 3 segundos

### 🍽️ Sistema de Hambre
- **Barra de hambre visual**: Muestra el nivel actual de hambre (0-100%)
- **Colores dinámicos**:
  - 🟢 Verde (70%+): "Lleno"
  - 🟠 Naranja (30-70%): "Normal" 
  - 🔴 Rojo (<30%): "Hambriento"
- **Decremento automático**: El hambre disminuye 1 punto por segundo
- **Alimentación**: Al dar de comer, recupera 30 puntos de hambre

### 🎮 Interfaz de Usuario
- **Diseño minimalista** con fondo azul claro
- **Barra de hambre** en la parte superior con porcentaje
- **Botón de alimentar** grande y accesible
- **Animaciones fluidas** con Lottie

## Arquitectura Orientada a Objetos

### Clases Principales

#### `Pollito`
- Maneja la lógica del comportamiento del pollito
- Controla estados y sistema de hambre
- Implementa `IPollitoBehavior`

#### `HungryAnimationController`
- Controla las animaciones del pollito hambriento
- Alterna entre animaciones automáticamente
- Implementa `IAnimationController`

#### `PetCareGame`
- Clase principal que coordina toda la aplicación
- Maneja la animación inicial y monitoreo de estado
- Implementa `IPollitoBehavior` (delega al pollito interno)

### Componentes React

#### `HungerBar`
- Muestra la barra de hambre visual
- Cambia colores según el nivel de hambre
- Incluye porcentaje y estado textual

#### `Pollito`
- Renderiza las animaciones según el estado
- Usa `HungryPollito` para el estado hambriento

#### `HungryPollito`
- Maneja las animaciones alternadas del pollito hambriento
- Usa `HungryAnimationController`

## Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación**:
   ```bash
   npm start
   ```

3. **Usar en dispositivo/simulador**:
   - Escanea el código QR con Expo Go
   - O presiona 'i' para iOS o 'a' para Android

## Tecnologías Utilizadas

- **React Native** con TypeScript
- **Expo** para desarrollo rápido
- **Lottie React Native** para animaciones
- **Paradigma Orientado a Objetos** para arquitectura limpia

## Estructura del Proyecto

```
src/
├── classes/           # Clases principales (OO)
│   ├── Pollito.ts
│   ├── AnimationController.ts
│   ├── PetCareGame.ts
│   └── index.ts
├── components/        # Componentes React
│   ├── Pollito.tsx
│   ├── HungryPollito.tsx
│   ├── HungerBar.tsx
│   └── PetCareApp.tsx
└── types/            # Tipos TypeScript
    └── index.ts
```

## Animaciones

Las animaciones están ubicadas en `assets/pollito/`:
- `saliendo.json`: Pollito saliendo del cascarón
- `lovely.json`: Pollito feliz
- `hambre.json`: Pollito hambriento
- `bell.json`: Pollito haciendo sonar campana (advertencia) 