// DOM Elements
const setupView = document.getElementById('setup-view');
const weatherView = document.getElementById('weather-view');
const loadingOverlay = document.getElementById('loading');
const errorToast = document.getElementById('error-toast');
const errorMessage = document.getElementById('error-message');

// Setup elements
const useLocationBtn = document.getElementById('use-location-btn');
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

// Weather elements
const locationName = document.getElementById('location-name');
const locationRegion = document.getElementById('location-region');
const weatherIcon = document.getElementById('weather-icon');
const currentTemp = document.getElementById('current-temp');
const feelsLike = document.getElementById('feels-like');
const conditionText = document.getElementById('condition-text');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const visibility = document.getElementById('visibility');
const uv = document.getElementById('uv');
const forecast = document.getElementById('forecast');
const airQualitySection = document.getElementById('air-quality');
const aqiIndicator = document.getElementById('aqi-indicator');
const aqiText = document.getElementById('aqi-text');
const lastUpdate = document.getElementById('last-update');
const refreshBtn = document.getElementById('refresh-btn');
const resetBtn = document.getElementById('reset-btn');

// API Config
const WEATHER_API_KEY = '36fc8cb2a2c3481fa3c110635260602';
const WEATHER_API_BASE = 'http://api.weatherapi.com/v1';

// Show/hide loading
function showLoading() {
  loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  loadingOverlay.classList.add('hidden');
}

// Show error toast
function showError(message) {
  errorMessage.textContent = message;
  errorToast.classList.remove('hidden');
  setTimeout(() => {
    errorToast.classList.add('hidden');
  }, 3000);
}

// Switch views
function showSetupView() {
  setupView.classList.remove('hidden');
  weatherView.classList.add('hidden');
}

function showWeatherView() {
  setupView.classList.add('hidden');
  weatherView.classList.remove('hidden');
}

// Search for locations
async function searchLocations(query) {
  if (query.length < 2) {
    searchResults.classList.remove('active');
    return;
  }
  
  try {
    const url = `${WEATHER_API_BASE}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.length > 0) {
      searchResults.innerHTML = data.map(loc => `
        <div class="search-result-item" data-lat="${loc.lat}" data-lon="${loc.lon}">
          <div class="name">${loc.name}</div>
          <div class="region">${loc.region ? `${loc.region}, ` : ''}${loc.country}</div>
        </div>
      `).join('');
      searchResults.classList.add('active');
    } else {
      searchResults.classList.remove('active');
    }
  } catch (error) {
    console.error('Search error:', error);
  }
}

// Set location and fetch weather
async function setLocation(locationQuery) {
  showLoading();
  
  try {
    // Send message to background script to save location and update weather
    const response = await chrome.runtime.sendMessage({
      type: 'SET_LOCATION',
      location: locationQuery
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to set location');
    }
    
    // Wait a moment for data to be saved
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Load and display weather
    await loadWeatherFromStorage();
  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}

// Get user's geolocation
function getUserLocation() {
  showLoading();
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setLocation(`${latitude},${longitude}`);
    },
    (error) => {
      hideLoading();
      let message = 'Could not get your location';
      if (error.code === error.PERMISSION_DENIED) {
        message = 'Location permission denied. Please enter a city manually.';
      }
      showError(message);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// Format date for forecast
function formatDay(dateString, index) {
  if (index === 0) return 'Today';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Get AQI level
function getAQILevel(index) {
  const levels = ['Good', 'Moderate', 'Unhealthy (Sensitive)', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
  return levels[Math.min(index - 1, 5)] || 'Unknown';
}

// Update weather display
function displayWeather(data) {
  const { location, current, forecast: forecastData } = data;
  
  // Location
  locationName.textContent = location.name;
  locationRegion.textContent = `${location.region ? `${location.region}, ` : ''}${location.country}`;
  
  // Current weather
  const iconUrl = current.condition.icon.startsWith('//') 
    ? `https:${current.condition.icon}` 
    : current.condition.icon;
  weatherIcon.src = iconUrl;
  currentTemp.textContent = `${Math.round(current.temp_c)}°`;
  feelsLike.textContent = `Feels like ${Math.round(current.feelslike_c)}°`;
  conditionText.textContent = current.condition.text;
  
  // Stats
  humidity.textContent = `${current.humidity}%`;
  wind.textContent = `${Math.round(current.wind_kph)} km/h`;
  visibility.textContent = `${current.vis_km} km`;
  uv.textContent = current.uv.toString();
  
  // Forecast
  if (forecastData && forecastData.forecastday) {
    forecast.innerHTML = forecastData.forecastday.map((day, index) => {
      const dayIconUrl = day.day.condition.icon.startsWith('//') 
        ? `https:${day.day.condition.icon}` 
        : day.day.condition.icon;
      return `
        <div class="forecast-day">
          <div class="day-name">${formatDay(day.date, index)}</div>
          <img src="${dayIconUrl}" alt="${day.day.condition.text}">
          <div class="temps">
            <span class="high">${Math.round(day.day.maxtemp_c)}°</span>
            <span class="low">${Math.round(day.day.mintemp_c)}°</span>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Air Quality
  if (current.air_quality) {
    const epaIndex = current.air_quality['us-epa-index'];
    if (epaIndex) {
      airQualitySection.classList.remove('hidden');
      // Position indicator (0-100% based on 1-6 scale)
      const position = ((epaIndex - 1) / 5) * 100;
      aqiIndicator.style.left = `${Math.min(position, 100)}%`;
      aqiText.textContent = `${getAQILevel(epaIndex)} (US EPA Index: ${epaIndex})`;
    }
  }
  
  showWeatherView();
  hideLoading();
}

// Load weather from storage
async function loadWeatherFromStorage() {
  try {
    const { weatherData, lastUpdate: updateTime, location } = await chrome.storage.local.get([
      'weatherData',
      'lastUpdate',
      'location'
    ]);
    
    if (!location) {
      showSetupView();
      hideLoading();
      return;
    }
    
    if (weatherData) {
      displayWeather(weatherData);
      
      // Update last updated time
      if (updateTime) {
        const date = new Date(updateTime);
        lastUpdate.textContent = `Last updated: ${date.toLocaleTimeString()}`;
      }
    } else {
      // No cached data, trigger an update
      await chrome.runtime.sendMessage({ type: 'UPDATE_WEATHER' });
      // Wait and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { weatherData: newData } = await chrome.storage.local.get('weatherData');
      if (newData) {
        displayWeather(newData);
      } else {
        showSetupView();
      }
    }
  } catch (error) {
    console.error('Error loading weather:', error);
    showSetupView();
  }
  
  hideLoading();
}

// Refresh weather
async function refreshWeather() {
  showLoading();
  try {
    await chrome.runtime.sendMessage({ type: 'UPDATE_WEATHER' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadWeatherFromStorage();
  } catch (error) {
    showError('Failed to refresh weather');
    hideLoading();
  }
}

// Reset location
async function resetLocation() {
  if (confirm('Reset your saved location?')) {
    showLoading();
    try {
      await chrome.runtime.sendMessage({ type: 'RESET' });
      showSetupView();
    } catch (error) {
      showError('Failed to reset');
    }
    hideLoading();
  }
}

// Event Listeners
useLocationBtn.addEventListener('click', getUserLocation);

searchBtn.addEventListener('click', () => {
  const query = locationInput.value.trim();
  if (query) {
    setLocation(query);
  }
});

locationInput.addEventListener('input', (e) => {
  searchLocations(e.target.value);
});

locationInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = locationInput.value.trim();
    if (query) {
      searchResults.classList.remove('active');
      setLocation(query);
    }
  }
});

searchResults.addEventListener('click', (e) => {
  const item = e.target.closest('.search-result-item');
  if (item) {
    const lat = item.dataset.lat;
    const lon = item.dataset.lon;
    searchResults.classList.remove('active');
    setLocation(`${lat},${lon}`);
  }
});

refreshBtn.addEventListener('click', refreshWeather);
resetBtn.addEventListener('click', resetLocation);

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    searchResults.classList.remove('active');
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  showLoading();
  loadWeatherFromStorage();
});
