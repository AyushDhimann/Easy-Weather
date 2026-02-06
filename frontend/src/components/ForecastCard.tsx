'use client';

import { ForecastDay } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { Droplets, Wind } from 'lucide-react';
import Image from 'next/image';

interface ForecastCardProps {
  days: ForecastDay[];
}

export default function ForecastCard({ days }: ForecastCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">3-Day Forecast</h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {days.map((day, index) => {
          const date = parseISO(day.date);
          const iconUrl = day.day.condition.icon.startsWith('//')
            ? `https:${day.day.condition.icon}`
            : day.day.condition.icon;

          return (
            <div
              key={day.date}
              className={`p-3 sm:p-5 rounded-2xl ${
                index === 0
                  ? 'bg-white/15 border border-white/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="text-center">
                <div className="text-white/60 text-xs sm:text-sm mb-1">
                  {index === 0 ? 'Today' : format(date, 'EEE')}
                </div>
                <div className="text-white font-medium text-sm sm:text-base">
                  {format(date, 'MMM d')}
                </div>
              </div>

              <div className="flex justify-center my-2 sm:my-4">
                <Image
                  src={iconUrl}
                  alt={day.day.condition.text}
                  width={64}
                  height={64}
                  className="drop-shadow-lg w-12 h-12 sm:w-16 sm:h-16"
                />
              </div>

              <div className="text-center mb-2 sm:mb-4">
                <div className="text-white text-sm sm:text-lg font-semibold">
                  {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
                </div>
                <div className="text-white/60 text-xs sm:text-sm hidden sm:block">{day.day.condition.text}</div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-4 text-xs sm:text-sm text-white/70">
                <div className="flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{day.day.daily_chance_of_rain}%</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Wind className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{Math.round(day.day.maxwind_kph)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
