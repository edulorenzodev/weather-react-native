import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

// Configuración de APIs
const WEATHER_API_CONFIG = {
  weatherapi: {
    key: 'INCLUIR_TU_API_KEY_AQUI', // Obtener en https://www.weatherapi.com/
    baseUrl: 'https://api.weatherapi.com/v1',
    getCurrentWeather: (lat, lon, apiKey) =>
      `${WEATHER_API_CONFIG.weatherapi.baseUrl}/current.json?key=${apiKey}&q=${lat},${lon}&lang=es`
  },

  openweathermap: {
    key: 'INCLUIR_TU_API_KEY_AQUI', // Obtener en https://openweathermap.org/api
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    getCurrentWeather: (lat, lon, apiKey) =>
      `${WEATHER_API_CONFIG.openweathermap.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
  }

  // Otros proveedores se pueden agregar aquí:
  // accuweather: { ... },
  // darksky: { ... }
};

// Función para mapear las condiciones de WeatherAPI a nuestros tipos
const getWeatherCondition = (conditionText) => {
  const condition = conditionText.toLowerCase();
  if (condition.includes('sun') || condition.includes('clear')) return 'Clear';
  if (condition.includes('cloud') || condition.includes('overcast')) return 'Clouds';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'Rain';
  if (condition.includes('snow') || condition.includes('blizzard')) return 'Snow';
  if (condition.includes('thunder') || condition.includes('storm')) return 'Thunderstorm';
  return 'Clouds'; // default
};

// Adaptadores para diferentes APIs
const weatherProviders = {
  weatherapi: {
    fetchWeather: async (latitude, longitude) => {
      const url = WEATHER_API_CONFIG.weatherapi.getCurrentWeather(
        latitude,
        longitude,
        WEATHER_API_CONFIG.weatherapi.key
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error de API WeatherAPI: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Datos de WeatherAPI: ${JSON.stringify(data)}`);

      // Transformar datos de WeatherAPI al formato estándar
      return {
        name: data.location.name + ', ' + data.location.country,
        main: {
          temp: data.current.temp_c,
          feels_like: data.current.feelslike_c,
          humidity: data.current.humidity,
          pressure: data.current.pressure_mb
        },
        weather: [{
          main: getWeatherCondition(data.current.condition.text),
          description: data.current.condition.text.toLowerCase(),
          icon: data.current.condition.icon
        }],
        wind: {
          speed: data.current.wind_kph
        },
        visibility: data.current.vis_km
      };
    }
  },

  openweathermap: {
    fetchWeather: async (latitude, longitude) => {
      const url = WEATHER_API_CONFIG.openweathermap.getCurrentWeather(
        latitude,
        longitude,
        WEATHER_API_CONFIG.openweathermap.key
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error de API OpenWeather: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Datos de OpenWeather: ${JSON.stringify(data)}`);

      // Transformar datos de OpenWeatherMap al formato estándar
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
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        }],
        wind: {
          speed: Math.round(data.wind.speed * 3.6 * 10) / 10
        },
        visibility: data.visibility ? (data.visibility / 1000) : 10 // convertir m a km, default 10km si no disponible
      };
    }
  }

  // Otros proveedores se pueden agregar aquí:
  // accuweather: { ... },
  // darksky: { ... }
};

export const useWeatherData = (provider = 'weatherapi') => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const getWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Pedir permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      // Obtener ubicación actual
      let locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      setLocation({ latitude, longitude });

      // Validar que el proveedor existe
      if (!weatherProviders[provider]) {
        throw new Error(`Proveedor no soportado: ${provider}`);
      }

      // Llamar al proveedor seleccionado
      const data = await weatherProviders[provider].fetchWeather(latitude, longitude);
      setWeatherData(data);

    } catch (err) {
      setError('Error al obtener datos del tiempo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherData();
  }, [provider]);

  return {
    weatherData,
    loading,
    error,
    location,
    refetch: getWeatherData,
    // Información del proveedor actual
    currentProvider: provider,
    availableProviders: Object.keys(weatherProviders)
  };
};

export default useWeatherData;

