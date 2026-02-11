# Easy Weather

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/AyushDhimann/Easy-Weather)

A modern weather application featuring a standalone Next.js web app and a Chrome browser extension with dynamic icons.

## Demo

#### Website Demo

![Website Demo](assets/Website%20Demo.gif)

#### Extension Demo

<img src="assets/Extension%20Demo.gif" alt="Extension Demo" width="100%" />

#### Extension Dynamic Icons

<div>
  <img src="assets/Extension-1.png" alt="Extension Icon Example 1" width="48%" style="display: inline-block; margin-right: 3%;" />
  <img src="assets/Extension-2.png" alt="Extension Icon Example 2" width="48%" style="display: inline-block;" />
</div>

## Features

### Web App (Next.js)
- **Real-time Weather** - Current conditions with temperature, humidity, wind, and UV index
- **3-Day Forecast** - Daily high/low temperatures and conditions
- **Hourly Forecast** - 24-hour scrollable forecast
- **Air Quality Index** - US EPA air quality data with visual indicator
- **Weather Alerts** - Government-issued weather warnings
- **Sun & Moon Data** - Sunrise, sunset, moon phase, and illumination
- **Geolocation** - Browser location detection with permission prompt
- **Search** - Autocomplete city search (name, zip code, or coordinates)
- **Dynamic Backgrounds** - Background gradient changes based on weather conditions
- **Standalone Architecture** - No separate backend, API calls via Next.js API routes

### Browser Extension (Chrome/Edge)
- **Dynamic Icons** - Extension icon shows temperature + condition (e.g., "23-S" for 23°C Sunny, "15-R" for 15°C Rainy)
- **Persistent Storage** - Location saved across browser restarts
- **Auto-Updates** - Weather refreshes every 3 hours automatically
- **Popup Dashboard** - Full weather details in a beautiful popup UI
- **Geolocation Support** - Use current location or search manually
- **Reset Button** - Clear saved location and start fresh

## Tech Stack

### Frontend (Standalone)
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting
- **Next.js API Routes** - Server-side API proxy

### Browser Extension
- **Manifest V3** - Latest Chrome extension standard
- **Service Worker** - Background updates and icon generation
- **Chrome Storage API** - Persistent location storage
- **Chrome Alarms API** - Scheduled weather updates
- **OffscreenCanvas** - Dynamic icon generation

### API
- **WeatherAPI.com** - Weather data provider

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/weather/     # Next.js API routes
│   │   │   ├── page.tsx         # Main weather page
│   │   │   └── layout.tsx       # Root layout
│   │   ├── components/          # React components
│   │   └── lib/                 # API utilities
│   ├── .env.local               # API key
│   ├── next.config.ts           # Next.js configuration
│   └── package.json             # Node dependencies
├── extension/
│   ├── manifest.json            # Extension manifest (V3)
│   ├── background.js            # Service worker (updates, icon generation)
│   ├── popup.html               # Dashboard popup
│   ├── popup.css                # Popup styles
│   ├── popup.js                 # Popup logic
│   └── icons/                   # Default icons (16, 32, 48, 128px)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Chrome or Edge browser (for extension)
- WeatherAPI.com API key

### Web App Setup

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:9876

### Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `extension/` folder
5. The Weather Dashboard icon will appear in your toolbar

### Environment Variables

#### Web App
Create `frontend/.env.local`:
```
WEATHER_API_KEY=your_api_key_here
```

#### Browser Extension
The extension requires an API key in two files:

1. **extension/background.js** - Line 2:
   ```javascript
   const WEATHER_API_KEY = 'your_api_key_here';
   ```

2. **extension/popup.js** - Line 2:
   ```javascript
   const WEATHER_API_KEY = 'your_api_key_here';
   ```

Get a free API key at [weatherapi.com](https://www.weatherapi.com/).

## Dynamic Icon System

The browser extension features a unique dynamic icon that shows:
- **Temperature** with degree symbol (e.g., `23°`, `-11°`)
- **Condition Letter**:
  - S = Sunny (daytime only)
  - C = Clear (nighttime)
  - P = Partly Cloudy
  - O = Overcast / Cloudy
  - R = Rain / Drizzle
  - N = Snow / Blizzard
  - T = Thunderstorm
  - F = Fog / Mist
  - L = Sleet
  - I = Ice Pellets

The icon uses high-contrast colors with outlined text for maximum readability at small sizes.

Examples: 
- `23°S` = 23°C and Sunny (daytime)
- `-11°C` = -11°C and Clear (nighttime)

Icons update automatically every 3 hours or when you manually refresh.

## API Endpoints (Next.js)

| Endpoint | Description |
|----------|-------------|
| `GET /api/weather/current?q=<location>` | Current weather |
| `GET /api/weather/forecast?q=<location>&days=3` | Forecast with alerts |
| `GET /api/weather/search?q=<query>` | Location autocomplete |

## User Workflow

### Web App
1. User is prompted to allow location access or enter manually
2. Weather data is fetched and displayed with dynamic background
3. User can search for other locations using the search bar
4. Last location is saved in localStorage for return visits

### Extension
1. Click extension icon → Setup screen appears
2. Choose "Use My Location" or search for a city
3. Weather popup shows with all details
4. Icon updates to show current temperature + condition
5. Data persists and auto-updates every 3 hours
6. Use "Reset Location" to start over

## License

MIT
