// Weather API Configuration
const WEATHER_API_KEY = '36fc8cb2a2c3481fa3c110635260602';
const WEATHER_API_BASE = 'http://api.weatherapi.com/v1';
const UPDATE_INTERVAL_HOURS = 3;
const ALARM_NAME = 'weatherUpdate';

// Weather condition codes to letter mapping
const CONDITION_MAP = {
  // Clear/Sunny (day and night)
  1000: 'S', // Sunny (day) / Clear (night)
  // Partly cloudy
  1003: 'C', // Partly cloudy
  // Cloudy
  1006: 'C', // Cloudy
  1009: 'C', // Overcast
  // Mist/Fog
  1030: 'F', // Mist
  1135: 'F', // Fog
  1147: 'F', // Freezing fog
  // Rain
  1063: 'R', // Patchy rain possible
  1150: 'R', // Patchy light drizzle
  1153: 'R', // Light drizzle
  1168: 'R', // Freezing drizzle
  1171: 'R', // Heavy freezing drizzle
  1180: 'R', // Patchy light rain
  1183: 'R', // Light rain
  1186: 'R', // Moderate rain at times
  1189: 'R', // Moderate rain
  1192: 'R', // Heavy rain at times
  1195: 'R', // Heavy rain
  1198: 'R', // Light freezing rain
  1201: 'R', // Moderate or heavy freezing rain
  1240: 'R', // Light rain shower
  1243: 'R', // Moderate or heavy rain shower
  1246: 'R', // Torrential rain shower
  // Snow
  1066: 'N', // Patchy snow possible
  1114: 'N', // Blowing snow
  1117: 'N', // Blizzard
  1210: 'N', // Patchy light snow
  1213: 'N', // Light snow
  1216: 'N', // Patchy moderate snow
  1219: 'N', // Moderate snow
  1222: 'N', // Patchy heavy snow
  1225: 'N', // Heavy snow
  1255: 'N', // Light snow showers
  1258: 'N', // Moderate or heavy snow showers
  // Sleet
  1069: 'L', // Patchy sleet possible
  1204: 'L', // Light sleet
  1207: 'L', // Moderate or heavy sleet
  1249: 'L', // Light sleet showers
  1252: 'L', // Moderate or heavy sleet showers
  // Ice
  1072: 'I', // Patchy freezing drizzle possible
  1237: 'I', // Ice pellets
  1261: 'I', // Light showers of ice pellets
  1264: 'I', // Moderate or heavy showers of ice pellets
  // Thunder
  1087: 'T', // Thundery outbreaks possible
  1273: 'T', // Patchy light rain with thunder
  1276: 'T', // Moderate or heavy rain with thunder
  1279: 'T', // Patchy light snow with thunder
  1282: 'T', // Moderate or heavy snow with thunder
};

// Get condition letter from code
function getConditionLetter(code) {
  return CONDITION_MAP[code] || 'C'; // Default to Cloudy
}

// Fetch weather data from API
async function fetchWeather(location) {
  const url = `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=yes&alerts=yes`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// Generate dynamic icon with temperature and condition
function generateIconData(temp, conditionLetter, size) {
  // Create an offscreen canvas
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background colors based on condition - higher contrast
  const bgColors = {
    'S': '#FF8C00', // Sunny/Clear - dark orange
    'C': '#546E7A', // Cloudy - dark blue-grey
    'R': '#1565C0', // Rain - dark blue
    'N': '#607D8B', // Snow - blue grey
    'T': '#4527A0', // Thunder - deep purple
    'F': '#78909C', // Fog - grey
    'L': '#0097A7', // Sleet - dark cyan
    'I': '#00838F', // Ice - dark teal
  };
  
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Draw solid background (no rounded corners for small sizes)
  ctx.fillStyle = bgColors[conditionLetter] || '#546E7A';
  ctx.fillRect(0, 0, size, size);
  
  // Add dark border for visibility
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.strokeRect(0, 0, size, size);
  
  // Text settings - white with black outline for readability
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Format temperature (round to integer)
  const tempVal = Math.round(temp);
  const tempStr = tempVal.toString();
  
  // Calculate font sizes - much larger for readability
  const tempFontSize = size * (Math.abs(tempVal) >= 10 ? 0.55 : 0.65);
  const letterFontSize = size * 0.35;
  
  // Function to draw text with outline
  function drawTextWithOutline(text, x, y, fontSize) {
    ctx.font = `900 ${fontSize}px Arial, sans-serif`;
    // Draw black outline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = Math.max(1, size * 0.08);
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
    // Draw white fill
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, x, y);
  }
  
  // Draw temperature (larger, top portion)
  drawTextWithOutline(tempStr + '°', size / 2, size * 0.38, tempFontSize);
  
  // Draw condition letter (bottom portion)
  drawTextWithOutline(conditionLetter, size / 2, size * 0.75, letterFontSize);
  
  return ctx.getImageData(0, 0, size, size);
}

// Update the extension icon
async function updateIcon(temp, conditionCode) {
  const conditionLetter = getConditionLetter(conditionCode);
  
  try {
    // Generate icons for different sizes
    const icon16 = generateIconData(temp, conditionLetter, 16);
    const icon32 = generateIconData(temp, conditionLetter, 32);
    const icon48 = generateIconData(temp, conditionLetter, 48);
    const icon128 = generateIconData(temp, conditionLetter, 128);
    
    await chrome.action.setIcon({
      imageData: {
        16: icon16,
        32: icon32,
        48: icon48,
        128: icon128
      }
    });
    
    // Update tooltip
    await chrome.action.setTitle({
      title: `${Math.round(temp)}°C - ${getConditionText(conditionCode)}`
    });
  } catch (error) {
    console.error('Error updating icon:', error);
  }
}

// Get human-readable condition text
function getConditionText(code) {
  const texts = {
    'S': 'Sunny',
    'C': 'Cloudy',
    'R': 'Rainy',
    'N': 'Snowy',
    'T': 'Thunder',
    'F': 'Foggy',
    'L': 'Sleet',
    'I': 'Icy',
  };
  const letter = getConditionLetter(code);
  return texts[letter] || 'Unknown';
}

// Update weather data and icon
async function updateWeather() {
  try {
    const { location } = await chrome.storage.local.get('location');
    
    if (!location) {
      console.log('No location saved, skipping weather update');
      return;
    }
    
    console.log('Fetching weather for:', location);
    const data = await fetchWeather(location);
    
    // Save weather data
    await chrome.storage.local.set({
      weatherData: data,
      lastUpdate: Date.now()
    });
    
    // Update icon
    await updateIcon(data.current.temp_c, data.current.condition.code);
    
    console.log('Weather updated successfully');
  } catch (error) {
    console.error('Error updating weather:', error);
  }
}

// Setup alarm for periodic updates
async function setupAlarm() {
  // Clear existing alarm
  await chrome.alarms.clear(ALARM_NAME);
  
  // Create new alarm (runs every 3 hours)
  await chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: UPDATE_INTERVAL_HOURS * 60
  });
  
  console.log(`Weather update alarm set for every ${UPDATE_INTERVAL_HOURS} hours`);
}

// Handle alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    updateWeather();
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_WEATHER') {
    updateWeather().then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (message.type === 'SET_LOCATION') {
    chrome.storage.local.set({ location: message.location }).then(() => {
      updateWeather().then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
    });
    return true;
  }
  
  if (message.type === 'RESET') {
    chrome.storage.local.clear().then(async () => {
      // Reset to default icon
      await chrome.action.setIcon({
        path: {
          16: 'icons/default-16.png',
          32: 'icons/default-32.png',
          48: 'icons/default-48.png',
          128: 'icons/default-128.png'
        }
      });
      await chrome.action.setTitle({ title: 'Weather Dashboard' });
      sendResponse({ success: true });
    });
    return true;
  }
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Weather extension installed');
  setupAlarm();
});

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started, checking weather...');
  setupAlarm();
  updateWeather();
});

// Initial setup
setupAlarm();
