import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWeatherData } from './hooks/useWeatherData';

export default function App() {
  const [selectedProvider, setSelectedProvider] = useState('weatherapi');

  // Usar el custom hook para manejar todos los datos del tiempo
  const { weatherData, loading, error, refetch, currentProvider, availableProviders } = useWeatherData(selectedProvider);

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      case 'Snow': return '❄️';
      case 'Thunderstorm': return '⛈️';
      default: return '🌤️';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Obteniendo datos del tiempo...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />

      {/* Selector de proveedor */}
      <View style={styles.providerSelector}>
        <Text style={styles.providerLabel}>Proveedor de API:</Text>
        <View style={styles.providerButtons}>
          {availableProviders.map((provider) => (
            <TouchableOpacity
              key={provider}
              style={[
                styles.providerButton,
                selectedProvider === provider && styles.providerButtonActive
              ]}
              onPress={() => setSelectedProvider(provider)}
            >
              <Text style={[
                styles.providerButtonText,
                selectedProvider === provider && styles.providerButtonTextActive
              ]}>
                {provider === 'weatherapi' ? 'WeatherAPI' : 'OpenWeather'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.header}>
        <View>
          <Text style={styles.cityName}>{weatherData.name}</Text>
          <Text style={styles.providerInfo}>📡 {currentProvider === 'weatherapi' ? 'WeatherAPI.com' : 'OpenWeatherMap.org'}</Text>
        </View>
        <TouchableOpacity onPress={refetch} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainWeather}>
        <Text style={styles.weatherIcon}>
          {getWeatherIcon(weatherData.weather[0].main)}
        </Text>
        <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°</Text>
        <Text style={styles.description}>{weatherData.weather[0].description}</Text>
        <Text style={styles.feelsLike}>
          Sensación térmica {Math.round(weatherData.main.feels_like)}°
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>💧</Text>
            <Text style={styles.detailLabel}>Humedad</Text>
            <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🌪️</Text>
            <Text style={styles.detailLabel}>Viento</Text>
            <Text style={styles.detailValue}>{weatherData.wind.speed} km/h</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🔽</Text>
            <Text style={styles.detailLabel}>Presión</Text>
            <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>👁️</Text>
            <Text style={styles.detailLabel}>Visibilidad</Text>
            <Text style={styles.detailValue}>{weatherData.visibility} km</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: 20,
  },

  // Estilos para el selector de proveedor
  providerSelector: {
    marginTop: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  providerLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  providerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  providerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
  },
  providerButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  providerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  providerButtonTextActive: {
    color: '#4A90E2',
  },

  providerInfo: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  refreshButton: {
    padding: 10,
  },
  refreshIcon: {
    fontSize: 20,
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 40,
  },
  weatherIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '100',
    color: 'white',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    color: 'white',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  feelsLike: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  details: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: 'white',
  },
  errorText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
