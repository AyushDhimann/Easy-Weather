'use client';

import { MapPin, Navigation, Chrome } from 'lucide-react';

interface GeolocationPromptProps {
  onAllow: () => void;
  onManual: () => void;
}

export default function GeolocationPrompt({ onAllow, onManual }: GeolocationPromptProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                        flex items-center justify-center">
          <Navigation className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome to Weather App</h1>
        <p className="text-white/70 text-sm sm:text-base mb-6 sm:mb-8">
          Get accurate weather information for your location. Allow location access for the best experience.
        </p>

        <div className="space-y-3">
          <button
            onClick={onAllow}
            className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                       text-white font-semibold hover:opacity-90 transition-opacity
                       flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            Use My Location
          </button>

          <button
            onClick={onManual}
            className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl bg-white/10 border border-white/20
                       text-white font-medium hover:bg-white/20 transition-colors text-sm sm:text-base"
          >
            Enter Location Manually
          </button>
        </div>

        <p className="text-white/50 text-xs mt-4 sm:mt-6">
          Your location data is only used to fetch weather information and is never stored.
        </p>

        {/* Extension promo */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <a
            href="https://github.com/AyushDhimann/Wednesday-Assignment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 text-xs sm:text-sm transition-colors"
          >
            <Chrome className="w-4 h-4" />
            <span>Also available as a browser extension!</span>
          </a>
        </div>
      </div>
    </div>
  );
}
