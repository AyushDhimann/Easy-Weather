'use client';

import { useState, useEffect, useCallback } from 'react';
import { getForecast, ForecastResponse } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import CurrentWeatherCard from '@/components/CurrentWeatherCard';
import ForecastCard from '@/components/ForecastCard';
import HourlyForecast from '@/components/HourlyForecast';
import AstroCard from '@/components/AstroCard';
import WeatherAlerts from '@/components/WeatherAlerts';
import GeolocationPrompt from '@/components/GeolocationPrompt';
import { Loader2, CloudRain } from 'lucide-react';

type AppState = 'prompt' | 'loading' | 'ready' | 'error';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('prompt');
  const [weather, setWeather] = useState<ForecastResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const fetchWeather = useCallback(async (query: string) => {
    setAppState('loading');
    setError('');
    try {
      const data = await getForecast(query, 3);
      setWeather(data);
      setAppState('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setAppState('error');
    }
  }, []);

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setShowSearch(true);
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
        setIsLoadingLocation(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to get your location. Please search for a city instead.');
        setShowSearch(true);
        setIsLoadingLocation(false);
        setAppState('prompt');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchWeather]);

  const handleLocationSelect = useCallback(
    (query: string) => {
      fetchWeather(query);
    },
    [fetchWeather]
  );

  const handleManualSearch = () => {
    setShowSearch(true);
    setAppState('prompt');
  };

  // Check for stored preference on mount
  useEffect(() => {
    const stored = localStorage.getItem('weatherLocation');
    if (stored) {
      fetchWeather(stored);
    }
  }, [fetchWeather]);

  // Store last location
  useEffect(() => {
    if (weather?.location) {
      const loc = `${weather.location.lat},${weather.location.lon}`;
      localStorage.setItem('weatherLocation', loc);
    }
  }, [weather?.location]);

  // Determine background gradient based on weather
  const getBackgroundClass = () => {
    if (!weather) return 'from-slate-900 via-blue-900 to-slate-800';
    const isDay = weather.current.is_day === 1;
    const code = weather.current.condition.code;

    // Clear
    if (code === 1000) {
      return isDay
        ? 'from-blue-400 via-blue-600 to-blue-800'
        : 'from-slate-900 via-indigo-900 to-slate-800';
    }
    // Cloudy
    if (code >= 1003 && code <= 1009) {
      return isDay
        ? 'from-gray-400 via-gray-500 to-gray-600'
        : 'from-gray-800 via-gray-900 to-slate-900';
    }
    // Rain
    if ((code >= 1063 && code <= 1201) || (code >= 1240 && code <= 1246)) {
      return 'from-gray-700 via-slate-800 to-gray-900';
    }
    // Snow
    if ((code >= 1210 && code <= 1237) || (code >= 1255 && code <= 1264)) {
      return 'from-slate-400 via-slate-500 to-slate-700';
    }
    // Thunderstorm
    if (code >= 1273 && code <= 1282) {
      return 'from-gray-900 via-purple-900 to-gray-900';
    }

    return isDay
      ? 'from-blue-500 via-blue-600 to-blue-700'
      : 'from-slate-900 via-blue-900 to-slate-800';
  };

  // Show geolocation prompt
  if (appState === 'prompt' && !showSearch) {
    return (
      <main className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()}`}>
        <GeolocationPrompt
          onAllow={requestGeolocation}
          onManual={handleManualSearch}
        />
      </main>
    );
  }

  // Show loading state
  if (appState === 'loading') {
    return (
      <main className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()} flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/70">Fetching weather data...</p>
        </div>
      </main>
    );
  }

  // Main weather view
  return (
    <main className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()} transition-all duration-1000`}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <header className="flex flex-col items-center mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <CloudRain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Weather App</h1>
          </div>
          <SearchBar
            onLocationSelect={handleLocationSelect}
            onRequestGeolocation={requestGeolocation}
            isLoadingLocation={isLoadingLocation}
          />
        </header>

        {/* Error message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Weather content */}
        {weather && (
          <div className="space-y-4 sm:space-y-6">
            {/* Alerts */}
            {weather.alerts?.alert && weather.alerts.alert.length > 0 && (
              <WeatherAlerts alerts={weather.alerts.alert} />
            )}

            {/* Current weather */}
            <CurrentWeatherCard location={weather.location} current={weather.current} />

            {/* Hourly forecast */}
            {weather.forecast.forecastday[0] && (
              <HourlyForecast
                hours={[
                  ...weather.forecast.forecastday[0].hour,
                  ...(weather.forecast.forecastday[1]?.hour || []),
                ]}
              />
            )}

            {/* 3-day forecast */}
            <ForecastCard days={weather.forecast.forecastday} />

            {/* Sun & Moon */}
            {weather.forecast.forecastday[0] && (
              <AstroCard astro={weather.forecast.forecastday[0].astro} />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center text-white/40 text-xs sm:text-sm">
          <p>
            Powered by{' '}
            <a
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/60"
            >
              WeatherAPI.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
