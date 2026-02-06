'use client';

import { Astro } from '@/lib/api';
import { Sunrise, Sunset, Moon } from 'lucide-react';

interface AstroCardProps {
  astro: Astro;
}

export default function AstroCard({ astro }: AstroCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Sun & Moon</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center border border-white/10">
          <Sunrise className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-1 sm:mb-2" />
          <div className="text-white/60 text-xs sm:text-sm">Sunrise</div>
          <div className="text-white font-medium text-sm sm:text-base">{astro.sunrise}</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center border border-white/10">
          <Sunset className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mx-auto mb-1 sm:mb-2" />
          <div className="text-white/60 text-xs sm:text-sm">Sunset</div>
          <div className="text-white font-medium text-sm sm:text-base">{astro.sunset}</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center border border-white/10">
          <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200 mx-auto mb-1 sm:mb-2" />
          <div className="text-white/60 text-xs sm:text-sm">Moon Phase</div>
          <div className="text-white font-medium text-xs sm:text-sm">{astro.moon_phase}</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center border border-white/10">
          <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-200"
               style={{
                 background: `conic-gradient(from 0deg, #fbbf24 ${astro.moon_illumination}%, #374151 ${astro.moon_illumination}%)`
               }}
          />
          <div className="text-white/60 text-xs sm:text-sm">Illumination</div>
          <div className="text-white font-medium text-sm sm:text-base">{astro.moon_illumination}%</div>
        </div>
      </div>
    </div>
  );
}
