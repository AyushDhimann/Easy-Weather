'use client';

import { CurrentWeather, Location } from '@/lib/api';
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Thermometer,
  Sun,
} from 'lucide-react';
import Image from 'next/image';

interface CurrentWeatherCardProps {
  location: Location;
  current: CurrentWeather;
}

export default function CurrentWeatherCard({ location, current }: CurrentWeatherCardProps) {
  const iconUrl = current.condition.icon.startsWith('//')
    ? `https:${current.condition.icon}`
    : current.condition.icon;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-xl">
      <div className="flex flex-col items-center md:flex-row md:items-start justify-between gap-4 md:gap-6">
        {/* Main temperature display */}
        <div className="text-center md:text-left w-full md:w-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-white/90 mb-1">
            {location.name}
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mb-3 md:mb-4">
            {location.region && `${location.region}, `}
            {location.country}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-4">
            <Image
              src={iconUrl}
              alt={current.condition.text}
              width={96}
              height={96}
              className="drop-shadow-lg w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
            />
            <div>
              <div className="text-5xl sm:text-6xl md:text-7xl font-light text-white">
                {Math.round(current.temp_c)}°
              </div>
              <div className="text-white/70 text-sm sm:text-base mt-1">
                Feels like {Math.round(current.feelslike_c)}°
              </div>
            </div>
          </div>
          <p className="text-lg sm:text-xl text-white/80 mt-3 md:mt-4">{current.condition.text}</p>
        </div>

        {/* Weather stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full md:w-auto">
          <StatCard
            icon={<Droplets className="w-5 h-5" />}
            label="Humidity"
            value={`${current.humidity}%`}
          />
          <StatCard
            icon={<Wind className="w-5 h-5" />}
            label="Wind"
            value={`${Math.round(current.wind_kph)} km/h`}
            subValue={current.wind_dir}
          />
          <StatCard
            icon={<Eye className="w-5 h-5" />}
            label="Visibility"
            value={`${current.vis_km} km`}
          />
          <StatCard
            icon={<Gauge className="w-5 h-5" />}
            label="Pressure"
            value={`${current.pressure_mb} mb`}
          />
          <StatCard
            icon={<Thermometer className="w-5 h-5" />}
            label="UV Index"
            value={current.uv.toString()}
            subValue={getUVLevel(current.uv)}
          />
          <StatCard
            icon={<Sun className="w-5 h-5" />}
            label="Cloud Cover"
            value={`${current.cloud}%`}
          />
        </div>
      </div>

      {/* Air Quality Section */}
      {current.air_quality && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-lg font-medium text-white/90 mb-4">Air Quality</h3>
          <AirQualityBar epaIndex={current.air_quality['us-epa-index']} />
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
      <div className="flex items-center gap-1 sm:gap-2 text-white/60 mb-1 sm:mb-2">
        {icon}
        <span className="text-xs sm:text-sm">{label}</span>
      </div>
      <div className="text-base sm:text-lg md:text-xl font-semibold text-white">{value}</div>
      {subValue && <div className="text-xs sm:text-sm text-white/50">{subValue}</div>}
    </div>
  );
}

function getUVLevel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

function AirQualityBar({ epaIndex }: { epaIndex: number }) {
  const levels = ['Good', 'Moderate', 'Unhealthy (Sensitive)', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
  const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500', 'bg-rose-900'];
  const level = Math.min(epaIndex - 1, 5);

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i <= level ? colors[i] : 'bg-white/10'}`}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${colors[level].replace('bg-', 'text-')}`}>
          {levels[level]}
        </span>
        <span className="text-sm text-white/50">US EPA Index: {epaIndex}</span>
      </div>
    </div>
  );
}
