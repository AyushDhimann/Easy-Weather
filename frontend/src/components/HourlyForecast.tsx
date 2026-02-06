'use client';

import { HourForecast } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HourlyForecastProps {
  hours: HourForecast[];
}

export default function HourlyForecast({ hours }: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter to show only future hours (next 24 hours)
  const now = Date.now();
  const futureHours = hours.filter((h) => h.time_epoch * 1000 >= now).slice(0, 24);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (futureHours.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Hourly Forecast</h3>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {futureHours.map((hour) => {
          const time = parseISO(hour.time);
          const iconUrl = hour.condition.icon.startsWith('//')
            ? `https:${hour.condition.icon}`
            : hour.condition.icon;

          return (
            <div
              key={hour.time_epoch}
              className="flex-shrink-0 w-16 sm:w-20 text-center p-2 sm:p-3 rounded-xl bg-white/5 
                         border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">
                {format(time, 'h a')}
              </div>
              <Image
                src={iconUrl}
                alt={hour.condition.text}
                width={40}
                height={40}
                className="mx-auto drop-shadow w-8 h-8 sm:w-10 sm:h-10"
              />
              <div className="text-white font-medium mt-1 sm:mt-2 text-sm sm:text-base">
                {Math.round(hour.temp_c)}°
              </div>
              {hour.chance_of_rain > 0 && (
                <div className="text-blue-300 text-xs mt-1">
                  {hour.chance_of_rain}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
