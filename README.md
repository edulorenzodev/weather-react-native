# WeatherApp - Aplicación del Tiempo con React Native

Una aplicación móvil sencilla que muestra el tiempo actual en tu ubicación usando Expo y React Native.

## Características

- 📍 Obtiene automáticamente tu ubicación actual
- 🌡️ Muestra temperatura actual y sensación térmica
- 🌤️ Iconos del tiempo con emojis
- 💧 Información detallada: humedad, viento, presión y visibilidad
- 🔄 Botón de actualizar para refrescar los datos
- 🔄 **Selector de proveedor**: Cambia entre WeatherAPI y OpenWeatherMap
- 📱 Diseño inspirado en las aplicaciones nativas de Android
- 🔌 **Arquitectura modular**: Fácil agregar nuevos proveedores

## Instalación y Uso

### Prerrequisitos
- Node.js instalado
- Expo CLI (`npm install -g @expo/cli`)
- Dispositivo móvil con la app Expo Go instalada

### Pasos para ejecutar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación:**
   ```bash
   npx expo start
   ```

3. **Abrir en tu dispositivo:**
   - Escanea el código QR con la app Expo Go (Android) o la cámara (iOS)
   - O ejecuta en emulador con `npm run android` o `npm run ios`

## Configuración de APIs

La aplicación soporta **múltiples proveedores** de datos meteorológicos:

### WeatherAPI.com (Configurado)
1. **Ya configurado** con una API key funcional
2. **Proveedor por defecto** en la aplicación
3. **Características:** Datos precisos, actualizaciones frecuentes

### OpenWeatherMap (Opcional)
1. **Obtener API key:**
   - Ve a [openweathermap.org](https://openweathermap.org/api)
   - Regístrate y obtén tu API key gratuita

2. **Configurar:**
   - Edita `hooks/useWeatherData.js`
   - Reemplaza `'tu_openweather_api_key_aqui'` con tu API key

3. **Usar:**
   - Cambia entre proveedores desde la app
   - O modifica el proveedor por defecto en el código

## Estructura del Proyecto

```
weather-react-native-ia-app/
├── App.js                 # Componente principal de UI
├── hooks/                 # Custom hooks para lógica de datos
│   ├── useWeatherData.js     # Hook para fetching de datos del tiempo
│   ├── index.js             # Exportaciones de hooks
│   └── README.md            # Documentación de hooks
├── package.json          # Dependencias
└── README.md            # Este archivo
```

## Próximas Mejoras

- [ ] Pronóstico de 7 días
- [ ] Búsqueda de ciudades
- [ ] Gráficos de temperatura
- [ ] Notificaciones del tiempo
- [ ] Temas día/noche
- [ ] Unidades métricas/imperiales

## Tecnologías Utilizadas

- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo
- **expo-location** - Geolocalización
- **WeatherAPI.com** - Proveedor principal de datos meteorológicos
- **OpenWeatherMap** - Proveedor alternativo de datos meteorológicos

## Permisos

La aplicación requiere:
- **Ubicación**: Para obtener el tiempo en tu posición actual

¡Disfruta tu aplicación del tiempo! 🌞

