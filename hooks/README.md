# Hooks de la Aplicación del Tiempo

Este directorio contiene los custom hooks que manejan la lógica de fetching de datos para la aplicación del tiempo.

## useWeatherData

Custom hook que maneja la obtención de datos meteorológicos de diferentes proveedores de APIs.

### Uso básico:

```javascript
import { useWeatherData } from './hooks/useWeatherData';

function WeatherComponent() {
  const { weatherData, loading, error, refetch } = useWeatherData('weatherapi');
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{weatherData.name}</h1>
      <p>{weatherData.main.temp}°C</p>
      <button onClick={refetch}>Actualizar</button>
    </div>
  );
}
```

### Parámetros:

- `provider` (string, opcional): El proveedor de API a usar. Por defecto: `'weatherapi'`

### Retorna:

- `weatherData`: Objeto con los datos del tiempo en formato estándar
- `loading`: Boolean que indica si está cargando
- `error`: String con el mensaje de error (null si no hay error)
- `location`: Objeto con las coordenadas actuales
- `refetch`: Función para volver a obtener los datos
- `currentProvider`: String con el proveedor actual
- `availableProviders`: Array con los proveedores disponibles

### Formato estándar de datos:

```javascript
{
  name: "Ciudad, País",
  main: {
    temp: 22.5,
    feels_like: 24.1,
    humidity: 65,
    pressure: 1013
  },
  weather: [{
    main: "Clouds",
    description: "parcialmente nublado",
    icon: "url_del_icono"
  }],
  wind: {
    speed: 15.5
  },
  visibility: 10
}
```

## Agregar un nuevo proveedor de API

Para agregar un nuevo proveedor (ej: OpenWeatherMap, AccuWeather), sigue estos pasos:

### 1. Configurar las credenciales

En `useWeatherData.js`, agregar la configuración en `WEATHER_API_CONFIG`:

```javascript
const WEATHER_API_CONFIG = {
  weatherapi: { /* configuración existente */ },
  
  // Nuevo proveedor
  openweathermap: {
    key: 'tu_api_key_aquí',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    getCurrentWeather: (lat, lon, apiKey) => 
      `${WEATHER_API_CONFIG.openweathermap.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
  }
};
```

### 2. Crear el adaptador

Agregar el adaptador en `weatherProviders`:

```javascript
const weatherProviders = {
  weatherapi: { /* adaptador existente */ },
  
  // Nuevo adaptador
  openweathermap: {
    fetchWeather: async (latitude, longitude) => {
      const url = WEATHER_API_CONFIG.openweathermap.getCurrentWeather(
        latitude, 
        longitude, 
        WEATHER_API_CONFIG.openweathermap.key
      );
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transformar al formato estándar
      return {
        name: `${data.name}, ${data.sys.country}`,
        main: {
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          pressure: data.main.pressure
        },
        weather: [{
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
        }],
        wind: {
          speed: data.wind.speed * 3.6 // convertir m/s a km/h
        },
        visibility: data.visibility / 1000 // convertir m a km
      };
    }
  }
};
```

### 3. Usar el nuevo proveedor

```javascript
// En tu componente
import { useWeatherData } from './hooks/useWeatherData';
const { weatherData, loading, error } = useWeatherData('openweathermap');
```

## Ventajas de esta arquitectura

✅ **Separación de responsabilidades**: La UI no conoce los detalles de las APIs  
✅ **Fácil intercambio**: Cambiar de proveedor es solo cambiar un parámetro  
✅ **Formato estándar**: Todos los proveedores devuelven el mismo formato  
✅ **Extensible**: Agregar nuevos proveedores es simple y no afecta el código existente  
✅ **Testeable**: Cada adaptador se puede testear independientemente  
✅ **Reutilizable**: El hook se puede usar en cualquier parte de la aplicación  

## Consideraciones

- Todas las APIs deben transformar sus datos al formato estándar
- Los errores deben manejarse consistentemente
- Las unidades deben ser métricas (Celsius, km/h, km)
- El idioma debe ser español cuando sea posible

